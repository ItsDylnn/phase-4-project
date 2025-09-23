import React from 'react';
import { Link } from 'react-router-dom';

const ProjectCard = ({ project, users }) => {
  const manager = users.find(user => user.id === project.manager_id);
  const tasksCount = 5; // This would come from actual data
  
  const getProgressColor = (progress) => {
    if (progress >= 70) return '#2ecc71';
    if (progress >= 40) return '#f39c12';
    return '#e74c3c';
  };

  return (
    <div className="project-card">
      <div className="project-header">
        <Link to={`/projects/${project.id}`} className="project-title">
          <h3>{project.name}</h3>
        </Link>
        <span className="project-status">{project.progress}% Complete</span>
      </div>
      
      <p className="project-description">{project.description}</p>
      
      <div className="project-meta">
        <div className="project-manager">
          <span className="manager-label">Manager:</span>
          <span className="manager-name">{manager?.name}</span>
        </div>
        <div className="project-due">
          <span className="due-label">Due:</span>
          <span className="due-date">{new Date(project.due_date).toLocaleDateString()}</span>
        </div>
      </div>
      
      <div className="project-progress">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ 
              width: `${project.progress}%`,
              backgroundColor: getProgressColor(project.progress)
            }}
          ></div>
        </div>
        <div className="progress-stats">
          <span>{project.progress}% Complete</span>
          <span>{tasksCount} Tasks</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;