"""
WSGI config for Task Management API.

This module contains the WSGI application used by the production server.
"""
import os
from backend.routes import create_app

# Create application instance
app = create_app(os.environ.get('FLASK_ENV', 'production'))

if __name__ == "__main__":
    # This is used when running locally without Gunicorn
    app.run(host='0.0.0.0', port=5000, debug=app.config['DEBUG'])
