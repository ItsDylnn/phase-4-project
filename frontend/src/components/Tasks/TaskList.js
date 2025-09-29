import React, { useState, useEffect } from "react";
import TaskCard from "./TaskCard";
import AddTask from "./AddTask";

const TaskList = ({ users, projects }) => {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // ✅ Fetch tasks once when component mounts
  useEffect(() => {
    fetch("http://localhost:5000/api/tasks")
      .then((res) => res.json())
      .then((data) => {
        // your backend returns { tasks: [...] }
        setTasks(data.tasks || []);
      })
      .catch((err) => console.error("Error fetching tasks:", err));
  }, []);

  const handleDelete = (id) => {
    fetch(`http://localhost:5000/api/tasks/${id}`, { method: "DELETE" })
      .then((res) => {
        if (!res.ok) throw new Error("Delete failed");
        return res.json().catch(() => ({}));
      })
      .then(() => {
        setTasks((prev) => prev.filter((task) => task.id !== id));
      })
      .catch((err) => {
        console.error("Error deleting task:", err);
        setTasks((prev) => prev.filter((task) => task.id !== id)); // fallback
      });
  };

  const handleUpdate = (updatedTask) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  };

  // ✅ Add new task instantly without refresh
  const handleTaskAdded = (newTask) => {
    if (!newTask || !newTask.id) {
      console.error("Invalid task returned:", newTask);
      return;
    }
    setTasks((prev) => [...prev, newTask]); // append task immediately
  };

  return (
    <div className="task-list-page">
      <div className="task-list-header">
        <h2>Tasks</h2>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          + Add Task
        </button>
      </div>

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
    </div>
  );
};

export default TaskList;
