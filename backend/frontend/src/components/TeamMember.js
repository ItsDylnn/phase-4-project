import React from "react"
import { useNavigate } from "react-router-dom"

const TeamMember = ({ user, projects }) => {
  const navigate = useNavigate()

  const handleViewProfile = () => {
    const targetUrl = `/profile/${user.id}`
    console.log("Navigating to:", targetUrl) // Debug log
    navigate(targetUrl)
  }

  // Optional: find projects managed/assigned to this user
  const userProjects = projects.filter(
    proj => proj.manager_id === user.id
  )

  return (
    <div className="team-member-card">
      <h3>{user.name}</h3>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>

      {userProjects.length > 0 && (
        <div className="user-projects">
          <strong>Projects:</strong>
          <ul>
            {userProjects.map(p => (
              <li key={p.id}>{p.name}</li>
            ))}
          </ul>
        </div>
      )}

      <button className="btn btn-primary" onClick={handleViewProfile}>
        View Profile
      </button>
    </div>
  )
}

export default TeamMember
