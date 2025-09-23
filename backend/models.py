from extensions import db  

class ProjectUser(db.Model):
    __tablename__ = "project_users"
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey("projects.id"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    role = db.Column(db.String, nullable=True)

class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    role = db.Column(db.String, nullable=False)

    managed_projects = db.relationship("Project", back_populates="manager", foreign_keys="Project.manager_id")
    assigned_tasks = db.relationship("Task", back_populates="assignee", foreign_keys="Task.assignee_id")
    project_memberships = db.relationship("ProjectUser", backref="user", cascade="all, delete-orphan")

class Project(db.Model):
    __tablename__ = "projects"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    description = db.Column(db.Text, nullable=True)
    due_date = db.Column(db.Date, nullable=True)
    manager_id = db.Column(db.Integer, db.ForeignKey("users.id"))

    manager = db.relationship("User", back_populates="managed_projects", foreign_keys=[manager_id])
    tasks = db.relationship("Task", back_populates="project", cascade="all, delete-orphan")
    members = db.relationship("ProjectUser", backref="project", cascade="all, delete-orphan")

class Task(db.Model):
    __tablename__ = "tasks"
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    description = db.Column(db.Text, nullable=True)
    status = db.Column(db.String, default="pending")
    project_id = db.Column(db.Integer, db.ForeignKey("projects.id"))
    assignee_id = db.Column(db.Integer, db.ForeignKey("users.id"))

    project = db.relationship("Project", back_populates="tasks")
    assignee = db.relationship("User", back_populates="assigned_tasks", foreign_keys=[assignee_id])
