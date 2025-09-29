from datetime import datetime
from extensions import db

class BaseModel(db.Model):
    """Base model with common columns"""
    __abstract__ = True
    
    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class ProjectUser(BaseModel):
    __tablename__ = "project_users"
    
    project_id = db.Column(db.Integer, db.ForeignKey("projects.id"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    role = db.Column(db.String(50), nullable=False, default='member')
    
    # Unique constraint to prevent duplicate memberships
    __table_args__ = (
        db.UniqueConstraint('project_id', 'user_id', name='_project_user_uc'),
    )

class User(BaseModel):
    __tablename__ = "users"
    
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    role = db.Column(db.String(50), nullable=False, default='user')
    is_active = db.Column(db.Boolean, default=True)
    last_login = db.Column(db.DateTime, nullable=True)
    
    # Relationships
    managed_projects = db.relationship(
        "Project", 
        back_populates="manager", 
        foreign_keys="Project.manager_id",
        lazy='dynamic'
    )
    
    assigned_tasks = db.relationship(
        "Task", 
        back_populates="assignee", 
        foreign_keys="Task.assignee_id",
        lazy='dynamic'
    )
    
    project_memberships = db.relationship(
        "ProjectUser", 
        backref="member", 
        cascade="all, delete-orphan",
        lazy='dynamic'
    )
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'role': self.role,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class Project(BaseModel):
    __tablename__ = "projects"
    
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    due_date = db.Column(db.DateTime, nullable=True)
    status = db.Column(db.String(50), default='active')
    manager_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    
    # Relationships
    manager = db.relationship(
        "User", 
        back_populates="managed_projects", 
        foreign_keys=[manager_id]
    )
    
    tasks = db.relationship(
        "Task", 
        back_populates="project", 
        cascade="all, delete-orphan",
        lazy='dynamic'
    )
    
    members = db.relationship(
        "ProjectUser", 
        backref="project_ref", 
        cascade="all, delete-orphan",
        lazy='dynamic'
    )
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'due_date': self.due_date.isoformat() if self.due_date else None,
            'status': self.status,
            'manager_id': self.manager_id,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class Task(BaseModel):
    __tablename__ = "tasks"
    
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    status = db.Column(
        db.String(50), 
        default='todo',
        server_default='todo'
    )
    priority = db.Column(
        db.String(20), 
        default='medium',
        server_default='medium'
    )
    due_date = db.Column(db.DateTime, nullable=True)
    project_id = db.Column(db.Integer, db.ForeignKey("projects.id"), nullable=False)
    assignee_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)
    
    # Relationships
    project = db.relationship("Project", back_populates="tasks")
    assignee = db.relationship("User", back_populates="assigned_tasks", foreign_keys=[assignee_id])
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'status': self.status,
            'priority': self.priority,
            'due_date': self.due_date.isoformat() if self.due_date else None,
            'project_id': self.project_id,
            'assignee_id': self.assignee_id,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
