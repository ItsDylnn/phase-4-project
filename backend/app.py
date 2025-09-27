import os
from flask import Flask, jsonify, request
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import timedelta

from config import config
from extensions import db, ma, jwt, mail, cors, init_extensions
from utils.errors import register_error_handlers, APIError, ValidationError, UnauthorizedError, NotFoundError

# Import blueprints
from routes.auth import auth_bp
from routes.projects import projects_bp
from routes.tasks import tasks_bp

def create_app(config_name=None):
    """Application factory function"""
    if config_name is None:
        config_name = os.environ.get('FLASK_ENV', 'development')
    
    app = Flask(__name__)
    
    # Load configuration
    app.config.from_object(config[config_name])
    
    # Initialize extensions
    init_extensions(app)
    
    # Register error handlers
    register_error_handlers(app)
    
    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(projects_bp, url_prefix='/api/projects')
    app.register_blueprint(tasks_bp, url_prefix='/api/tasks')
    
    # Health check endpoint
    @app.route('/api/health')
    def health_check():
        return jsonify({
            'status': 'ok',
            'environment': config_name,
            'database': 'connected' if db.session.bind is not None else 'disconnected'
        })
    
    # Root endpoint
    @app.route('/')
    def index():
        return jsonify({
            'name': 'Task Management API',
            'version': '1.0.0',
            'documentation': '/api/docs'  # TODO: Add API documentation
        })
    
    return app

# Create the application instance
app = create_app()

if __name__ == "__main__":
    # Create database tables if they don't exist
    with app.app_context():
        db.create_all()
    
    # Run the application
    app.run(debug=app.config['DEBUG'], host='0.0.0.0', port=5000)
