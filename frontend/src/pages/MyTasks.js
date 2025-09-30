import React, { useState } from 'react'
import TaskList from '../components/Tasks/TaskList'
import AddTask from '../components/Tasks/AddTask'
import { useAuth } from '../context/AuthContext'

const MyTasks = ({ tasks, setTasks, users, projects }) => {
  const { currentUser } = useAuth()
  const [filter, setFilter] = useState('all')
  const [showAddTask, setShowAddTask] = useState(false)
  
  const myTasks = tasks.filter(task => task.assignee_id === currentUser?.id || task.assignee_id === 1)
  
  const filteredTasks = myTasks.filter(task => {
    if (filter === 'all') return true
    return task.status === filter
  })

  const taskStats = {
    all: myTasks.length,
    'Not Started': myTasks.filter(task => task.status === 'Not Started').length,
    'In Progress': myTasks.filter(task => task.status === 'In Progress').length,
    'Completed': myTasks.filter(task => task.status === 'Completed').length
  }

  return (
    <div className="my-tasks-page">
      <div className="page-header">
        <div className="page-title">
          <h1>My Tasks</h1>
          <p>Manage your assigned tasks and track your progress</p>
        </div>
        <button 
          className="btn-primary add-task-btn" 
          onClick={() => setShowAddTask(true)}
        >
          + Add Task
        </button>
      </div>

      {/* Task Statistics */}
      <div className="task-stats">
        <div 
          className={`stat-tab ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          <span className="stat-count">{taskStats.all}</span>
          <span className="stat-label">All Tasks</span>
        </div>
        <div 
          className={`stat-tab ${filter === 'Not Started' ? 'active' : ''}`}
          onClick={() => setFilter('Not Started')}
        >
          <span className="stat-count">{taskStats['Not Started']}</span>
          <span className="stat-label">Not Started</span>
        </div>
        <div 
          className={`stat-tab ${filter === 'In Progress' ? 'active' : ''}`}
          onClick={() => setFilter('In Progress')}
        >
          <span className="stat-count">{taskStats['In Progress']}</span>
          <span className="stat-label">In Progress</span>
        </div>
        <div 
          className={`stat-tab ${filter === 'Completed' ? 'active' : ''}`}
          onClick={() => setFilter('Completed')}
        >
          <span className="stat-count">{taskStats['Completed']}</span>
          <span className="stat-label">Completed</span>
        </div>
      </div>

      {/* Task List */}
      <div className="tasks-container">
         <TaskList 
            tasks={filteredTasks} 
            setTasks={setTasks}   
            users={users} 
            projects={projects} 
/>

      </div>

      {filteredTasks.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <h3>No tasks found</h3>
          <p>
            {filter === 'all' 
              ? "You don't have any tasks assigned yet." 
              : `You don't have any ${filter.toLowerCase()} tasks.`
            }
          </p>
        </div>
      )}
      
      {showAddTask && (
        <AddTask
          projects={projects}
          users={users}
          onTaskAdded={(newTask) => {
            setTasks(prev => [...prev, newTask])
          }}
          onClose={() => setShowAddTask(false)}
        />
      )}
    </div>
  )
}

export default MyTasks