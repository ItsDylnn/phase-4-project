# TaskTrail - Project Management Application

TaskTrail is a modern, full-stack project management application designed to help teams collaborate, track tasks, and manage projects efficiently. With an intuitive interface and powerful features, TaskTrail streamlines project workflows and enhances team productivity.

![TaskTrail Screenshot](https://via.placeholder.com/800x400?text=TaskTrail+Screenshot)

## ✨ Features

- **Project Management**: Create, view, update, and delete projects
- **Task Tracking**: Manage tasks with different statuses and priorities
- **Team Collaboration**: Add team members and assign tasks
- **User Authentication**: Secure login and registration system
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Updates**: Stay in sync with your team's progress

## 🚀 Tech Stack

### Frontend
- React.js
- React Router for navigation
- Context API for state management
- Tailwind CSS for styling
- Axios for API requests
- React Icons

### Backend
- Node.js with Express
- JSON Server for mock API (development)
- JWT for authentication

### Development Tools
- npm / yarn
- ESLint for code quality
- Prettier for code formatting
- Git for version control

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm (comes with Node.js)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/phase-4-project.git
   cd phase-4-project
   ```

2. Install dependencies for both backend and frontend:
   ```bash
   # Install root dependencies (including JSON Server)
   npm install
   
   # Install frontend dependencies
   cd frontend
   npm install
   cd ..
   ```

### Running the Application

#### Option 1: Run Frontend and Backend Separately

1. Start the JSON Server (backend):
   ```bash
   # From the project root directory
   npm run server
   ```
   The server will run on http://localhost:5555

2. In a new terminal, start the React development server:
   ```bash
   # From the project root directory
   npm run client
   ```
   The frontend will be available at http://localhost:3000

#### Option 2: Run Both Servers Concurrently

From the project root directory, run:
```bash
npm run dev
```

This will start both the JSON Server and the React development server simultaneously.

### Available API Endpoints

The JSON Server provides the following RESTful endpoints:

- `GET /tasks` - Get all tasks
- `GET /tasks/:id` - Get a single task
- `POST /tasks` - Create a new task
- `PUT /tasks/:id` - Update a task
- `PATCH /tasks/:id` - Partially update a task
- `DELETE /tasks/:id` - Delete a task

Similar endpoints are available for other resources like projects, users, etc.

## 🔧 Project Structure

```
phase-4-project/
├── frontend/               # React frontend
│   ├── public/            # Static files
│   ├── src/               # React source code
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   └── App.js         # Main application component
│   └── package.json       # Frontend dependencies
├── db.json                # JSON Server database
├── server.js              # JSON Server configuration
└── package.json           # Root dependencies and scripts
```

## 🛠️ Installation

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher) or yarn
- Git

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/phase-4-project.git
   cd phase-4-project
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the backend directory:
   ```env
   PORT=5000
   JWT_SECRET=your_jwt_secret_here
   NODE_ENV=development
   ```

## 🚀 Running the Application

### Development Mode

1. **Start the backend server**
   ```bash
   # From the project root
   cd backend
   npm run dev
   ```

2. **Start the frontend development server**
   ```bash
   # From the project root
   cd frontend
   npm start
   ```

3. **Start JSON Server (for mock data)**
   ```bash
   # From the project root
   npx json-server --watch db.json --port 3001
   ```

   The application should now be running at `http://localhost:3000`

### Production Build

```bash
# Build the frontend for production
cd frontend
npm run build

# Serve the production build
npm install -g serve
serve -s build
```

## 📁 Project Structure

```
phase-4-project/
├── backend/               # Backend server code
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── utils/            # Utility functions
│   ├── app.js            # Express app setup
│   └── server.js         # Server entry point
│
├── frontend/             # Frontend React application
│   ├── public/           # Static files
│   └── src/
│       ├── assets/       # Images, fonts, etc.
│       ├── components/   # Reusable UI components
│       ├── context/      # React context providers
│       ├── pages/        # Page components
│       ├── services/     # API services
│       ├── styles/       # Global styles
│       ├── App.js        # Main App component
│       └── index.js      # Entry point
│
├── .gitignore           # Git ignore file
└── README.md            # This file
```

## 🔒 Environment Variables

### Backend
- `PORT`: Port number for the backend server (default: 5000)
- `JWT_SECRET`: Secret key for JWT token generation
- `NODE_ENV`: Environment (development/production)

### Frontend
- `REACT_APP_API_URL`: Base URL for API requests (default: http://localhost:5000)

## 🧪 Testing

Run tests for the frontend:
```bash
cd frontend
npm test
```

## 🌐 Deployment

### Backend Deployment
1. Set up a production database (MongoDB, PostgreSQL, etc.)
2. Update environment variables for production
3. Use PM2 or similar process manager:
   ```bash
   npm install -g pm2
   pm2 start server.js --name "tasktrail-backend"
   ```

### Frontend Deployment
1. Build the production version:
   ```bash
   cd frontend
   npm run build
   ```
2. Deploy the `build` folder to your preferred hosting (Vercel, Netlify, etc.)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Create React App](https://create-react-app.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Icons](https://react-icons.github.io/react-icons/)
- [JSON Server](https://github.com/typicode/json-server)
