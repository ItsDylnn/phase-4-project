import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Layout/Navbar'
import Dashboard from './pages/Dashboard'
import ProjectDetailPage from './pages/ProjectDetailPage'
import MyTasks from './pages/MyTasks'
import Team from './pages/Team'
import Profile from './pages/Profile'
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import './styles/App.css'


const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth()
  
  if (!currentUser) {
    return <Navigate to="/signin" replace />
  }
  
  return (
    <>
      <Navbar />
      <main className="main-content">
        {children}
      </main>
    </>
  )
}

function AppContent() {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Design homepage layout',
      description: 'Create wireframes and mockups for new homepage design',
      status: 'In Progress',
      due_date: '2023-11-15',
      project_id: 1,
      assignee_id: 1
    },
    {
      id: 2,
      title: 'Implement user authentication',
      description: 'Set up login and registration system with JWT tokens',
      status: 'Not Started',
      due_date: '2023-11-20',
      project_id: 2,
      assignee_id: 1
    },
    {
      id: 3,
      title: 'Create marketing materials',
      description: 'Design banners and social media content for campaign',
      status: 'Completed',
      due_date: '2023-10-30',
      project_id: 3,
      assignee_id: 1
    },
    {
      id: 4,
      title: 'API integration',
      description: 'Connect frontend with backend REST API',
      status: 'In Progress',
      due_date: '2023-11-25',
      project_id: 2,
      assignee_id: 3
    }
  ])

  const mockUsers = [
    { id: 1, name: 'Travis Jibril', email: 'travisjibril25@gmail.com', role: 'project_manager' },
    { id: 2, name: 'Otieno Ida', email: 'otienoida828@gmail.com', role: 'team_lead' },
    { id: 3, name: 'Apollo Timothy', email: 'apollotimothy13@gmail.com', role: 'developer' },
    { id: 4, name: 'Emily Rodriguez', email: 'emily@example.com', role: 'designer' }
  ]

  const mockProjects = [
    { 
      id: 1, 
      name: 'Website Redesign', 
      description: 'Complete redesign of company website with modern UI/UX',
      due_date: '2023-12-15',
      manager_id: 1,
      progress: 65
    },
    { 
      id: 2, 
      name: 'Mobile App Development', 
      description: 'New mobile application for iOS and Android platforms',
      due_date: '2024-01-20',
      manager_id: 2,
      progress: 40
    },
    { 
      id: 3, 
      name: 'Q4 Marketing Campaign', 
      description: 'End of year marketing initiative',
      due_date: '2023-11-30',
      manager_id: 1,
      progress: 20
    }
  ]

  const { currentUser } = useAuth();

  return (
    <div className="App">
      <Routes>
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route
          path="/"
          element={currentUser ? <Navigate to="/dashboard" replace /> : <Navigate to="/signin" replace />}
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard 
                projects={mockProjects} 
                tasks={tasks} 
                setTasks={setTasks}
                users={mockUsers} 
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects/:id"
          element={
            <ProtectedRoute>
              <ProjectDetailPage 
                projects={mockProjects} 
                tasks={tasks} 
                setTasks={setTasks}
                users={mockUsers} 
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-tasks"
          element={
            <ProtectedRoute>
              <MyTasks 
                tasks={tasks} 
                setTasks={setTasks}
                users={mockUsers} 
                projects={mockProjects} 
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/team"
          element={
            <ProtectedRoute>
              <Team 
                users={mockUsers} 
                projects={mockProjects} 
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile 
                users={mockUsers}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/:id"
          element={
            <ProtectedRoute>
              <Profile 
                users={mockUsers}
              />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/signin" replace />} />
      </Routes>
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
