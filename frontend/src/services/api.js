const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5555/api'

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.text()
    throw new Error(error || `HTTP error! status: ${response.status}`)
  }
  return response.json()
}

// API service object
export const api = {
  // User endpoints
  users: {
    getAll: () => fetch(`${API_BASE}/users`).then(handleResponse),
    getById: (id) => fetch(`${API_BASE}/users/${id}`).then(handleResponse),
    create: (userData) => fetch(`${API_BASE}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    }).then(handleResponse),
    update: (id, userData) => fetch(`${API_BASE}/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    }).then(handleResponse),
    delete: (id) => fetch(`${API_BASE}/users/${id}`, { method: 'DELETE' }).then(handleResponse)
  },

  // Project endpoints
  projects: {
    getAll: () => fetch(`${API_BASE}/projects`).then(handleResponse),
    getById: (id) => fetch(`${API_BASE}/projects/${id}`).then(handleResponse),
    create: (projectData) => fetch(`${API_BASE}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(projectData)
    }).then(handleResponse),
    update: (id, projectData) => fetch(`${API_BASE}/projects/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(projectData)
    }).then(handleResponse),
    delete: (id) => fetch(`${API_BASE}/projects/${id}`, { method: 'DELETE' }).then(handleResponse)
  },

  // Task endpoints (Full CRUD)
  tasks: {
    getAll: () => fetch(`${API_BASE}/tasks`).then(handleResponse),
    getById: (id) => fetch(`${API_BASE}/tasks/${id}`).then(handleResponse),
    create: (taskData) => fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData)
    }).then(handleResponse),
    update: (id, taskData) => fetch(`${API_BASE}/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData)
    }).then(handleResponse),
    delete: (id) => fetch(`${API_BASE}/tasks/${id}`, { method: 'DELETE' }).then(handleResponse)
  },

  // Project Members endpoints
  projectMembers: {
    getAll: () => fetch(`${API_BASE}/project-members`).then(handleResponse),
    getByProject: (projectId) => fetch(`${API_BASE}/projects/${projectId}/members`).then(handleResponse),
    addMember: (projectId, memberData) => fetch(`${API_BASE}/projects/${projectId}/members`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(memberData)
    }).then(handleResponse),
    removeMember: (projectId, userId) => fetch(`${API_BASE}/projects/${projectId}/members/${userId}`, {
      method: 'DELETE'
    }).then(handleResponse)
  },

  // Special endpoints
  myTasks: {
    getByUserId: (userId) => fetch(`${API_BASE}/my-tasks/${userId}`).then(handleResponse),
    getCurrentUserTasks: () => fetch(`${API_BASE}/my-tasks`).then(handleResponse)
  },

  // Utility function for testing connection
  healthCheck: () => fetch(`${API_BASE}/health`).then(handleResponse).catch(() => ({ status: 'API not available' }))
}

// Alternative: Simpler version if you prefer
export const simpleApi = {
  // GET all resources
  getUsers: () => fetch(`${API_BASE}/users`).then(r => r.json()),
  getProjects: () => fetch(`${API_BASE}/projects`).then(r => r.json()),
  getTasks: () => fetch(`${API_BASE}/tasks`).then(r => r.json()),

  // GET single resource
  getProject: (id) => fetch(`${API_BASE}/projects/${id}`).then(r => r.json()),
  getTask: (id) => fetch(`${API_BASE}/tasks/${id}`).then(r => r.json()),

  // POST new resources
  createProject: (data) => fetch(`${API_BASE}/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()),

  createTask: (data) => fetch(`${API_BASE}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()),

  // UPDATE resources
  updateTask: (id, data) => fetch(`${API_BASE}/tasks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()),

  // DELETE resources
  deleteTask: (id) => fetch(`${API_BASE}/tasks/${id}`, { method: 'DELETE' })
}

// Mock data functions for development (when backend is not ready)
export const mockApi = {
  getUsers: async () => [
    { id: 1, name: 'Wayne Travis', email: 'wayne@example.com', role: 'project_manager' },
    { id: 2, name: 'Sarah Johnson', email: 'sarah@example.com', role: 'team_lead' },
    { id: 3, name: 'Mike Chen', email: 'mike@example.com', role: 'developer' },
    { id: 4, name: 'Emily Rodriguez', email: 'emily@example.com', role: 'designer' }
  ],

  getProjects: async () => [
    { 
      id: 1, 
      name: 'Website Redesign', 
      description: 'Complete redesign of company website',
      due_date: '2023-12-15',
      manager_id: 1
    },
    { 
      id: 2, 
      name: 'Mobile App Development', 
      description: 'New mobile application for iOS and Android',
      due_date: '2024-01-20',
      manager_id: 2
    }
  ],

  getTasks: async () => [
    {
      id: 1,
      title: 'Design homepage layout',
      description: 'Create wireframes and mockups for new homepage',
      status: 'In Progress',
      due_date: '2023-11-15',
      project_id: 1,
      assignee_id: 1
    },
    {
      id: 2,
      title: 'Implement user authentication',
      description: 'Set up login and registration system',
      status: 'Not Started',
      due_date: '2023-11-20',
      project_id: 2,
      assignee_id: 3
    }
  ],

  createTask: async (taskData) => {
    console.log('Creating task:', taskData)
    return { id: Date.now(), ...taskData, created_at: new Date().toISOString() }
  },

  updateTask: async (id, taskData) => {
    console.log('Updating task:', id, taskData)
    return { id, ...taskData, updated_at: new Date().toISOString() }
  }
}

// Smart API that falls back to mock data if real API is unavailable
export const smartApi = {
  async getUsers() {
    try {
      return await api.users.getAll()
    } catch (error) {
      console.log('API unavailable, using mock data')
      return await mockApi.getUsers()
    }
  },

  async getProjects() {
    try {
      return await api.projects.getAll()
    } catch (error) {
      console.log('API unavailable, using mock data')
      return await mockApi.getProjects()
    }
  },

  async getTasks() {
    try {
      return await api.tasks.getAll()
    } catch (error) {
      console.log('API unavailable, using mock data')
      return await mockApi.getTasks()
    }
  },

  async createTask(taskData) {
    try {
      return await api.tasks.create(taskData)
    } catch (error) {
      console.log('API unavailable, using mock create')
      return await mockApi.createTask(taskData)
    }
  },

  async updateTask(id, taskData) {
    try {
      return await api.tasks.update(id, taskData)
    } catch (error) {
      console.log('API unavailable, using mock update')
      return await mockApi.updateTask(id, taskData)
    }
  }
}

export default api