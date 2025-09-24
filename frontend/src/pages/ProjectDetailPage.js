import React from 'react';
import { useParams } from 'react-router-dom';
import ProjectDetail from '../components/Projects/ProjectDetail';
import TaskList from '../components/Tasks/TaskList';
import TaskForm from '../components/Tasks/TaskForm';

const ProjectDetailPage = ({ projects, tasks, users }) => {
  const { id } = useParams();
  const project = projects.find(p => p.id === parseInt(id));
  
  if (!project) {
    return (
      <div className="error-page">
        <h2>Project Not Found</h2>
        <p>The project you're looking for doesn't exist.</p>
        <a href="/" className="btn btn-primary">Back to Dashboard</a>
      </div>
    );
  }

  const projectTasks = tasks.filter(task => task.project_id === parseInt(id));

  const handleTaskCreate = (taskData) => {
    console.log('Creating task for project:', project.id, taskData);
    // This will be connected to the API later
  };

  return (
    <div className="project-detail-page">
      <ProjectDetail project={project} users={users} tasks={projectTasks} />
      
      <div className="project-tasks-section">
        <div className="tasks-header">
          <h2>Project Tasks ({projectTasks.length})</h2>
        </div>
        <TaskList tasks={projectTasks} users={users} projects={projects} />
      </div>

      <div className="create-task-section">
        <TaskForm 
          projects={[project]} 
          users={users} 
          onSubmit={handleTaskCreate}
        />
      </div>
    </div>
  );
};

export default ProjectDetailPage;
