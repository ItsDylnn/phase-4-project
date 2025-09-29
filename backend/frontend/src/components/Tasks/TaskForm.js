import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'

const TaskSchema = Yup.object().shape({
  title: Yup.string()
    .min(2, 'Title must be at least 2 characters')
    .max(200, 'Title must be less than 200 characters')
    .required('Title is required'),
  description: Yup.string()
    .min(10, 'Description must be at least 10 characters')
    .required('Description is required'),
  status: Yup.string()
    .oneOf(['Not Started', 'In Progress', 'Completed'], 'Invalid status')
    .required('Status is required'),
  due_date: Yup.date()
    .min(new Date(), 'Due date must be in the future')
    .required('Due date is required'),
  project_id: Yup.number()
    .required('Project is required'),
  assignee_id: Yup.number()
    .required('Assignee is required')
})

const TaskForm = ({ projects, users, onSubmit }) => {
  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    console.log('Creating task:', values)
    if (onSubmit) {
      onSubmit(values)
    }
    setSubmitting(false)
    resetForm()
  }

  return (
    <div className="task-form-container">
      <h3>Create New Task</h3>
      <Formik
        initialValues={{
          title: '',
          description: '',
          status: 'Not Started',
          due_date: '',
          project_id: '',
          assignee_id: ''
        }}
        validationSchema={TaskSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form className="task-form">
            <div className="form-group">
              <label htmlFor="title" className="form-label">
                Task Title *
              </label>
              <Field 
                type="text" 
                name="title" 
                className={`form-input ${errors.title && touched.title ? 'error' : ''}`}
                placeholder="Enter task title"
              />
              <ErrorMessage name="title" component="div" className="error-message" />
            </div>
            
            <div className="form-group">
              <label htmlFor="description" className="form-label">
                Description *
              </label>
              <Field 
                as="textarea" 
                name="description" 
                rows="4"
                className={`form-input ${errors.description && touched.description ? 'error' : ''}`}
                placeholder="Describe the task in detail"
              />
              <ErrorMessage name="description" component="div" className="error-message" />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="status" className="form-label">
                  Status *
                </label>
                <Field 
                  as="select" 
                  name="status"
                  className={`form-input ${errors.status && touched.status ? 'error' : ''}`}
                >
                  <option value="">Select status</option>
                  <option value="Not Started">Not Started</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </Field>
                <ErrorMessage name="status" component="div" className="error-message" />
              </div>
              
              <div className="form-group">
                <label htmlFor="due_date" className="form-label">
                  Due Date *
                </label>
                <Field 
                  type="date" 
                  name="due_date"
                  className={`form-input ${errors.due_date && touched.due_date ? 'error' : ''}`}
                />
                <ErrorMessage name="due_date" component="div" className="error-message" />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="project_id" className="form-label">
                  Project *
                </label>
                <Field 
                  as="select" 
                  name="project_id"
                  className={`form-input ${errors.project_id && touched.project_id ? 'error' : ''}`}
                >
                  <option value="">Select a project</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="project_id" component="div" className="error-message" />
              </div>
              
              <div className="form-group">
                <label htmlFor="assignee_id" className="form-label">
                  Assignee *
                </label>
                <Field 
                  as="select" 
                  name="assignee_id"
                  className={`form-input ${errors.assignee_id && touched.assignee_id ? 'error' : ''}`}
                >
                  <option value="">Select an assignee</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.role})
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="assignee_id" component="div" className="error-message" />
              </div>
            </div>
            
            <button 
              type="submit" 
              disabled={isSubmitting} 
              className="btn btn-primary btn-large"
            >
              {isSubmitting ? 'Creating Task...' : 'Create Task'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default TaskForm