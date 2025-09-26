import React from "react"
import TaskCard from "./TaskCard"

const TaskList = ({ tasks, setTasks, users, projects }) => {
  const handleDelete = (id) => {
    fetch(`http://localhost:5000/tasks/${id}`, { method: "DELETE" })
      .then(res => {
        if (!res.ok) throw new Error("Delete failed")
        return res.json().catch(() => ({})) // handle empty/no response body
      })
      .then(() => {
        setTasks(prev => prev.filter(task => task.id !== id))
      })
      .catch(err => {
        console.error("Error deleting task:", err)
        // fallback: still remove from frontend
        setTasks(prev => prev.filter(task => task.id !== id))
      })
  }

  const handleUpdate = (updatedTask) => {
    // update frontend state after a successful PUT in TaskCard
    setTasks(prev => prev.map(task =>
      task.id === updatedTask.id ? updatedTask : task
    ))
  }

  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <p>No tasks found. Create your first task to get started!</p>
      </div>
    )
  }

  return (
    <div className="task-list">
      {tasks.map(task => (
        <TaskCard
          key={task.id}
          task={task}
          users={users}
          projects={projects}
          onDelete={handleDelete}
          onUpdate={handleUpdate}   // 👈 pass down update handler
        />
      ))}
    </div>
  )
}

export default TaskList
