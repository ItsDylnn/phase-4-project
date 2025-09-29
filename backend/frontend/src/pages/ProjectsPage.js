import React, { useState, useEffect } from 'react'
import { Container, Button, Card, Row, Col } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

const ProjectsPage = () => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { currentUser } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('/api/projects', {
          headers: { Authorization: `Bearer ${currentUser.token}` }
        })
        setProjects(response.data)
      } catch (err) {
        setError('Failed to load projects')
        console.error('Error fetching projects:', err)
      } finally {
        setLoading(false)
      }
    }

    if (currentUser) {
      fetchProjects()
    }
  }, [currentUser])

  if (loading) return <div>Loading projects...</div>
  if (error) return <div className="alert alert-danger">{error}</div>

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Projects</h2>
        <Button variant="primary" onClick={() => navigate('/projects/new')}>
          Create New Project
        </Button>
      </div>
      
      <Row xs={1} md={2} lg={3} className="g-4">
        {projects.map((project) => (
          <Col key={project.id}>
            <Card 
              className="h-100 project-card"
              onClick={() => navigate(`/projects/${project.id}`)}
              style={{ cursor: 'pointer' }}
            >
              <Card.Body>
                <Card.Title>{project.name}</Card.Title>
                <Card.Text className="text-muted">
                  {project.description || 'No description'}
                </Card.Text>
              </Card.Body>
              <Card.Footer className="text-muted">
                {project.role === 'owner' ? 'Owner' : 'Member'}
              </Card.Footer>
            </Card>
          </Col>
        ))}
        
        {projects.length === 0 && (
          <Col>
            <Card>
              <Card.Body>
                <Card.Text>No projects found. Create your first project!</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>
    </Container>
  )
}

export default ProjectsPage
