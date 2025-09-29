"""
Application factory for the Task Management API.
"""
import os
from flask import Flask, jsonify
from flask_cors import CORS

from config import config_by_name
from extensions import (
    db, ma, jwt, migrate, mail, cors, 
    init_extensions, register_blueprints
)

def create_app(config_name=None):
    """Create and configure the Flask app."""
    if config_name is None:
        config_name = os.environ.get('FLASK_ENV', 'development')
    
    # Create and configure the app
    app = Flask(__name__)
    app.config.from_object(config_by_name[config_name])
    
    # Initialize extensions
    init_extensions(app)
    
    # Register blueprints
    from .routes import auth, projects, tasks
    blueprints = [
        auth.auth_bp,
        projects.projects_bp,
        tasks.tasks_bp
    ]
    register_blueprints(app, blueprints)
    
    # Register error handlers
    from .utils.errors import register_error_handlers
    register_error_handlers(app)
    
    # Health check endpoint
    @app.route('/health')
    def health_check():
        return jsonify({
            'status': 'healthy',
            'environment': config_name
        })
    
    # Root endpoint
    @app.route('/')
    def index():
        return jsonify({
            'name': 'Task Management API',
            'version': '1.0.0',
            'documentation': '/api/docs'
        })
    
    return app
