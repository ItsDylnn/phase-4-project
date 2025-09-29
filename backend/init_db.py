from backend.routes import create_app
from extensions import db

def init_db():
    app = create_app()
    with app.app_context():
        # Drop all tables and re-create them
        db.drop_all()
        db.create_all()
        print("Database tables created successfully!")

if __name__ == '__main__':
    init_db()
