from datetime import datetime
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy.exc import SQLAlchemyError

from models import Task, Project, ProjectUser, User, db
from serializers import task_schema, tasks_schema
from utils.errors import (
    ValidationError, UnauthorizedError, 
    ForbiddenError, NotFoundError
)

# Create blueprint
tasks_bp = Blueprint('tasks', __name__)

@tasks_bp.route('', methods=['POST'])
@jwt_required()
def create_task():
    """Create a new task"""
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    # Validate input
    required_fields = ['title', 'project_id']
    if not all(field in data for field in required_fields):
        raise ValidationError('Title and project ID are required')
    
    # Check if user has access to the project
    project_user = ProjectUser.query.filter_by(
        project_id=data['project_id'],
        user_id=current_user_id
    ).first()
    
    if not project_user:
        raise ForbiddenError('You do not have access to this project')
    
    # Check if assignee exists and is a project member
    assignee_id = data.get('assignee_id')
    if assignee_id:
        assignee_member = ProjectUser.query.filter_by(
            project_id=data['project_id'],
            user_id=assignee_id
        ).first()
        
        if not assignee_member:
            raise ValidationError('Assignee must be a project member')
    
    try:
        # Create task
        task = Task(
            title=data['title'],
            description=data.get('description'),
            status=data.get('status', 'todo'),
            priority=data.get('priority', 'medium'),
            due_date=datetime.fromisoformat(data['due_date']) if data.get('due_date') else None,
            project_id=data['project_id'],
            assignee_id=assignee_id
        )
        
        db.session.add(task)
        db.session.commit()
        
        # TODO: Send notification to assignee if assigned
        
        return jsonify({
            'message': 'Task created successfully',
            'task': task_schema.dump(task)
        }), 201
        
    except ValueError as e:
        raise ValidationError('Invalid date format. Use ISO format (YYYY-MM-DD)')
    except SQLAlchemyError as e:
        db.session.rollback()
        current_app.logger.error(f'Database error: {str(e)}')
        raise ValidationError('Failed to create task')

@tasks_bp.route('', methods=['GET'])
@jwt_required()
def get_tasks():
    """Get tasks with optional filtering"""
    current_user_id = get_jwt_identity()
    
    # Get query parameters
    project_id = request.args.get('project_id')
    status = request.args.get('status')
    assignee_id = request.args.get('assignee_id')
    
    # Start with base query for tasks in projects the user is a member of
    query = Task.query.join(Project).join(ProjectUser).filter(
        ProjectUser.user_id == current_user_id
    )
    
    # Apply filters
    if project_id:
        query = query.filter(Task.project_id == project_id)
    if status:
        query = query.filter(Task.status == status)
    if assignee_id:
        query = query.filter(Task.assignee_id == assignee_id)
    
    # Execute query
    tasks = query.order_by(Task.created_at.desc()).all()
    
    return jsonify({
        'tasks': tasks_schema.dump(tasks)
    })

@tasks_bp.route('/<int:task_id>', methods=['GET'])
@jwt_required()
def get_task(task_id):
    """Get task details"""
    current_user_id = get_jwt_identity()
    
    # Get the task with project and member check
    task = Task.query.join(Project).join(ProjectUser).filter(
        Task.id == task_id,
        ProjectUser.user_id == current_user_id
    ).first()
    
    if not task:
        raise NotFoundError('Task not found or access denied')
    
    return jsonify(task_schema.dump(task))

@tasks_bp.route('/<int:task_id>', methods=['PUT', 'PATCH'])
@jwt_required()
def update_task(task_id):
    """Update task details"""
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    # Get the task with project and member check
    task = Task.query.join(Project).join(ProjectUser).filter(
        Task.id == task_id,
        ProjectUser.user_id == current_user_id
    ).first()
    
    if not task:
        raise NotFoundError('Task not found or access denied')
    
    # Check if user can update the task
    project_user = ProjectUser.query.filter_by(
        project_id=task.project_id,
        user_id=current_user_id
    ).first()
    
    if not project_user:
        raise ForbiddenError('You do not have access to this task')
    
    # Update fields
    if 'title' in data:
        task.title = data['title']
    if 'description' in data:
        task.description = data['description']
    if 'status' in data:
        task.status = data['status']
    if 'priority' in data:
        task.priority = data['priority']
    if 'due_date' in data:
        task.due_date = datetime.fromisoformat(data['due_date']) if data['due_date'] else None
    
    # Handle assignee change
    if 'assignee_id' in data:
        new_assignee_id = data['assignee_id']
        
        # Check if new assignee is a project member
        if new_assignee_id:
            assignee_member = ProjectUser.query.filter_by(
                project_id=task.project_id,
                user_id=new_assignee_id
            ).first()
            
            if not assignee_member:
                raise ValidationError('Assignee must be a project member')
        
        task.assignee_id = new_assignee_id
        # TODO: Send notification to new assignee
    
    task.updated_at = datetime.utcnow()
    db.session.commit()
    
    return jsonify({
        'message': 'Task updated successfully',
        'task': task_schema.dump(task)
    })

@tasks_bp.route('/<int:task_id>', methods=['DELETE'])
@jwt_required()
def delete_task(task_id):
    """Delete a task"""
    current_user_id = get_jwt_identity()
    
    # Get the task with project and member check
    task = Task.query.join(Project).join(ProjectUser).filter(
        Task.id == task_id,
        ProjectUser.user_id == current_user_id,
        ProjectUser.role.in_(['admin', 'manager'])  # Only admins and managers can delete
    ).first()
    
    if not task:
        raise NotFoundError('Task not found or insufficient permissions')
    
    db.session.delete(task)
    db.session.commit()
    
    return jsonify({'message': 'Task deleted successfully'})

@tasks_bp.route('/<int:task_id>/status', methods=['PATCH'])
@jwt_required()
def update_task_status(task_id):
    """Update task status"""
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    if not data or 'status' not in data:
        raise ValidationError('Status is required')
    
    # Get the task with project and member check
    task = Task.query.join(Project).join(ProjectUser).filter(
        Task.id == task_id,
        ProjectUser.user_id == current_user_id
    ).first()
    
    if not task:
        raise NotFoundError('Task not found or access denied')
    
    # Update status
    task.status = data['status']
    task.updated_at = datetime.utcnow()
    db.session.commit()
    
    return jsonify({
        'message': 'Task status updated successfully',
        'task': task_schema.dump(task)
    })

@tasks_bp.route('/<int:task_id>/assign', methods=['PATCH'])
@jwt_required()
def assign_task(task_id):
    """Assign a task to a user"""
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    if not data or 'assignee_id' not in data:
        raise ValidationError('Assignee ID is required')
    
    # Get the task with project and member check
    task = Task.query.join(Project).join(ProjectUser).filter(
        Task.id == task_id,
        ProjectUser.user_id == current_user_id
    ).first()
    
    if not task:
        raise NotFoundError('Task not found or access denied')
    
    # Check if new assignee is a project member
    assignee_id = data['assignee_id']
    if assignee_id:
        assignee_member = ProjectUser.query.filter_by(
            project_id=task.project_id,
            user_id=assignee_id
        ).first()
        
        if not assignee_member:
            raise ValidationError('Assignee must be a project member')
    
    # Update assignee
    task.assignee_id = assignee_id
    task.updated_at = datetime.utcnow()
    db.session.commit()
    
    # TODO: Send notification to new assignee
    
    return jsonify({
        'message': 'Task assigned successfully',
        'task': task_schema.dump(task)
    })
