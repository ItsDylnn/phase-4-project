from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import (
    create_access_token, 
    create_refresh_token,
    jwt_required,
    get_jwt_identity,
    get_jwt
)
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import timedelta

from models import User, db
from serializers import user_schema
from utils.errors import ValidationError, UnauthorizedError

# Create blueprint
auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    """Register a new user"""
    data = request.get_json()
    
    # Validate input
    required_fields = ['name', 'email', 'password']
    if not all(field in data for field in required_fields):
        raise ValidationError('Missing required fields')
    
    # Check if user already exists
    if User.query.filter_by(email=data['email']).first():
        raise ValidationError('Email already registered')
    
    try:
        # Create new user
        user = User(
            name=data['name'],
            email=data['email'],
            password_hash=generate_password_hash(data['password']),
            role=data.get('role', 'user')
        )
        
        db.session.add(user)
        db.session.commit()
        
        # Generate tokens
        access_token = create_access_token(identity=user.id)
        refresh_token = create_refresh_token(identity=user.id)
        
        return jsonify({
            'message': 'User registered successfully',
            'user': user_schema.dump(user),
            'access_token': access_token,
            'refresh_token': refresh_token
        }), 201
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f'Registration error: {str(e)}')
        raise ValidationError('Failed to register user')

@auth_bp.route('/login', methods=['POST'])
def login():
    """User login"""
    data = request.get_json()
    
    # Validate input
    if not data or not data.get('email') or not data.get('password'):
        raise ValidationError('Email and password are required')
    
    # Find user
    user = User.query.filter_by(email=data['email']).first()
    
    # Check credentials
    if not user or not check_password_hash(user.password_hash, data['password']):
        raise UnauthorizedError('Invalid email or password')
    
    # Generate tokens
    access_token = create_access_token(
        identity=user.id,
        expires_delta=timedelta(minutes=current_app.config['JWT_ACCESS_TOKEN_EXPIRES'])
    )
    refresh_token = create_refresh_token(identity=user.id)
    
    # Update last login
    user.last_login = db.func.now()
    db.session.commit()
    
    return jsonify({
        'message': 'Login successful',
        'access_token': access_token,
        'refresh_token': refresh_token,
        'user': user_schema.dump(user)
    })

@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    """Refresh access token"""
    current_user_id = get_jwt_identity()
    access_token = create_access_token(identity=current_user_id)
    return jsonify({'access_token': access_token})

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    """Get current user's profile"""
    current_user_id = get_jwt_identity()
    user = User.query.get_or_404(current_user_id)
    return jsonify(user_schema.dump(user))

@auth_bp.route('/change-password', methods=['POST'])
@jwt_required()
def change_password():
    """Change user's password"""
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    # Validate input
    if not data or not data.get('current_password') or not data.get('new_password'):
        raise ValidationError('Current and new password are required')
    
    user = User.query.get_or_404(current_user_id)
    
    # Verify current password
    if not check_password_hash(user.password_hash, data['current_password']):
        raise UnauthorizedError('Current password is incorrect')
    
    # Update password
    user.password_hash = generate_password_hash(data['new_password'])
    db.session.commit()
    
    return jsonify({'message': 'Password updated successfully'})
