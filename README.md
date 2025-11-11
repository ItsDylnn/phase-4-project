# 🚀 TaskTrail - Project Management Application

TaskTrail is a modern, full-stack project management application designed to help teams collaborate, track tasks, and manage projects efficiently. Built with React and Flask, it provides an intuitive interface for seamless project management.

![TaskTrail](https://img.shields.io/badge/Status-Active-brightgreen) ![React](https://img.shields.io/badge/React-18.2.0-blue) ![Flask](https://img.shields.io/badge/Flask-3.1.2-green) ![Python](https://img.shields.io/badge/Python-3.8+-yellow)

## ✨ Features

-  **Project Management**: Create, view, update, and delete projects
-  **Task Creation & Tracking**: Add new tasks with status management
-  **Team Collaboration**: Assign tasks to team members
-  **User Authentication**: Secure login and registration
-  **Responsive Design**: Works on desktop and mobile devices
-  **Modern UI**: Clean and intuitive interface

##  Tech Stack

### Frontend
- **React.js** - Component-based UI framework
- **React Router** - Client-side routing
- **Context API** - State management
- **Custom CSS** - Responsive styling

### Backend
- **Python Flask** - Web framework
- **SQLAlchemy ORM** - Database management
- **Flask-Migrate** - Database migrations
- **SQLite** - Development database
- **Flask-JWT-Extended** - Authentication

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
   cd backend
   
   # Create and activate virtual environment
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate

   # Install dependencies
   pip install -r requirements.txt
   ```

3. **Set up the frontend**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

4. **Environment setup (optional)**
   ```bash
   # Set debug mode (optional)
   export FLASK_DEBUG=true
   ```

## 🚀 Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   python app.py
   ```
   Backend runs on: http://localhost:5555

2. **Start the frontend (new terminal)**
   ```bash
   cd frontend
   npm start
   ```
   Frontend runs on: http://localhost:3000

3. **Access the application**
   - Open http://localhost:3000 in your browser
   - Use any email/password to sign in (demo mode)

##  Usage

1. **Sign In**: Use any email and password (demo authentication)
2. **Dashboard**: View project overview and task statistics
3. **Add Tasks**: Click "+ Add Task" button to create new tasks
4. **Manage Tasks**: Update task status and details
5. **Team View**: See all team members and their assignments
6. **Profile**: View and manage your profile information

##  Project Structure

```
phase-4-project/
├── backend/                 # Flask API server
│   ├── routes/             # API route handlers
│   ├── utils/              # Utility functions
│   ├── app.py              # Main Flask application
│   ├── models.py           # Database models
│   └── requirements.txt    # Python dependencies
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   │   └── Tasks/      # Task-related components
│   │   ├── context/        # React context (auth)
│   │   ├── pages/          # Page components
│   │   ├── styles/         # CSS stylesheets
│   │   └── App.js          # Main app component
│   └── package.json        # Node dependencies
└── README.md               # This file
```

##  Recent Updates

-  Fixed authentication routing issues
-  Added task creation functionality with modal form
-  Improved error handling and validation
-  Enhanced UI with responsive design
-  Resolved performance issues with database queries

##  Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/NewFeature`)
3. Commit changes (`git commit -m 'Add NewFeature'`)
4. Push to branch (`git push origin feature/NewFeature`)
5. Open a Pull Request

##  License

MIT License - see [LICENSE](LICENSE) file for details.

##  Built With

- [React](https://reactjs.org/) - Frontend framework
- [Flask](https://flask.palletsprojects.com/) - Backend framework
- [SQLAlchemy](https://www.sqlalchemy.org/) - Database ORM

---

**TaskTrail** - Making project management simple and efficient! 
