import React from 'react';

const TeamMember = ({ user, projects }) => {
  // Count how many projects this user manages
  const managedProjects = projects.filter(project => project.manager_id === user.id);
  
  // Get role color
  const getRoleColor = (role) => {
    switch (role) {
      case 'project_manager': return '#3498db';
      case 'team_lead': return '#9b59b6';
      case 'developer': return '#2ecc71';
      case 'designer': return '#e67e22';
      default: return '#95a5a6';
    }
  };

  // Format role name
  const formatRole = (role) => {
    return role.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="team-member-card">
      <div className="member-header">
        <div className="member-avatar">
          {user.name.split(' ').map(name => name[0]).join('')}
        </div>
        <div className="member-info">
          <h3 className="member-name">{user.name}</h3>
          <span 
            className="member-role"
            style={{ backgroundColor: getRoleColor(user.role) }}
          >
            {formatRole(user.role)}
          </span>
        </div>
      </div>
      
      <div className="member-contact">
        <p className="member-email">{user.email}</p>
      </div>
      
      <div className="member-stats">
        <div className="stat">
          <span className="stat-number">{managedProjects.length}</span>
          <span className="stat-label">Projects Managed</span>
        </div>
      </div>
      
      {managedProjects.length > 0 && (
        <div className="member-projects">
          <h4>Managed Projects:</h4>
          <ul>
            {managedProjects.slice(0, 3).map(project => (
              <li key={project.id} className="project-item">
                <span className="project-name">{project.name}</span>
              </li>
            ))}
            {managedProjects.length > 3 && (
              <li className="more-projects">+{managedProjects.length - 3} more</li>
            )}
          </ul>
        </div>
      )}
      
      <div className="member-actions">
        <button className="btn-view">View Profile</button>
        <button className="btn-message">Send Message</button>
      </div>
    </div>
  );
};

export default TeamMember;