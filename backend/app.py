from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_mail import Mail, Message
from datetime import datetime
from threading import Thread
import os

from models import Project
import os

app = Flask(__name__)
CORS(app)

basedir = os.path.abspath(os.path.dirname(__file__))
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///" + os.path.join(basedir, "app.db")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

app.config["MAIL_SERVER"] = "smtp.gmail.com"
app.config["MAIL_PORT"] = 587
app.config["MAIL_USE_TLS"] = True
app.config["MAIL_USERNAME"] = "your_email@gmail.com"
app.config["MAIL_PASSWORD"] = "your_email_password"
app.config["MAIL_DEFAULT_SENDER"] = "your_email@gmail.com"

db = SQLAlchemy(app)
mail = Mail(app)

class Project(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    tasks = db.relationship('Task', backref='project', lazy=True)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    role = db.Column(db.String(20), nullable=False)
    tasks = db.relationship('Task', backref='assignee', lazy=True)

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(20), default='To Do')
    project_id = db.Column(db.Integer, db.ForeignKey('project.id'), nullable=False)
    assigned_to = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    comments = db.relationship('Comment', backref='task', lazy=True)

class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    task_id = db.Column(db.Integer, db.ForeignKey('task.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

def send_email_notification(user_email, task_title):
    try:
        msg = Message(
            subject="New task has been assigned",
            recipients=[user_email],
            body=f"You have been assigned a new task: {task_title}"
        )
        mail.send(msg)
        print(f"Email has been sent to {user_email}")
    except Exception as e:
        print(f"email has failed: {e}")

def send_email_async(user_email, task_title):
    Thread(target=send_email_notification, args=(user_email, task_title)).start()

@app.route("/")
def home():
    return "flask runs"

@app.route("/projects", methods=["GET"])
def get_projects():
    projects = Project.query.all()
    return jsonify([{"id": p.id, "name": p.name, "description": p.description} for p in projects])

@app.route("/projects", methods=["POST"])
def create_project():
    data = request.get_json()
    if not data.get("name"):
        return jsonify({"error": "project name is required"}), 400
    new_project = Project(name=data.get("name"), description=data.get("description"))
    db.session.add(new_project)
    db.session.commit()
    return jsonify({"id": new_project.id, "name": new_project.name, "description": new_project.description}), 201

@app.route("/users", methods=["GET"])
def get_users():
    users = User.query.all()
    return jsonify([{"id": u.id, "username": u.username, "email": u.email, "role": u.role} for u in users])

@app.route("/users", methods=["POST"])
def create_user():
    data = request.get_json()
    if not data.get("username") or not data.get("email") or not data.get("role"):
        return jsonify({"error": "missing required user fields"}), 400
    new_user = User(username=data.get("username"), email=data.get("email"), role=data.get("role"))
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"id": new_user.id, "username": new_user.username, "email": new_user.email, "role": new_user.role}), 201


@app.route("/users/<int:user_id>/tasks", methods=["GET"])
def get_tasks_for_user(user_id):
    tasks = Task.query.filter_by(assigned_to=user_id).all()
    return jsonify([
        {
            "id": t.id,
            "title": t.title,
            "description": t.description,
            "status": t.status,
            "project_id": t.project_id,
            "assigned_to": t.assigned_to
        }
        for t in tasks
    ])


@app.route("/tasks", methods=["GET"])
def get_tasks():
    tasks = Task.query.all()
    return jsonify([{"id": t.id, "title": t.title, "description": t.description, "status": t.status, "project_id": t.project_id, "assigned_to": t.assigned_to} for t in tasks])

@app.route("/tasks", methods=["POST"])
def create_task():
    data = request.get_json()
    if not data.get("title") or not data.get("project_id") or not data.get("assigned_to"):
        return jsonify({"error": "Missing the required task fields"}), 400

    task = Task(
        title=data["title"],
        description=data.get("description"),
        project_id=data["project_id"],
        assigned_to=data["assigned_to"]
    )
    db.session.add(task)
    db.session.commit()

    user = User.query.get(task.assigned_to)
    if user:
        send_email_async(user.email, task.title)

    return jsonify({
        "id": task.id,
        "Title": task.title,
        "description": task.description,
        "status": task.status,
        "project_id": task.project_id,
        "assigned_to": task.assigned_to
    }), 201


@app.route("/tasks/<int:task_id>", methods=["PUT"])
def update_task(task_id):
    task = Task.query.get_or_404(task_id)
    data = request.get_json()
    task.title = data.get("title", task.title)
    task.description = data.get("description", task.description)
    task.status = data.get("status", task.status)
    task.assigned_to = data.get("assigned_to", task.assigned_to)
    db.session.commit()
    return jsonify({"id": task.id, "title": task.title, "description": task.description, "status": task.status, "project_id": task.project_id, "assigned_to": task.assigned_to})

@app.route("/tasks/<int:task_id>", methods=["DELETE"])
def delete_task(task_id):
    task = Task.query.get_or_404(task_id)
    db.session.delete(task)
    db.session.commit()
    return jsonify({"message": "Task has been deleted"})


@app.route("/tasks/<int:task_id>/comments", methods=["GET"])
def get_comments(task_id):
    comments = Comment.query.filter_by(task_id=task_id).all()
    return jsonify([{"id": c.id, "content": c.content, "user_id": c.user_id, "timestamp": c.timestamp} for c in comments])

@app.route("/tasks/<int:task_id>/comments", methods=["POST"])
def add_comment(task_id):
    data = request.get_json()
    if not data.get("content") or not data.get("user_id"):
        return jsonify({"error": "Missing comment content or user_id"}), 400
    comment = Comment(content=data["content"], task_id=task_id, user_id=data["user_id"])
    db.session.add(comment)
    db.session.commit()
    return jsonify({"id": comment.id, "content": comment.content, "user_id": comment.user_id, "timestamp": comment.timestamp}), 201

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5000)

