from datetime import datetime
from flask import Blueprint, request, jsonify
from sqlalchemy.exc import SQLAlchemyError

from models import Task, Project, User, db
from serializers import task_schema, tasks_schema  # for single + multiple dumps

tasks_bp = Blueprint('tasks', __name__)

# --------------------------
# PRESET TASKS (hardcoded defaults)
# --------------------------
DEFAULT_TASKS = [
    {
        "id": 1,
        "title": "Default Task 1",
        "description": "This is the first preset task",
        "status": "todo",
        "project_id": 1,
        "assignee_id": None,
        "due_date": None
    },
    {
        "id": 2,
        "title": "Default Task 2",
        "description": "This is the second preset task",
        "status": "in progress",
        "project_id": 1,
        "assignee_id": None,
        "due_date": None
    }
]


# --------------------------
# CREATE TASK
# --------------------------
@tasks_bp.route('', methods=['POST', 'OPTIONS'])
def create_task():
    if request.method == 'OPTIONS':
        return '', 200

    data = request.get_json() or {}

    try:
        # Validate required fields
        if not data.get('title') or not data.get('project_id'):
            return jsonify({'error': 'Title and project_id are required'}), 400

        # Convert IDs
        try:
            project_id = int(data['project_id'])
        except ValueError:
            return jsonify({'error': 'Invalid project_id'}), 400

        assignee_id = None
        if data.get('assignee_id'):
            try:
                assignee_id = int(data['assignee_id'])
            except ValueError:
                return jsonify({'error': 'Invalid assignee_id'}), 400

        # Parse due_date if provided
        due_date = None
        if data.get('due_date'):
            try:
                due_date = datetime.fromisoformat(data['due_date'])
            except ValueError:
                return jsonify({
                    'error': 'Invalid due_date format. Use YYYY-MM-DD'
                }), 400

        # Create in DB (temporary storage until refresh)
        task = Task(
            title=data['title'].strip(),
            description=data.get('description', '').strip(),
            status=data.get('status', 'todo'),
            project_id=project_id,
            assignee_id=assignee_id,
            due_date=due_date
        )
        db.session.add(task)
        db.session.commit()

        return jsonify({'message': 'Task created', 'task': task_schema.dump(task)}), 201

    except SQLAlchemyError as e:
        db.session.rollback()
        import traceback
        traceback.print_exc()
        return jsonify({
            'error': 'Failed to create task due to database error',
            'details': str(e)
        }), 500

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({'error': 'Internal server error', 'details': str(e)}), 500


# --------------------------
# GET ALL TASKS
# --------------------------
@tasks_bp.route('', methods=['GET'])
def get_tasks():
    try:
        # Fetch DB tasks
        tasks = Task.query.all()
        serialized = tasks_schema.dump(tasks)

        if not serialized:  # if DB is empty, return defaults
            return jsonify({'tasks': DEFAULT_TASKS}), 200

        return jsonify({'tasks': serialized}), 200

    except SQLAlchemyError as e:
        import traceback
        traceback.print_exc()
        return jsonify({'error': 'Failed to fetch tasks', 'details': str(e)}), 500

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({'error': 'Internal server error', 'details': str(e)}), 500
