from backend.routes import create_app
from models import db, Task, Project, ProjectUser
from datetime import datetime

app = create_app()

with app.app_context():
    db.drop_all()
    db.create_all()

    # Seed default projects
    project1 = Project(name="Default Project", description="This is a seeded project.")
    db.session.add(project1)
    db.session.commit()

    # Seed default tasks
    task1 = Task(
        title="Default Task 1",
        description="This is a seeded task.",
        project_id=project1.id,
        created_at=datetime.utcnow(),
    )
    task2 = Task(
        title="Default Task 2",
        description="Another seeded task.",
        project_id=project1.id,
        created_at=datetime.utcnow(),
    )

    db.session.add_all([task1, task2])
    db.session.commit()

    print("Database seeded with default data!")
