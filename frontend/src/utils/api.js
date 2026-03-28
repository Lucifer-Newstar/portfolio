const API_BASE_URL = "https://6e2n1oy6k9.execute-api.us-east-1.amazonaws.com/prod"

// Helper to handle API responses
const fetchAPI = async (endpoint) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`)
  const result = await response.json()
  if (result.body) {
    return JSON.parse(result.body)
  }
  return result
}

// ========== SKILLS ==========
export const fetchSkills = async () => fetchAPI('/skills')
export const createSkill = async (skill) => {
  const response = await fetch(`${API_BASE_URL}/skills`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(skill)
  })
  return response.json()
}
export const updateSkill = async (id, updates) => {
  const response = await fetch(`${API_BASE_URL}/skills/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  })
  return response.json()
}
export const deleteSkill = async (id) => {
  const response = await fetch(`${API_BASE_URL}/skills/${id}`, {
    method: 'DELETE'
  })
  return response.json()
}

// ========== PROJECTS ==========
export const fetchProjects = async () => fetchAPI('/projects')
export const createProject = async (project) => {
  const response = await fetch(`${API_BASE_URL}/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(project)
  })
  return response.json()
}
export const updateProject = async (id, updates) => {
  const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  })
  return response.json()
}
export const deleteProject = async (id) => {
  const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
    method: 'DELETE'
  })
  return response.json()
}

// ========== EXPERIENCE ==========
export const fetchExperience = async () => fetchAPI('/experience')
export const createExperience = async (exp) => {
  const response = await fetch(`${API_BASE_URL}/experience`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(exp)
  })
  return response.json()
}
export const updateExperience = async (id, updates) => {
  const response = await fetch(`${API_BASE_URL}/experience/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  })
  return response.json()
}
export const deleteExperience = async (id) => {
  const response = await fetch(`${API_BASE_URL}/experience/${id}`, {
    method: 'DELETE'
  })
  return response.json()
}

// ========== CERTIFICATIONS ==========
export const fetchCertifications = async () => fetchAPI('/certifications')
export const createCertification = async (cert) => {
  const response = await fetch(`${API_BASE_URL}/certifications`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cert)
  })
  return response.json()
}
export const updateCertification = async (id, updates) => {
  const response = await fetch(`${API_BASE_URL}/certifications/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  })
  return response.json()
}
export const deleteCertification = async (id) => {
  const response = await fetch(`${API_BASE_URL}/certifications/${id}`, {
    method: 'DELETE'
  })
  return response.json()
}