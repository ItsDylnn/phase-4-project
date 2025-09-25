import React from 'react'
import ProjectCard from './ProjectCard'

const ProjectList = ({ projects, users }) => {
  if (projects.length === 0) {
    return (
      <div className="empty-state">
        <p>No projects found. Create your first project to get started!</p>
      </div>
    )
  }

  return (
    <div className="project-grid">
      {projects.map(project => (
        <ProjectCard key={project.id} project={project} users={users} />
      ))}
    </div>
  )
}

export default ProjectList