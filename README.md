#  TaskTrail - Project Management Application

TaskTrail is a modern, full-stack project management application designed to help teams collaborate, track tasks, and manage projects efficiently. Built with React and Flask, it provides an intuitive interface for seamless project management.

![TaskTrail](https://img.shields.io/badge/Status-Active-brightgreen) ![React](https://img.shields.io/badge/React-18.2.0-blue) ![Flask](https://img.shields.io/badge/Flask-3.1.2-green) ![Python](https://img.shields.io/badge/Python-3.8+-yellow)

## 🚀 Live Demo
**[View Live Application](https://6912c8faf4378451fe6c60a0--kaleidoscopic-marshmallow-ea66ad.netlify.app/signin)**

*Use any email and password to sign in (demo mode)*

##  Features

### 🎯 Core Functionality
-  **Project Management**: Create, view, update, and delete projects with progress tracking
-  **Task Management**: Complete CRUD operations for tasks with status updates
-  **Team Collaboration**: Assign tasks to team members with email integration
-  **User Authentication**: Secure login/signup with password validation
-  **Dashboard Analytics**: Real-time statistics and project overview

### 🎨 User Experience
-  **Dark/Light Theme**: Toggle between themes with persistent storage
-  **Responsive Design**: Optimized for desktop, tablet, and mobile devices
-  **Intuitive Interface**: Clean, modern UI with smooth interactions
-  **Real-time Updates**: Instant task status changes and updates

### 📱 Advanced Features
-  **Task Filtering**: Filter tasks by status, assignee, and project
-  **Profile Management**: View and manage user profiles
-  **Email Integration**: Direct email links for team communication
-  **Local Storage**: Persistent user sessions and theme preferences

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

##  Installation

### Prerequisites
- **Node.js** (v14 or later) - [Download here](https://nodejs.org/)
- **Python** (3.8 or later) - [Download here](https://python.org/)
- **Git** - [Download here](https://git-scm.com/)
- **npm** (comes with Node.js) - Package manager

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

##  Running the Application

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
   - Or visit the live demo: https://6912c8faf4378451fe6c60a0--kaleidoscopic-marshmallow-ea66ad.netlify.app/signin

##  Usage Guide

### 🔐 Getting Started
1. **Sign In**: Use any email and password (demo authentication)
2. **Dashboard**: View project overview, statistics, and recent tasks
3. **Theme Toggle**: Click the sun/moon icon to switch themes

### 📋 Task Management
1. **Create Tasks**: Click "+ Add Task" button on dashboard
2. **Edit Tasks**: Click "Edit" on any task card to modify details
3. **Update Status**: Use dropdown to change task status (Not Started/In Progress/Completed)
4. **Delete Tasks**: Click "Delete" button to remove tasks
5. **Filter Tasks**: Use "My Tasks" page to view your assigned tasks

### 👥 Team Collaboration
1. **View Team**: Navigate to Team page to see all members
2. **Contact Members**: Click "Send Message" to email team members
3. **View Profiles**: Click "View Profile" to see member details
4. **Assign Tasks**: Select team members when creating new tasks

### 📊 Project Tracking
1. **Project Overview**: View all projects with progress indicators
2. **Task Statistics**: Monitor completion rates and progress
3. **Recent Activity**: Track latest updates and changes

##  Project Structure

```
phase-4-project/
├── backend/                 # Flask API server
│   ├── routes/             # API route handlers
│   │   ├── auth.py         # Authentication routes
│   │   ├── tasks.py        # Task management routes
│   │   └── projects.py     # Project management routes
│   ├── utils/              # Utility functions
│   ├── app.py              # Main Flask application
│   ├── models.py           # Database models
│   └── requirements.txt    # Python dependencies
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   │   ├── Layout/     # Navigation and theme components
│   │   │   ├── Tasks/      # Task management components
│   │   │   ├── Projects/   # Project components
│   │   │   └── Team/       # Team management components
│   │   ├── context/        # React context providers
│   │   │   ├── AuthContext.js    # Authentication state
│   │   │   └── ThemeContext.js   # Theme management
│   │   ├── pages/          # Page components
│   │   │   ├── Dashboard.js      # Main dashboard
│   │   │   ├── MyTasks.js        # User tasks page
│   │   │   ├── Team.js           # Team overview
│   │   │   └── Profile.js        # User profiles
│   │   ├── styles/         # CSS stylesheets
│   │   │   └── App.css           # Main styles with themes
│   │   └── App.js          # Main app component
│   ├── build/              # Production build (deployment)
│   └── package.json        # Node dependencies
├── netlify.toml            # Netlify deployment config
└── README.md               # This comprehensive guide
```

##  Recent Updates

### ✨ Latest Features (v2.0)
-  **Dark/Light Theme Toggle**: Persistent theme switching with localStorage
-  **Enhanced Task Management**: Working save, edit, delete, and status change buttons
-  **My Recent Tasks**: Dashboard now displays user's assigned tasks
-  **Improved Authentication**: Fixed routing issues and added password validation
-  **Team Integration**: Functional email links and profile viewing
-  **Responsive Design**: Mobile-optimized interface with improved styling
-  **Local State Management**: Eliminated API dependency for demo functionality

### 🔧 Technical Improvements
-  Fixed authentication routing issues
-  Added task creation functionality with modal form
-  Improved error handling and validation
-  Enhanced UI with responsive design
-  Optimized performance with local state management

##  Deployment

### 🌐 Live Application
- **Frontend**: Deployed on Netlify
- **URL**: https://6912c8faf4378451fe6c60a0--kaleidoscopic-marshmallow-ea66ad.netlify.app/signin
- **Status**: ✅ Active and fully functional

### 🚀 Deployment Features
- Automatic deployments from main branch
- Client-side routing support
- Optimized production build
- Mobile-responsive design

##  Technical Stack

### Frontend Technologies
- **React 18.2.0** - Modern component-based UI framework
- **React Router 6** - Client-side routing and navigation
- **Context API** - State management for auth and theme
- **Custom CSS** - Responsive styling with dark/light themes
- **LocalStorage** - Persistent user sessions and preferences

### Backend Technologies
- **Python Flask 3.1.2** - Lightweight web framework
- **SQLAlchemy ORM** - Database abstraction layer
- **Flask-Migrate** - Database schema migrations
- **SQLite** - Development database
- **Flask-JWT-Extended** - Authentication and authorization

### Development Tools
- **Git** - Version control with GitHub integration
- **npm** - Package management and build tools
- **Netlify** - Frontend deployment and hosting

##  Demo Credentials

**For testing the live application:**
- Email: Any valid email format (e.g., test@example.com)
- Password: Any password (minimum requirements apply)
- Note: This is a demo application with mock authentication

##  Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/NewFeature`)
3. Commit changes (`git commit -m 'Add NewFeature'`)
4. Push to branch (`git push origin feature/NewFeature`)
5. Open a Pull Request

##  License

MIT License - see [LICENSE](LICENSE) file for details.

##  Built With ❤️

- [React](https://reactjs.org/) - Frontend framework
- [Flask](https://flask.palletsprojects.com/) - Backend framework
- [SQLAlchemy](https://www.sqlalchemy.org/) - Database ORM
- [Netlify](https://netlify.com/) - Deployment platform

---

**TaskTrail** - Making project management simple and efficient! 🚀

**Live Demo**: [https://6912c8faf4378451fe6c60a0--kaleidoscopic-marshmallow-ea66ad.netlify.app/signin](https://6912c8faf4378451fe6c60a0--kaleidoscopic-marshmallow-ea66ad.netlify.app/signin)