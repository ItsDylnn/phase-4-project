# Task Management API

A RESTful API for managing tasks, projects, and team collaboration built with Flask, SQLAlchemy, and JWT authentication.

## Features

- User authentication with JWT (access & refresh tokens)
- Role-based access control (Admin, Manager, Member)
- Project management (CRUD operations)
- Task management with assignments and status tracking
- Team collaboration features
- Email notifications
- Comprehensive error handling
- Input validation
- API documentation

## Tech Stack

- **Backend Framework**: Flask
- **Database**: SQLAlchemy ORM with SQLite/PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Marshmallow
- **Testing**: Pytest
- **Containerization**: Docker (optional)

## Prerequisites

- Python 3.8+
- pip (Python package manager)
- SQLite (included in Python) or PostgreSQL

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/task-management-api.git
   cd task-management-api/backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. Initialize the database:
   ```bash
   flask db init
   flask db migrate -m "Initial migration"
   flask db upgrade
   ```

## Running the Application

### Development
```bash
export FLASK_APP=app.py
export FLASK_ENV=development
flask run
```

The API will be available at `http://localhost:5000`

### Production
For production, use a production WSGI server like Gunicorn:
```bash
gunicorn --bind 0.0.0.0:5000 wsgi:app
```

## API Documentation

Once the server is running, you can access:
- **API Documentation**: `http://localhost:5000/api/docs`
- **Health Check**: `http://localhost:5000/api/health`

## Authentication

Most endpoints require authentication. Include the JWT token in the request header:
```
Authorization: Bearer <access_token>
```

### Authentication Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get access token
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user's profile
- `POST /api/auth/change-password` - Change password

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `FLASK_ENV` | Flask environment | `development` |
| `SECRET_KEY` | Flask secret key | - |
| `DATABASE_URL` | Database connection URL | `sqlite:///app.db` |
| `JWT_SECRET_KEY` | JWT secret key | - |
| `CORS_ORIGINS` | Allowed origins (comma-separated) | `*` |
| `MAIL_SERVER` | SMTP server | `smtp.gmail.com` |
| `MAIL_PORT` | SMTP port | `587` |
| `MAIL_USE_TLS` | Use TLS | `true` |
| `MAIL_USERNAME` | SMTP username | - |
| `MAIL_PASSWORD` | SMTP password | - |
| `MAIL_DEFAULT_SENDER` | Default sender email | - |

## Project Structure

```
backend/
├── migrations/           # Database migrations
├── routes/              # API routes
│   ├── __init__.py
│   ├── auth.py          # Authentication routes
│   ├── projects.py      # Project management routes
│   └── tasks.py         # Task management routes
├── models/              # Database models
│   └── __init__.py
├── serializers/         # Marshmallow schemas
│   └── __init__.py
├── utils/               # Utility functions
│   └── errors.py        # Error handlers
├── tests/               # Test files
├── config.py            # Configuration settings
├── extensions.py        # Flask extensions
├── requirements.txt     # Python dependencies
└── wsgi.py             # WSGI entry point
```

## Testing

Run tests with pytest:
```bash
pytest
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
