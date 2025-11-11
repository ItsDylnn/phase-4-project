import React, { useState } from 'react'
import ProjectList from '../components/Projects/ProjectList'
import TaskList from '../components/Tasks/TaskList'
import AddTask from '../components/Tasks/AddTask'
import { useAuth } from '../context/AuthContext'

const Dashboard = ({ projects, tasks, setTasks, users }) => {
  const { currentUser } = useAuth()
  const [showAddTask, setShowAddTask] = useState(false)
  
  const stats = {
    totalProjects: projects.length,
    totalTasks: tasks.length,
    completedTasks: tasks.filter(task => task.status === 'Completed').length,
    inProgressTasks: tasks.filter(task => task.status === 'In Progress').length,
    myTasks: tasks.filter(task => task.assignee_id === currentUser?.id || task.assignee_id === 1).length
  }

  const recentTasks = tasks.slice(0, 5)
  const myRecentTasks = tasks
    .filter(task => task.assignee_id === currentUser?.id || task.assignee_id === 1)
    .slice(0, 3)

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, {currentUser.name}! </h1>
        <p>Here's what's happening with your projects today.</p>
      </div>
      
      {/* Statistics Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon"></div>
          <div className="stat-content">
            <h3>{stats.totalProjects}</h3>
            <p>Total Projects</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"></div>
          <div className="stat-content">
            <h3>{stats.totalTasks}</h3>
            <p>Total Tasks</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"></div>
          <div className="stat-content">
            <h3>{stats.inProgressTasks}</h3>
            <p>In Progress</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"></div>
          <div className="stat-content">
            <h3>{stats.myTasks}</h3>
            <p>My Tasks</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        {/* My Recent Tasks */}
        <section className="dashboard-section">
          <div className="section-header">
            <h2>My Recent Tasks</h2>
            <div className="section-actions">
              <button 
                className="btn-primary add-task-btn" 
                onClick={() => setShowAddTask(true)}
              >
                + Add Task
              </button>
              <a href="/my-tasks" className="view-all">View All</a>
            </div>
          </div>
          {myRecentTasks.length > 0 ? (
            <TaskList 
              tasks={myRecentTasks} 
              setTasks={setTasks}   
              users={users} 
              projects={projects} 
            />
          ) : (
            <div className="empty-state">
              <div className="empty-icon"></div>
              <h3>No recent tasks</h3>
              <p>You don't have any tasks assigned yet. Create your first task to get started!</p>
            </div>
          )}
        </section>

        {/* All Projects */}
        <section className="dashboard-section">
          <div className="section-header">
            <h2>All Projects</h2>
            <span className="project-count">{projects.length} projects</span>
          </div>
          <ProjectList projects={projects} users={users} />
        </section>

        {/* Recent Activity */}
        <section className="dashboard-section">
          <div className="section-header">
            <h2>Recent Activity</h2>
          </div>
          <div className="activity-list">
            <div className="activity-item">
              <span className="activity-icon">➕</span>
              <div className="activity-content">
                <p>New task "Design homepage layout" was created</p>
                <span className="activity-time">2 hours ago</span>
              </div>
            </div>
            <div className="activity-item">
              <span className="activity-icon"></span>
              <div className="activity-content">
                <p>Task "Create marketing materials" was completed</p>
                <span className="activity-time">1 day ago</span>
              </div>
            </div>
          </div>
        </section>
      </div>
      
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

export default Dashboard
