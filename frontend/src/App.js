import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import Dashboard from './pages/Dashboard';
import ProjectDetailPage from './pages/ProjectDetailPage';
import MyTasks from './pages/MyTasks';
import Team from './pages/Team';
import { AuthProvider } from './context/AuthContext';
import './index.css'

function App() {
  // Mock data for development
  const mockUsers = [
    { id: 1, name: 'Wayne Travis', email: 'wayne@example.com', role: 'project_manager' },
    { id: 2, name: 'Sarah Johnson', email: 'sarah@example.com', role: 'team_lead' },
    { id: 3, name: 'Mike Chen', email: 'mike@example.com', role: 'developer' },
    { id: 4, name: 'Emily Rodriguez', email: 'emily@example.com', role: 'designer' }
  ];

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
  ];

  const mockTasks = [
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
      assignee_id: 3
    },
    {
      id: 3,
      title: 'Create marketing materials',
      description: 'Design banners and social media content for campaign',
      status: 'Completed',
      due_date: '2023-10-30',
      project_id: 3,
      assignee_id: 4
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
  ];

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={
                <Dashboard 
                  projects={mockProjects} 
                  tasks={mockTasks} 
                  users={mockUsers} 
                />
              } />
              <Route path="/projects/:id" element={
                <ProjectDetailPage 
                  projects={mockProjects} 
                  tasks={mockTasks} 
                  users={mockUsers} 
                />
              } />
              <Route path="/my-tasks" element={
                <MyTasks 
                  tasks={mockTasks} 
                  users={mockUsers} 
                  projects={mockProjects} 
                />
              } />
              <Route path="/team" element={
                <Team 
                  users={mockUsers} 
                  projects={mockProjects} 
                />
              } />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;