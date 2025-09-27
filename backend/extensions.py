"""
Extensions module for the Task Management API.

This module initializes all the Flask extensions used in the application.
"""
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from flask_mail import Mail
from flask_cors import CORS

db = SQLAlchemy()
ma = Marshmallow()
jwt = JWTManager()
migrate = Migrate()
mail = Mail()
cors = CORS()

def init_extensions(app):
    """Initialize Flask extensions with the given app."""
    # Initialize SQLAlchemy
    db.init_app(app)
    
    # Initialize Marshmallow
    ma.init_app(app)
    
    # Initialize JWT
    jwt.init_app(app)
    
    # Initialize Migrate
    migrate.init_app(app, db)
    
    # Initialize Mail
    mail.init_app(app)
    
    # Initialize CORS
    cors.init_app(app, resources={
        r"/api/*": {
            "origins": app.config.get('CORS_ORIGINS', [])
        }
    })
    
    # Create database tables if they don't exist
    with app.app_context():
        db.create_all()

def register_blueprints(app, blueprints):
    """Register Flask blueprints with URL prefixes."""
    for bp in blueprints:
        app.register_blueprint(bp, url_prefix=f'/api/{bp.name}')
        
    # Register API documentation blueprint
    if app.config.get('ENV') == 'development':
        try:
            from flasgger import Swagger
            swagger = Swagger(app, template={
                "swagger": "2.0",
                "info": {
                    "title": "Task Management API",
                    "description": "API for managing tasks and projects",
                    "version": "1.0.0",
                    "contact": {
                        "email": "support@taskmanagement.com"
                    },
                },
                "schemes": ["http", "https"],
                "securityDefinitions": {
                    "Bearer": {
                        "type": "apiKey",
                        "name": "Authorization",
                        "in": "header"
                    }
                },
                "security": [{"Bearer": []}]
            })
        except ImportError:
            app.logger.warning("Flasgger not installed. API documentation will not be available.")

# JWT Configuration
@jwt.user_identity_loader
def user_identity_lookup(user):
    return user.id

@jwt.user_lookup_loader
def user_lookup_callback(_jwt_header, jwt_data):
    from models import User
    identity = jwt_data["sub"]
    return User.query.get(identity)

@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload):
    from models import TokenBlocklist
    jti = jwt_payload["jti"]
    token = TokenBlocklist.query.filter_by(jti=jti).first()
    return token is not None
