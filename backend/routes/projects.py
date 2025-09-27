from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from sqlalchemy.exc import SQLAlchemyError

from models import Project, ProjectUser, User, db
from serializers import (
    project_schema, projects_schema, 
    project_user_schema, project_users_schema
)
from utils.errors import (
    ValidationError, UnauthorizedError, 
    ForbiddenError, NotFoundError
)

# Create blueprint
projects_bp = Blueprint('projects', __name__)

@projects_bp.route('', methods=['POST'])
@jwt_required()
def create_project():
    """Create a new project"""
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    # Validate input
    if not data or not data.get('name'):
        raise ValidationError('Project name is required')
    
    try:
        # Create project
        project = Project(
            name=data['name'],
            description=data.get('description'),
            manager_id=current_user_id
        )
        
        db.session.add(project)
        db.session.flush()  # Get the project ID
        
        # Add creator as project admin
        project_user = ProjectUser(
            project_id=project.id,
            user_id=current_user_id,
            role='admin'
        )
        db.session.add(project_user)
        db.session.commit()
        
        return jsonify({
            'message': 'Project created successfully',
            'project': project_schema.dump(project)
        }), 201
        
    except SQLAlchemyError as e:
        db.session.rollback()
        current_app.logger.error(f'Database error: {str(e)}')
        raise ValidationError('Failed to create project')

@projects_bp.route('', methods=['GET'])
@jwt_required()
def get_projects():
    """Get all projects for current user"""
    current_user_id = get_jwt_identity()
    
    # Get projects where user is a member
    projects = Project.query.join(ProjectUser).filter(
        ProjectUser.user_id == current_user_id
    ).all()
    
    return jsonify({
        'projects': projects_schema.dump(projects)
    })

@projects_bp.route('/<int:project_id>', methods=['GET'])
@jwt_required()
def get_project(project_id):
    """Get project details"""
    current_user_id = get_jwt_identity()
    
    # Check if user has access to the project
    project_user = ProjectUser.query.filter_by(
        project_id=project_id,
        user_id=current_user_id
    ).first()
    
    if not project_user:
        raise ForbiddenError('You do not have access to this project')
    
    project = Project.query.get_or_404(project_id)
    return jsonify(project_schema.dump(project))

@projects_bp.route('/<int:project_id>', methods=['PUT', 'PATCH'])
@jwt_required()
def update_project(project_id):
    """Update project details"""
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    # Check if user is project admin
    project_user = ProjectUser.query.filter_by(
        project_id=project_id,
        user_id=current_user_id,
        role='admin'
    ).first()
    
    if not project_user:
        raise ForbiddenError('Only project admins can update the project')
    
    project = Project.query.get_or_404(project_id)
    
    # Update fields
    if 'name' in data:
        project.name = data['name']
    if 'description' in data:
        project.description = data['description']
    if 'status' in data:
        project.status = data['status']
    
    db.session.commit()
    
    return jsonify({
        'message': 'Project updated successfully',
        'project': project_schema.dump(project)
    })

@projects_bp.route('/<int:project_id>', methods=['DELETE'])
@jwt_required()
def delete_project(project_id):
    """Delete a project"""
    current_user_id = get_jwt_identity()
    
    # Check if user is project admin
    project_user = ProjectUser.query.filter_by(
        project_id=project_id,
        user_id=current_user_id,
        role='admin'
    ).first()
    
    if not project_user:
        raise ForbiddenError('Only project admins can delete the project')
    
    project = Project.query.get_or_404(project_id)
    
    db.session.delete(project)
    db.session.commit()
    
    return jsonify({'message': 'Project deleted successfully'})

@projects_bp.route('/<int:project_id>/members', methods=['GET'])
@jwt_required()
def get_project_members(project_id):
    """Get all members of a project"""
    current_user_id = get_jwt_identity()
    
    # Check if user has access to the project
    project_user = ProjectUser.query.filter_by(
        project_id=project_id,
        user_id=current_user_id
    ).first()
    
    if not project_user:
        raise ForbiddenError('You do not have access to this project')
    
    # Get all project members
    members = ProjectUser.query.filter_by(project_id=project_id).all()
    
    return jsonify({
        'members': project_users_schema.dump(members)
    })

@projects_bp.route('/<int:project_id>/members', methods=['POST'])
@jwt_required()
def add_project_member(project_id):
    """Add a member to the project"""
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    # Check if user is project admin
    project_admin = ProjectUser.query.filter_by(
        project_id=project_id,
        user_id=current_user_id,
        role='admin'
    ).first()
    
    if not project_admin:
        raise ForbiddenError('Only project admins can add members')
    
    # Validate input
    if not data or not data.get('user_id') or not data.get('role'):
        raise ValidationError('User ID and role are required')
    
    # Check if user exists
    user = User.query.get(data['user_id'])
    if not user:
        raise NotFoundError('User not found')
    
    # Check if user is already a member
    existing_member = ProjectUser.query.filter_by(
        project_id=project_id,
        user_id=data['user_id']
    ).first()
    
    if existing_member:
        raise ValidationError('User is already a member of this project')
    
    try:
        # Add user to project
        project_user = ProjectUser(
            project_id=project_id,
            user_id=data['user_id'],
            role=data['role']
        )
        
        db.session.add(project_user)
        db.session.commit()
        
        return jsonify({
            'message': 'Member added successfully',
            'member': project_user_schema.dump(project_user)
        }), 201
        
    except SQLAlchemyError as e:
        db.session.rollback()
        current_app.logger.error(f'Database error: {str(e)}')
        raise ValidationError('Failed to add member to project')

@projects_bp.route('/<int:project_id>/members/<int:user_id>', methods=['DELETE'])
@jwt_required()
def remove_project_member(project_id, user_id):
    """Remove a member from the project"""
    current_user_id = get_jwt_identity()
    
    # Check if user is project admin
    project_admin = ProjectUser.query.filter_by(
        project_id=project_id,
        user_id=current_user_id,
        role='admin'
    ).first()
    
    # Allow users to remove themselves
    if not project_admin and current_user_id != user_id:
        raise ForbiddenError('Only project admins can remove members')
    
    # Prevent removing the last admin
    if project_admin and current_user_id == user_id:
        admin_count = ProjectUser.query.filter_by(
            project_id=project_id,
            role='admin'
        ).count()
        
        if admin_count <= 1:
            raise ForbiddenError('Cannot remove the only admin. Promote another admin first.')
    
    # Find and remove the member
    project_user = ProjectUser.query.filter_by(
        project_id=project_id,
        user_id=user_id
    ).first()
    
    if not project_user:
        raise NotFoundError('User is not a member of this project')
    
    db.session.delete(project_user)
    db.session.commit()
    
    return jsonify({'message': 'Member removed successfully'})
