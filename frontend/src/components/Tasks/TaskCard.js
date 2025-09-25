import React, { useState } from "react"

const TaskCard = ({ task, users, projects, onDelete }) => {
  const [currentTask, setCurrentTask] = useState(task)
  const assignee = users.find(user => user.id === currentTask.assignee_id)
  const project = projects.find(proj => proj.id === currentTask.project_id)

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed": return "#2ecc71"
      case "In Progress": return "#f39c12"
      default: return "#95a5a6"
    }
  }

  const getPriorityColor = () => {
    const dueDate = new Date(currentTask.due_date)
    const today = new Date()
    const diffTime = dueDate - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) return "#e74c3c"   // Overdue
    if (diffDays <= 3) return "#f39c12"  // Due soon
    return "#2ecc71"                     // On track
  }

  const handleStatusChange = (newStatus) => {
    setCurrentTask(prev => ({ ...prev, status: newStatus }))
    // optional: send update to backend here
  }

  return (
    <div className="task-card">
      <div className="task-header">
        <div className="task-title-section">
          <h4 className="task-title">{currentTask.title}</h4>
          <span
            className="status-badge"
            style={{ backgroundColor: getStatusColor(currentTask.status) }}
          >
            {currentTask.status}
          </span>
        </div>
        <div className="task-actions">
          <select
            value={currentTask.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="status-select"
          >
            <option value="Not Started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      <p className="task-description">{currentTask.description}</p>

      <div className="task-meta">
        <div className="meta-item">
          <span className="meta-label">Project:</span>
          <span className="meta-value">{project?.name}</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">Assignee:</span>
          <span className="meta-value">{assignee?.name}</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">Due:</span>
          <span
            className="due-date"
            style={{ color: getPriorityColor() }}
          >
            {new Date(currentTask.due_date).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="task-footer">
        <button className="btn btn-small">Edit</button>
        <button
          className="btn btn-small btn-danger"
          onClick={() => onDelete(currentTask.id)}
        >
          Delete
        </button>
      </div>
    </div>
  )
}

export default TaskCard
