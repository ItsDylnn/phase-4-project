from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Project, User, ProjectUser

bp = Blueprint('projects', __name__)

@bp.route('/projects', methods=['POST'])
@jwt_required()
def create_project():
    data = request.get_json()
    current_user_id = get_jwt_identity()
    
    # Validate required fields
    if not data.get('name'):
        return jsonify({'message': 'Project name is required'}), 400
    
    try:
        # Create new project
        project = Project(
            name=data['name'],
            description=data.get('description', ''),
            owner_id=current_user_id
        )
        
        db.session.add(project)
        db.session.commit()
        
        # Add creator as a member
        project_user = ProjectUser(
            project_id=project.id,
            user_id=current_user_id,
            role='owner'
        )
        db.session.add(project_user)
        db.session.commit()
        
        return jsonify(project.to_dict()), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Error creating project', 'error': str(e)}), 500

@bp.route('/projects', methods=['GET'])
@jwt_required()
def get_projects():
    current_user_id = get_jwt_identity()
    
    try:
        # Get projects where user is a member or owner
        projects = Project.query.join(
            ProjectUser,
            Project.id == ProjectUser.project_id
        ).filter(
            ProjectUser.user_id == current_user_id
        ).all()
        
        return jsonify([p.to_dict() for p in projects])
        
    except Exception as e:
        return jsonify({'message': 'Error fetching projects', 'error': str(e)}), 500

@bp.route('/projects/<int:project_id>', methods=['GET'])
@jwt_required()
def get_project(project_id):
    current_user_id = get_jwt_identity()
    
    try:
        # Check if user has access to the project
        project_user = ProjectUser.query.filter_by(
            project_id=project_id,
            user_id=current_user_id
        ).first()
        
        if not project_user:
            return jsonify({'message': 'Project not found or access denied'}), 404
        
        project = Project.query.get_or_404(project_id)
        return jsonify(project.to_dict())
        
    except Exception as e:
        return jsonify({'message': 'Error fetching project', 'error': str(e)}), 500

@bp.route('/projects/<int:project_id>', methods=['PUT'])
@jwt_required()
def update_project(project_id):
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    try:
        # Check if user is the owner
        project = Project.query.get_or_404(project_id)
        if project.owner_id != current_user_id:
            return jsonify({'message': 'Only the project owner can update the project'}), 403
        
        # Update project fields
        if 'name' in data:
            project.name = data['name']
        if 'description' in data:
            project.description = data['description']
        
        db.session.commit()
        return jsonify(project.to_dict())
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Error updating project', 'error': str(e)}), 500

@bp.route('/projects/<int:project_id>', methods=['DELETE'])
@jwt_required()
def delete_project(project_id):
    current_user_id = get_jwt_identity()
    
    try:
        # Check if user is the owner
        project = Project.query.get_or_404(project_id)
        if project.owner_id != current_user_id:
            return jsonify({'message': 'Only the project owner can delete the project'}), 403
        
        db.session.delete(project)
        db.session.commit()
        
        return jsonify({'message': 'Project deleted successfully'})
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Error deleting project', 'error': str(e)}), 500
