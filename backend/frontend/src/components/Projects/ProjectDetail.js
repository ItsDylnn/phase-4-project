import React from 'react'

const ProjectDetail = ({ project, users, tasks }) => {
  const manager = users.find(user => user.id === project.manager_id)
  const projectTasks = tasks.filter(task => task.project_id === project.id)

  const taskStats = {
    total: projectTasks.length,
    completed: projectTasks.filter(task => task.status === 'Completed').length,
    inProgress: projectTasks.filter(task => task.status === 'In Progress').length,
    notStarted: projectTasks.filter(task => task.status === 'Not Started').length
  }

  return (
    <div className="project-detail">
      <div className="project-header">
        <h1>{project.name}</h1>
        <div className="project-actions">
          <button className="btn btn-primary">Edit Project</button>
          <button className="btn btn-secondary">Add Task</button>
        </div>
      </div>
      
      <div className="project-info">
        <div className="info-section">
          <h3>Description</h3>
          <p>{project.description}</p>
        </div>
        
        <div className="project-stats">
          <div className="stat-item">
            <span className="stat-value">{taskStats.total}</span>
            <span className="stat-label">Total Tasks</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{taskStats.completed}</span>
            <span className="stat-label">Completed</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{taskStats.inProgress}</span>
            <span className="stat-label">In Progress</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{taskStats.notStarted}</span>
            <span className="stat-label">Not Started</span>
          </div>
        </div>
        
        <div className="project-meta-info">
          <div className="meta-item">
            <strong>Manager:</strong> {manager?.name}
          </div>
          <div className="meta-item">
            <strong>Due Date:</strong> {new Date(project.due_date).toLocaleDateString()}
          </div>
          <div className="meta-item">
            <strong>Progress:</strong> {project.progress}%
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectDetail