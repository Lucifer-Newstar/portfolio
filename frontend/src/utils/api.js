import { getAdminAccessToken } from './adminAuth'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://6e2n1oy6k9.execute-api.us-east-1.amazonaws.com/prod'
const REQUEST_TIMEOUT_MS = 12000
const SITE_CONTENT_POST_ID = '__site-content__'
const DEPLOY_WEBHOOK_URL = import.meta.env.VITE_DEPLOY_WEBHOOK_URL || ''
const DEPLOY_API_PATH = import.meta.env.VITE_DEPLOY_API_PATH || '/admin/deploy'

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
  const includeAdminAuth = options.includeAdminAuth === true
  const accessToken = includeAdminAuth ? getAdminAccessToken() : ''

  if (includeAdminAuth && !accessToken) {
    throw new Error('Admin session missing or expired. Please login again.')
  }

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(includeAdminAuth ? { Authorization: `Bearer ${accessToken}` } : {}),
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
    const content = await request('/admin/content', { method: 'GET' })
    if (content && typeof content === 'object') return content
    return null
  } catch {
    try {
      const posts = await request('/posts', { method: 'GET' })
      if (!Array.isArray(posts)) return null
      const record = posts.find((post) => post.id === SITE_CONTENT_POST_ID)
      return parseSiteContentRecord(record)
    } catch {
      return null
    }
  }
}

export const saveSiteContentRemote = async (content) => {
  return request('/admin/content', {
    method: 'POST',
    body: JSON.stringify(content),
    includeAdminAuth: true,
  })
}

export const uploadAdminImage = async ({ filename, contentType, data }) => {
  return request('/admin/upload-image', {
    method: 'POST',
    body: JSON.stringify({ filename, contentType, data }),
    includeAdminAuth: true,
  })
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

export const submitContactForm = async (payload) =>
  request('/contact', {
    method: 'POST',
    body: JSON.stringify(payload),
  })

export const fetchOpsSummary = async () =>
  request('/ops/summary', {
    method: 'GET',
  })

export const fetchAdminOpsInsights = async () =>
  request('/admin/ops-insights', {
    method: 'GET',
    includeAdminAuth: true,
  })

export const triggerWebsiteDeploy = async () => {
  try {
    return await request(DEPLOY_API_PATH, {
      method: 'POST',
      body: JSON.stringify({
        source: 'admin-dashboard',
        requestedAt: new Date().toISOString(),
      }),
      includeAdminAuth: true,
    })
  } catch (apiError) {
    if (!DEPLOY_WEBHOOK_URL) {
      throw new Error(`Deploy API failed: ${apiError.message}. Also no webhook configured (VITE_DEPLOY_WEBHOOK_URL).`)
    }
  }

  let response
  try {
    response = await fetch(DEPLOY_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        source: 'admin-dashboard',
        requestedAt: new Date().toISOString(),
      }),
    })
  } catch (error) {
    throw new Error(`Deploy request failed: ${error.message}`)
  }

  const raw = await response.text()
  let parsed = {}
  if (raw) {
    try {
      parsed = JSON.parse(raw)
    } catch {
      parsed = { message: raw }
    }
  }

  if (!response.ok) {
    const reason = parsed?.error || parsed?.message || `HTTP ${response.status}`
    throw new Error(`Deploy failed: ${reason}`)
  }

  return parsed
}
