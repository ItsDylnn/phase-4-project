from marshmallow import fields, validate
from models import User, Project, Task, ProjectUser
from extensions import ma

class UserSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = User
        fields = ('id', 'name', 'role', 'email')
        load_instance = True
        include_relationships = True

class ProjectUserSchema(ma.SQLAlchemyAutoSchema):
    user = fields.Nested(UserSchema, only=('id', 'name', 'email'))
    
    class Meta:
        model = ProjectUser
        fields = ('id', 'project_id', 'user_id', 'role', 'user')
        load_instance = True

class TaskSchema(ma.SQLAlchemyAutoSchema):
    assignee = fields.Nested(UserSchema, only=('id', 'name'), allow_none=True)
    
    class Meta:
        model = Task
        fields = ('id', 'title', 'description', 'status', 'project_id', 'assignee_id', 'assignee', 'created_at', 'updated_at')
        load_instance = True

class ProjectSchema(ma.SQLAlchemyAutoSchema):
    manager = fields.Nested(UserSchema, only=('id', 'name', 'email'), allow_none=True)
    tasks = fields.List(fields.Nested(TaskSchema, exclude=('project',)))
    members = fields.List(fields.Nested(ProjectUserSchema, exclude=('project',)))
    
    class Meta:
        model = Project
        fields = ('id', 'name', 'description', 'due_date', 'manager_id', 'manager', 'tasks', 'members', 'created_at', 'updated_at')
        load_instance = True

# Initialize schemas
user_schema = UserSchema()
users_schema = UserSchema(many=True)
project_schema = ProjectSchema()
projects_schema = ProjectSchema(many=True)
task_schema = TaskSchema()
tasks_schema = TaskSchema(many=True)
project_user_schema = ProjectUserSchema()
project_users_schema = ProjectUserSchema(many=True)