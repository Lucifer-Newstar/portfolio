const API_BASE_URL = "https://6e2n1oy6k9.execute-api.us-east-1.amazonaws.com/prod"

// ========== HELPER FUNCTION ==========
const handleResponse = async (response) => {
  const result = await response.json()
  console.log("API Response:", result)
  
  // Handle Lambda proxy integration response
  if (result.statusCode === 200 || result.statusCode === 201) {
    if (result.body) {
      return JSON.parse(result.body)
    }
    return result
  }
  
  // Handle error responses
  if (result.statusCode >= 400) {
    const error = result.body ? JSON.parse(result.body) : result
    throw new Error(error.error || error.message || "Request failed")
  }
  
  return result
}

// ========== SKILLS ==========
export const fetchSkills = async () => {
  console.log("Fetching skills...")
  try {
    const response = await fetch(`${API_BASE_URL}/skills`)
    const result = await response.json()
    console.log("Skills fetch result:", result)
    
    // Handle Lambda response format
    if (result.body) {
      return JSON.parse(result.body)
    }
    return Array.isArray(result) ? result : []
  } catch (error) {
    console.error("Fetch skills error:", error)
    return []
  }
}

export const createSkill = async (skill) => {
  console.log("Creating skill:", skill)
  try {
    const response = await fetch(`${API_BASE_URL}/skills`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(skill)
    })
    return await handleResponse(response)
  } catch (error) {
    console.error("Create skill error:", error)
    throw error
  }
}

export const updateSkill = async (id, updates) => {
  console.log("Updating skill - ID:", id, "Updates:", updates)
  try {
    const response = await fetch(`${API_BASE_URL}/skills/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    })
    return await handleResponse(response)
  } catch (error) {
    console.error("Update skill error:", error)
    throw error
  }
}

export const deleteSkill = async (id) => {
  console.log("Deleting skill - ID:", id)
  try {
    const response = await fetch(`${API_BASE_URL}/skills/${id}`, {
      method: 'DELETE'
    })
    return await handleResponse(response)
  } catch (error) {
    console.error("Delete skill error:", error)
    throw error
  }
}

// ========== PROJECTS ==========
export const fetchProjects = async () => {
  try {
    // For admin dashboard, add ?admin=true to see all projects
    const isAdmin = window.location.pathname.includes('lucifer-newstar_dashboard')
    const url = isAdmin ? `${API_BASE_URL}/projects?admin=true` : `${API_BASE_URL}/projects`
    const response = await fetch(url)
    const result = await response.json()
    if (result.body) return JSON.parse(result.body)
    return Array.isArray(result) ? result : []
  } catch (error) {
    console.error("Fetch projects error:", error)
    return []
  }
}

export const createProject = async (project) => {
  const response = await fetch(`${API_BASE_URL}/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(project)
  })
  return handleResponse(response)
}

export const updateProject = async (id, updates) => {
  const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  })
  return handleResponse(response)
}

export const deleteProject = async (id) => {
  const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
    method: 'DELETE'
  })
  return handleResponse(response)
}

// ========== EXPERIENCE ==========
export const fetchExperience = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/experience`)
    const result = await response.json()
    if (result.body) return JSON.parse(result.body)
    return Array.isArray(result) ? result : []
  } catch (error) {
    console.error("Fetch experience error:", error)
    return []
  }
}

export const createExperience = async (exp) => {
  const response = await fetch(`${API_BASE_URL}/experience`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(exp)
  })
  return handleResponse(response)
}

export const updateExperience = async (id, updates) => {
  const response = await fetch(`${API_BASE_URL}/experience/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  })
  return handleResponse(response)
}

export const deleteExperience = async (id) => {
  const response = await fetch(`${API_BASE_URL}/experience/${id}`, {
    method: 'DELETE'
  })
  return handleResponse(response)
}

// ========== CERTIFICATIONS ==========
export const fetchCertifications = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/certifications`)
    const result = await response.json()
    if (result.body) return JSON.parse(result.body)
    return Array.isArray(result) ? result : []
  } catch (error) {
    console.error("Fetch certifications error:", error)
    return []
  }
}

export const createCertification = async (cert) => {
  const response = await fetch(`${API_BASE_URL}/certifications`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cert)
  })
  return handleResponse(response)
}

export const updateCertification = async (id, updates) => {
  const response = await fetch(`${API_BASE_URL}/certifications/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  })
  return handleResponse(response)
}

export const deleteCertification = async (id) => {
  const response = await fetch(`${API_BASE_URL}/certifications/${id}`, {
    method: 'DELETE'
  })
  return handleResponse(response)
}

// ========== POSTS ==========
export const fetchPosts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/posts`)
    const result = await response.json()
    if (result.body) return JSON.parse(result.body)
    return Array.isArray(result) ? result : []
  } catch (error) {
    console.error("Fetch posts error:", error)
    return []
  }
}

export const syncGitHubActivity = async () => {
  const response = await fetch(`${API_BASE_URL}/posts/sync-github`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  })
  return handleResponse(response)
}

export const createPost = async (post) => {
  const response = await fetch(`${API_BASE_URL}/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(post)
  })
  return handleResponse(response)
}

export const updatePost = async (id, updates) => {
  const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  })
  return handleResponse(response)
}

export const deletePost = async (id) => {
  const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
    method: 'DELETE'
  })
  return handleResponse(response)
}