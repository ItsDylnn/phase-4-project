from flask import Flask, jsonify, request
from flask_cors import CORS
from extensions import db
from models import Project
import os

app = Flask(__name__)
CORS(app)

basedir = os.path.abspath(os.path.dirname(__file__))
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///" + os.path.join(basedir, "app.db")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)

@app.route("/")
def home():
    return "Hello, Flask is running!"

@app.route("/projects", methods=["GET"])
def get_projects():
    projects = Project.query.all()
    return jsonify([
        {"id": p.id, "name": p.name, "description": p.description}
        for p in projects
    ])

@app.route("/projects", methods=["POST"])
def create_project():
    data = request.get_json()
    new_project = Project(
        name=data.get("name"),
        description=data.get("description")
    )
    db.session.add(new_project)
    db.session.commit()
    return jsonify({
        "id": new_project.id,
        "name": new_project.name,
        "description": new_project.description
    }), 201

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5000)
