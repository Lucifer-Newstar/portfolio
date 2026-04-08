const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://6e2n1oy6k9.execute-api.us-east-1.amazonaws.com/prod'
const REQUEST_TIMEOUT_MS = 12000
const SITE_CONTENT_POST_ID = '__site-content__'

function parseApiPayload(result) {
  if (result?.body) {
    try {
      return JSON.parse(result.body)
    } catch {
      return result.body
    }
  }
  return result
}

async function handleResponse(response) {
  const rawText = await response.text()
  let result = {}

  if (rawText) {
    try {
      result = JSON.parse(rawText)
    } catch {
      result = { message: rawText }
    }
  }
  const parsed = parseApiPayload(result)

  if (!response.ok || result?.statusCode >= 400) {
    const message = parsed?.error || parsed?.message || 'Request failed'
    throw new Error(message)
  }

  return parsed
}

async function request(path, options = {}) {
  const controller = new AbortController()
  const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      signal: controller.signal,
    })

    return await handleResponse(response)
  } finally {
    window.clearTimeout(timeoutId)
  }
}

async function fetchCollection(path) {
  try {
    const result = await request(path, { method: 'GET' })
    return Array.isArray(result) ? result : []
  } catch {
    return []
  }
}

function parseSiteContentRecord(record) {
  if (!record || record.id !== SITE_CONTENT_POST_ID) return null
  if (typeof record.content !== 'string') return null
  try {
    return JSON.parse(record.content)
  } catch {
    return null
  }
}

export const fetchSiteContentRemote = async () => {
  try {
    const posts = await request('/posts', { method: 'GET' })
    if (!Array.isArray(posts)) return null
    const record = posts.find((post) => post.id === SITE_CONTENT_POST_ID)
    return parseSiteContentRecord(record)
  } catch {
    return null
  }
}

export const saveSiteContentRemote = async (content) => {
  const payload = {
    id: SITE_CONTENT_POST_ID,
    type: 'system',
    title: 'Site Content Snapshot',
    content: JSON.stringify(content),
    link: '',
    date: new Date().toISOString(),
    visible: false,
    order: 999999,
  }
  return request('/posts', { method: 'POST', body: JSON.stringify(payload) })
}

export const fetchSkills = async () => fetchCollection('/skills')
export const createSkill = async (skill) => request('/skills', { method: 'POST', body: JSON.stringify(skill) })
export const updateSkill = async (id, updates) => request(`/skills/${id}`, { method: 'PUT', body: JSON.stringify(updates) })
export const deleteSkill = async (id) => request(`/skills/${id}`, { method: 'DELETE' })

export const fetchProjects = async () => {
  const isAdmin = window.location.pathname.includes('lucifer-newstar_dashboard')
  return fetchCollection(isAdmin ? '/projects?admin=true' : '/projects')
}
export const createProject = async (project) => request('/projects', { method: 'POST', body: JSON.stringify(project) })
export const updateProject = async (id, updates) => request(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(updates) })
export const deleteProject = async (id) => request(`/projects/${id}`, { method: 'DELETE' })

export const fetchExperience = async () => fetchCollection('/experience')
export const createExperience = async (exp) => request('/experience', { method: 'POST', body: JSON.stringify(exp) })
export const updateExperience = async (id, updates) => request(`/experience/${id}`, { method: 'PUT', body: JSON.stringify(updates) })
export const deleteExperience = async (id) => request(`/experience/${id}`, { method: 'DELETE' })

export const fetchCertifications = async () => fetchCollection('/certifications')
export const createCertification = async (cert) => request('/certifications', { method: 'POST', body: JSON.stringify(cert) })
export const updateCertification = async (id, updates) => request(`/certifications/${id}`, { method: 'PUT', body: JSON.stringify(updates) })
export const deleteCertification = async (id) => request(`/certifications/${id}`, { method: 'DELETE' })

export const fetchPosts = async (options = {}) => {
  const posts = await fetchCollection('/posts')
  const includeHidden = options?.includeHidden === true
  const includeSystem = options?.includeSystem === true

  return posts.filter((post) => {
    if (!includeSystem && post.type === 'system') return false
    if (!includeHidden && post.visible === false) return false
    return true
  })
}
export const syncGitHubActivity = async () => request('/posts/sync-github', { method: 'POST' })
export const createPost = async (post) => request('/posts', { method: 'POST', body: JSON.stringify(post) })
export const updatePost = async (id, updates) => request(`/posts/${id}`, { method: 'PUT', body: JSON.stringify(updates) })
export const deletePost = async (id) => request(`/posts/${id}`, { method: 'DELETE' })
