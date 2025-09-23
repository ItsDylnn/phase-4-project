import React from 'react';
import TaskCard from './TaskCard';

const TaskList = ({ tasks, users, projects }) => {
  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <p>No tasks found. Create your first task to get started!</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map(task => (
        <TaskCard key={task.id} task={task} users={users} projects={projects} />
      ))}
    </div>
  );
};

export default TaskList;