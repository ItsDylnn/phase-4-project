import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const HomePage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [recentProjects, setRecentProjects] = useState([]);
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch recent projects
        const projectsRes = await axios.get('/api/projects?limit=3', {
          headers: { Authorization: `Bearer ${currentUser.token}` }
        });
        
        // Fetch recent tasks
        const tasksRes = await axios.get('/api/tasks?limit=5', {
          headers: { Authorization: `Bearer ${currentUser.token}` }
        });
        
        setRecentProjects(projectsRes.data);
        setRecentTasks(tasksRes.data);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchDashboardData();
    }
  }, [currentUser]);

  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <Container className="mt-4">
      <h1 className="mb-4">Welcome back, {currentUser?.name || 'User'}!</h1>
      
      <Row className="g-4">
        {/* Quick Stats */}
        <Col md={4}>
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Quick Stats</Card.Title>
              <div className="d-flex justify-content-between mb-3">
                <div>
                  <h3>{recentProjects.length}</h3>
                  <p className="text-muted mb-0">Projects</p>
                </div>
                <div>
                  <h3>{recentTasks.length}</h3>
                  <p className="text-muted mb-0">Tasks</p>
                </div>
              </div>
              <Button 
                variant="primary" 
                className="w-100 mt-2"
                onClick={() => navigate('/projects')}
              >
                View All Projects
              </Button>
            </Card.Body>
          </Card>
        </Col>
        
        {/* Recent Projects */}
        <Col md={8}>
          <Card className="h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <Card.Title className="mb-0">Recent Projects</Card.Title>
                <Button 
                  variant="outline-primary" 
                  size="sm"
                  onClick={() => navigate('/projects')}
                >
                  View All
                </Button>
              </div>
              
              {recentProjects.length === 0 ? (
                <p className="text-muted">No projects found. Create your first project!</p>
              ) : (
                <div className="list-group">
                  {recentProjects.map(project => (
                    <div 
                      key={project.id}
                      className="list-group-item list-group-item-action"
                      style={{ cursor: 'pointer' }}
                      onClick={() => navigate(`/projects/${project.id}`)}
                    >
                      <div className="d-flex w-100 justify-content-between">
                        <h6 className="mb-1">{project.name}</h6>
                        <small className="text-muted">
                          {new Date(project.created_at).toLocaleDateString()}
                        </small>
                      </div>
                      <p className="mb-1">
                        {project.description?.substring(0, 100) || 'No description'}
                        {project.description?.length > 100 ? '...' : ''}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
        
        {/* Recent Tasks */}
        <Col md={12}>
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <Card.Title className="mb-0">Recent Tasks</Card.Title>
                <Button 
                  variant="outline-primary" 
                  size="sm"
                  onClick={() => navigate('/tasks')}
                >
                  View All Tasks
                </Button>
              </div>
              
              {recentTasks.length === 0 ? (
                <p className="text-muted">No tasks found. Create your first task!</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Project</th>
                        <th>Status</th>
                        <th>Due Date</th>
                        <th>Priority</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentTasks.map(task => (
                        <tr 
                          key={task.id}
                          style={{ cursor: 'pointer' }}
                          onClick={() => navigate(`/tasks/${task.id}`)}
                        >
                          <td>{task.title}</td>
                          <td>{task.project?.name || 'No Project'}</td>
                          <td>
                            <span className={`badge bg-${getStatusBadgeColor(task.status)}`}>
                              {task.status}
                            </span>
                          </td>
                          <td>
                            {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date'}
                          </td>
                          <td>{task.priority}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

// Helper function to determine badge color based on task status
const getStatusBadgeColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'completed':
      return 'success';
    case 'in progress':
      return 'primary';
    case 'pending':
      return 'warning';
    case 'blocked':
      return 'danger';
    default:
      return 'secondary';
  }
};

export default HomePage;
