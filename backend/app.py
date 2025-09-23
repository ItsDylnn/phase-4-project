from flask import Flask, jsonify
from flask_cors import CORS
from extensions import db

app = Flask(__name__)
CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///app.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)

from models import User, Project, Task, ProjectUser

with app.app_context():
    db.create_all()

@app.route("/")
def home():
    return jsonify({"message": "backend is running"})

if __name__ == "__main__":
    app.run(debug=True)
