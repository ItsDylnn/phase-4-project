import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TeamMember = ({ user, projects }) => {
  const navigate = useNavigate();
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [message, setMessage] = useState('');
  
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

  const handleViewProfile = () => {
    navigate(`/profile/${user.id}`);
  };

  const handleSendMessage = () => {
    setShowMessageModal(true);
  };

  const handleMessageSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      // Create mailto link to send real email
      const subject = encodeURIComponent(`Message from TaskTrail`);
      const body = encodeURIComponent(`Hi ${user.name},\n\n${message}\n\nBest regards,\nTaskTrail Team`);
      const mailtoLink = `mailto:${user.email}?subject=${subject}&body=${body}`;
      
      // Open email client
      window.open(mailtoLink, '_blank');
      
      alert(`Email client opened to send message to ${user.name}`);
      setMessage('');
      setShowMessageModal(false);
    }
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
        <button className="btn-view" onClick={handleViewProfile}>View Profile</button>
        <button className="btn-message" onClick={handleSendMessage}>Send Message</button>
      </div>
      
      {showMessageModal && (
        <div className="modal-overlay" onClick={() => setShowMessageModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Send Message to {user.name}</h3>
              <button className="close-btn" onClick={() => setShowMessageModal(false)}>×</button>
            </div>
            <form onSubmit={handleMessageSubmit} className="message-form">
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={`Write your message to ${user.name}...`}
                  rows="4"
                  required
                />
              </div>
              <div className="form-actions">
                <button type="button" onClick={() => setShowMessageModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamMember;