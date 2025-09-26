import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Button, Card, Row, Col, Tabs, Tab, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('tasks');

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        setLoading(true);
        
        // Fetch project details
        const projectRes = await axios.get(`/api/projects/${id}`, {
          headers: { Authorization: `Bearer ${currentUser.token}` }
        });
        
        // Fetch project tasks
        const tasksRes = await axios.get('/api/tasks', {
          params: { project_id: id },
          headers: { Authorization: `Bearer ${currentUser.token}` }
        });
        
        setProject(projectRes.data);
        setTasks(tasksRes.data);
      } catch (err) {
        setError('Failed to load project data');
        console.error('Error fetching project data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchProjectData();
    }
  }, [id, currentUser]);

  const handleDeleteProject = async () => {
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      try {
        await axios.delete(`/api/projects/${id}`, {
          headers: { Authorization: `Bearer ${currentUser.token}` }
        });
        navigate('/projects');
      } catch (err) {
        setError('Failed to delete project');
        console.error('Error deleting project:', err);
      }
    }
  };

  if (loading) return <div>Loading project...</div>;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!project) return <div>Project not found</div>;

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>{project.name}</h2>
          <p className="text-muted">{project.description || 'No description'}</p>
        </div>
        <div>
          <Button 
            variant="outline-primary" 
            className="me-2"
            onClick={() => navigate(`/projects/${id}/edit`)}
          >
            Edit Project
          </Button>
          <Button 
            variant="outline-danger"
            onClick={handleDeleteProject}
          >
            Delete Project
          </Button>
        </div>
      </div>

      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-4"
      >
        <Tab eventKey="tasks" title="Tasks">
          <div className="mt-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4>Tasks</h4>
              <Button 
                variant="primary"
                onClick={() => navigate(`/projects/${id}/tasks/new`)}
              >
                Add Task
              </Button>
            </div>
            
            {tasks.length === 0 ? (
              <Card>
                <Card.Body className="text-center">
                  <p>No tasks found for this project.</p>
                  <Button 
                    variant="primary"
                    onClick={() => navigate(`/projects/${id}/tasks/new`)}
                  >
                    Create your first task
                  </Button>
                </Card.Body>
              </Card>
            ) : (
              tasks.map(task => (
                <Card key={task.id} className="mb-2">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h5>{task.title}</h5>
                        <p className="mb-0 text-muted">
                          {task.status} • {task.priority} priority
                        </p>
                      </div>
                      <Button 
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => navigate(`/tasks/${task.id}`)}
                      >
                        View Details
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              ))
            )}
          </div>
        </Tab>
        
        <Tab eventKey="members" title="Team Members">
          <div className="mt-3">
            <h4>Team Members</h4>
            {/* Team members list will go here */}
          </div>
        </Tab>
        
        <Tab eventKey="settings" title="Settings">
          <div className="mt-3">
            <h4>Project Settings</h4>
            {/* Project settings will go here */}
          </div>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default ProjectDetail;
