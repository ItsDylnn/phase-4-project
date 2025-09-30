import React, { useState } from "react";
import TaskCard from "./TaskCard";
import AddTask from "./AddTask";

const TaskList = ({ tasks, setTasks, users, projects }) => {
  const [showModal, setShowModal] = useState(false);

  const handleDelete = (id) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const handleUpdate = (updatedTask) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  };

  const handleTaskAdded = (newTask) => {
    setTasks(prev => [...prev, newTask]);
  };

  return (
    <>
      {tasks.length === 0 ? (
        <div className="empty-state">
          <p>No tasks found. Create your first task to get started!</p>
        </div>
      ) : (
        <div className="task-list">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              users={users}
              projects={projects}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
          ))}
        </div>
      )}

      {showModal && (
        <AddTask
          projects={projects}
          users={users}
          onTaskAdded={handleTaskAdded}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default TaskList;
