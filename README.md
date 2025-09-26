# TaskTrail - Project Management Application

TaskTrail is a modern, full-stack project management application designed to help teams collaborate, track tasks, and manage projects efficiently. With an intuitive interface and powerful features, TaskTrail streamlines project workflows and enhances team productivity.

![TaskTrail Screenshot](https://via.placeholder.com/800x400?text=TaskTrail+Screenshot)

## ✨ Features

- **Project Management**: Create, view, update, and delete projects
- **Task Tracking**: Manage tasks with different statuses and priorities
- **Team Collaboration**: Add team members and assign tasks
- **User Authentication**: Secure login and registration system
- **Real-time Updates**: Stay in sync with your team's progress
- **Responsive Design**: Works on desktop and mobile devices

## 🚀 Tech Stack

### Frontend
- React.js
- React Router for navigation
- Context API for state management
- Formik & Yup for form handling and validation
- Axios for API requests
- Tailwind CSS for styling

### Backend
- Python Flask
- SQLAlchemy ORM
- Flask-Migrate for database migrations
- SQLite (Development) / PostgreSQL (Production)
- JWT for authentication

## �️ Installation

### Prerequisites
- Node.js (v14 or later)
- Python (3.8 or later)
- pip (Python package manager)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/ItsDylnn/phase-4-project.git
   cd phase-4-project
   ```

2. **Set up the backend**
   ```bash
   # Create and activate a virtual environment
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate

   # Install Python dependencies
   pip install -r backend/requirements.txt
   ```

3. **Set up the frontend**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

4. **Configure environment variables**
   Create a `.env` file in the root directory:
   ```
   FLASK_APP=backend/app.py
   FLASK_ENV=development
   SECRET_KEY=your-secret-key-here
   DATABASE_URL=sqlite:///app.db
   ```

## 🚀 Running the Application

1. **Start the backend server**
   ```bash
   # From the project root directory
   flask run
   ```
   The backend will be available at http://localhost:5000

2. **Start the frontend development server**
   ```bash
   # From the frontend directory
   cd frontend
   npm start
   ```
   The frontend will be available at http://localhost:3000

## 📚 API Endpoints

### Authentication
- `POST /api/signup` - Register a new user
- `POST /api/login` - Login user and get JWT token

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create a new project
- `GET /api/projects/<id>` - Get a specific project
- `PATCH /api/projects/<id>` - Update a project
- `DELETE /api/projects/<id>` - Delete a project

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/<id>` - Get a specific task
- `PATCH /api/tasks/<id>` - Update a task
- `DELETE /api/tasks/<id>` - Delete a task

## 🏗️ Project Structure

```
phase-4-project/
├── backend/                  # Flask backend
│   ├── migrations/          # Database migrations
│   ├── routes/              # API routes
│   ├── models.py            # Database models
│   ├── app.py               # Flask application
│   └── requirements.txt     # Python dependencies
├── frontend/                # React frontend
│   ├── public/              # Static files
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── context/         # React context providers
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── App.js           # Main application component
│   │   └── index.js         # Application entry point
│   └── package.json         # Frontend dependencies
├── .gitignore              # Git ignore file
├── README.md               # Project documentation
└── requirements.txt        # Backend dependencies
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Create React App](https://create-react-app.dev/)
- [Flask](https://flask.palletsprojects.com/)
- [SQLAlchemy](https://www.sqlalchemy.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Icons](https://react-icons.github.io/react-icons/)
