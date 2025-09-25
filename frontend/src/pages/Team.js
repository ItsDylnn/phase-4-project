import React from 'react'
import TeamMember from '../components/Team/TeamMember'

const Team = ({ users, projects }) => {
  const groupedUsers = {
    managers: users.filter(user => user.role === 'project_manager'),
    leads: users.filter(user => user.role === 'team_lead'),
    developers: users.filter(user => user.role === 'developer'),
    designers: users.filter(user => user.role === 'designer')
  }

  return (
    <div className="team-page">
      <div className="page-header">
        <h1>Team Members</h1>
        <p>Meet your amazing team working on various projects</p>
      </div>

      {/* Project Managers */}
      <section className="team-section">
        <h2>Project Managers ({groupedUsers.managers.length})</h2>
        <div className="team-grid">
          {groupedUsers.managers.map(user => (
            <TeamMember key={user.id} user={user} projects={projects} />
          ))}
        </div>
      </section>

      {/* Team Leads */}
      <section className="team-section">
        <h2>Team Leads ({groupedUsers.leads.length})</h2>
        <div className="team-grid">
          {groupedUsers.leads.map(user => (
            <TeamMember key={user.id} user={user} projects={projects} />
          ))}
        </div>
      </section>

      {/* Developers */}
      <section className="team-section">
        <h2>Developers ({groupedUsers.developers.length})</h2>
        <div className="team-grid">
          {groupedUsers.developers.map(user => (
            <TeamMember key={user.id} user={user} projects={projects} />
          ))}
        </div>
      </section>

      {/* Designers */}
      <section className="team-section">
        <h2>Designers ({groupedUsers.designers.length})</h2>
        <div className="team-grid">
          {groupedUsers.designers.map(user => (
            <TeamMember key={user.id} user={user} projects={projects} />
          ))}
        </div>
      </section>
    </div>
  )
}

export default Team