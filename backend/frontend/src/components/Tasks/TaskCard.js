import React, { useState } from "react"

const TaskCard = ({ task, users, projects, onDelete, onUpdate }) => {
  const [currentTask, setCurrentTask] = useState(task)
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(task.title)
  const [editDescription, setEditDescription] = useState(task.description)

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

  const handleStatusChange = async (newStatus) => {
    const updated = { ...currentTask, status: newStatus }

    const res = await fetch(`http://localhost:5000/tasks/${currentTask.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    })

    if (res.ok) {
      const saved = await res.json()
      setCurrentTask(saved)
      onUpdate(saved)   // update parent state
    }
  }

  const handleSaveEdit = async () => {
    const updated = { ...currentTask, title: editTitle, description: editDescription }

    const res = await fetch(`http://localhost:5000/tasks/${currentTask.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    })

    if (res.ok) {
      const saved = await res.json()
      setCurrentTask(saved)
      onUpdate(saved)
      setIsEditing(false)
    }
  }

  return (
    <div className="task-card">
      <div className="task-header">
        <div className="task-title-section">
          {isEditing ? (
            <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
          ) : (
            <h4 className="task-title">{currentTask.title}</h4>
          )}
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

      {isEditing ? (
        <textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
      ) : (
        <p className="task-description">{currentTask.description}</p>
      )}

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
          <span className="due-date" style={{ color: getPriorityColor() }}>
            {new Date(currentTask.due_date).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="task-footer">
        {isEditing ? (
          <>
            <button className="btn btn-small" onClick={handleSaveEdit}>Save</button>
            <button className="btn btn-small" onClick={() => setIsEditing(false)}>Cancel</button>
          </>
        ) : (
          <button className="btn btn-small" onClick={() => setIsEditing(true)}>Edit</button>
        )}
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
