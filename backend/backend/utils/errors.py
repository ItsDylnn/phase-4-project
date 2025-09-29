from flask import jsonify

class APIError(Exception):
    def __init__(self, message, status_code=400):
        self.message = message
        self.status_code = status_code

class ValidationError(APIError):
    def __init__(self, message):
        super().__init__(message, 400)

class UnauthorizedError(APIError):
    def __init__(self, message="Unauthorized"):
        super().__init__(message, 401)

class NotFoundError(APIError):
    def __init__(self, message="Resource not found"):
        super().__init__(message, 404)

class ForbiddenError(APIError):
    def __init__(self, message="Forbidden"):
        super().__init__(message, 403)

def register_error_handlers(app):
    @app.errorhandler(APIError)
    def handle_api_error(error):
        return jsonify({'error': error.message}), error.status_code
    
    @app.errorhandler(404)
    def handle_not_found(error):
        return jsonify({'error': 'Resource not found'}), 404
    
    @app.errorhandler(500)
    def handle_server_error(error):
        return jsonify({'error': 'Internal server error'}), 500