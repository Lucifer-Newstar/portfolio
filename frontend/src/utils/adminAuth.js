const SESSION_KEY = 'portfolio-admin-session'
const STATE_KEY = 'portfolio-admin-state'
const SESSION_DURATION_MS = 1000 * 60 * 60 * 8

function isBrowser() {
  return typeof window !== 'undefined'
}

function getOrigin() {
  return isBrowser() ? window.location.origin : ''
}

export function getAdminAuthConfig() {
  return {
    cognitoDomain: import.meta.env.VITE_COGNITO_DOMAIN || 'https://us-east-1iwnapdbk8.auth.us-east-1.amazoncognito.com',
    clientId: import.meta.env.VITE_COGNITO_CLIENT_ID || '2kqig6fjtjb5rot22ccttr398n',
    redirectUri: import.meta.env.VITE_COGNITO_REDIRECT_URI || `${getOrigin()}/callback`,
  }
}

export function createAdminLoginUrl() {
  const { cognitoDomain, clientId, redirectUri } = getAdminAuthConfig()
  const state = Math.random().toString(36).slice(2) + Date.now().toString(36)
  if (isBrowser()) {
    sessionStorage.setItem(STATE_KEY, state)
  }

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectUri,
    state,
  })

  return `${cognitoDomain}/login?${params.toString()}`
}

export function completeFallbackAdminSession(state) {
  if (!isBrowser()) return false

  const expectedState = sessionStorage.getItem(STATE_KEY)
  if (!expectedState || !state || expectedState !== state) {
    sessionStorage.removeItem(STATE_KEY)
    return false
  }

  sessionStorage.removeItem(STATE_KEY)
  sessionStorage.setItem(SESSION_KEY, JSON.stringify({
    createdAt: Date.now(),
    expiresAt: Date.now() + SESSION_DURATION_MS,
  }))
  return true
}

export function clearAdminSession() {
  if (!isBrowser()) return
  sessionStorage.removeItem(SESSION_KEY)
  sessionStorage.removeItem(STATE_KEY)
  localStorage.removeItem('isAuthenticated')
}

export function hasFallbackAdminSession() {
  if (!isBrowser()) return false

  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    if (!raw) return false
    const session = JSON.parse(raw)
    if (!session?.expiresAt || session.expiresAt < Date.now()) {
      clearAdminSession()
      return false
    }
    return true
  } catch {
    clearAdminSession()
    return false
  }
}
