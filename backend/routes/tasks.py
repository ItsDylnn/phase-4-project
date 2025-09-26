from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Task, Project, ProjectUser
from datetime import datetime

bp = Blueprint('tasks', __name__)

def has_project_access(user_id, project_id):
    """Check if user has access to the project."""
    return ProjectUser.query.filter_by(
        user_id=user_id,
        project_id=project_id
    ).first() is not None

@bp.route('/tasks', methods=['POST'])
@jwt_required()
def create_task():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['title', 'project_id']
    for field in required_fields:
        if not data.get(field):
            return jsonify({'message': f'{field} is required'}), 400
    
    # Check if project exists and user has access
    if not has_project_access(current_user_id, data['project_id']):
        return jsonify({'message': 'Project not found or access denied'}), 404
    
    try:
        # Create new task
        task = Task(
            title=data['title'],
            description=data.get('description', ''),
            status=data.get('status', 'pending'),
            priority=data.get('priority', 'medium'),
            due_date=datetime.fromisoformat(data['due_date']) if data.get('due_date') else None,
            project_id=data['project_id'],
            assignee_id=data.get('assignee_id')
        )
        
        db.session.add(task)
        db.session.commit()
        
        return jsonify(task.to_dict()), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Error creating task', 'error': str(e)}), 500

@bp.route('/tasks', methods=['GET'])
@jwt_required()
def get_tasks():
    current_user_id = get_jwt_identity()
    project_id = request.args.get('project_id')
    assignee_id = request.args.get('assignee_id')
    status = request.args.get('status')
    
    try:
        # Base query
        query = Task.query.join(
            Project,
            Task.project_id == Project.id
        ).join(
            ProjectUser,
            Project.id == ProjectUser.project_id
        ).filter(
            ProjectUser.user_id == current_user_id
        )
        
        # Apply filters
        if project_id:
            query = query.filter(Task.project_id == project_id)
        if assignee_id:
            query = query.filter(Task.assignee_id == assignee_id)
        if status:
            query = query.filter(Task.status == status)
        
        tasks = query.all()
        return jsonify([task.to_dict() for task in tasks])
        
    except Exception as e:
        return jsonify({'message': 'Error fetching tasks', 'error': str(e)}), 500

@bp.route('/tasks/<int:task_id>', methods=['GET'])
@jwt_required()
def get_task(task_id):
    current_user_id = get_jwt_identity()
    
    try:
        task = Task.query.get_or_404(task_id)
        
        # Check if user has access to the task's project
        if not has_project_access(current_user_id, task.project_id):
            return jsonify({'message': 'Task not found or access denied'}), 404
        
        return jsonify(task.to_dict())
        
    except Exception as e:
        return jsonify({'message': 'Error fetching task', 'error': str(e)}), 500

@bp.route('/tasks/<int:task_id>', methods=['PUT'])
@jwt_required()
def update_task(task_id):
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    try:
        task = Task.query.get_or_404(task_id)
        
        # Check if user has access to the task's project
        if not has_project_access(current_user_id, task.project_id):
            return jsonify({'message': 'Task not found or access denied'}), 404
        
        # Update task fields
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
        if 'assignee_id' in data:
            # Check if assignee is a member of the project
            if data['assignee_id'] and not has_project_access(data['assignee_id'], task.project_id):
                return jsonify({'message': 'Assignee must be a member of the project'}), 400
            task.assignee_id = data['assignee_id']
        
        db.session.commit()
        return jsonify(task.to_dict())
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Error updating task', 'error': str(e)}), 500

@bp.route('/tasks/<int:task_id>', methods=['DELETE'])
@jwt_required()
def delete_task(task_id):
    current_user_id = get_jwt_identity()
    
    try:
        task = Task.query.get_or_404(task_id)
        
        # Check if user has access to the task's project
        if not has_project_access(current_user_id, task.project_id):
            return jsonify({'message': 'Task not found or access denied'}), 404
        
        db.session.delete(task)
        db.session.commit()
        
        return jsonify({'message': 'Task deleted successfully'})
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Error deleting task', 'error': str(e)}), 500
