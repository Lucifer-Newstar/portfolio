const SESSION_KEY = 'portfolio-admin-session'
const STATE_KEY = 'portfolio-admin-state'
const VERIFIER_KEY = 'portfolio-admin-pkce-verifier'
const ACCESS_TOKEN_KEY = 'portfolio-admin-access-token'
const ID_TOKEN_KEY = 'portfolio-admin-id-token'
const SESSION_DURATION_MS = 1000 * 60 * 60 * 8

function isBrowser() {
  return typeof window !== 'undefined'
}

function getOrigin() {
  return isBrowser() ? window.location.origin : ''
}

export function getAdminAuthConfig() {
  const cognitoDomain = import.meta.env.VITE_COGNITO_DOMAIN || 'https://us-east-1iwnapdbk8.auth.us-east-1.amazoncognito.com'
  return {
    cognitoDomain,
    clientId: import.meta.env.VITE_COGNITO_CLIENT_ID || '7tdl4lp5g8iiam88m38737di4h',
    redirectUri: import.meta.env.VITE_COGNITO_REDIRECT_URI || `${getOrigin()}/callback`,
    scope: import.meta.env.VITE_COGNITO_SCOPE || 'openid email phone',
    tokenEndpoint: `${cognitoDomain}/oauth2/token`,
  }
}

function randomString(length = 64) {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~'
  const values = new Uint8Array(length)
  crypto.getRandomValues(values)
  let result = ''
  for (let i = 0; i < values.length; i += 1) {
    result += charset[values[i] % charset.length]
  }
  return result
}

async function sha256Base64Url(input) {
  const encoder = new TextEncoder()
  const data = encoder.encode(input)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const base64 = btoa(String.fromCharCode(...hashArray))
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

export async function createAdminLoginUrl() {
  const { cognitoDomain, clientId, redirectUri, scope } = getAdminAuthConfig()
  const state = randomString(40)
  const codeVerifier = randomString(96)
  const codeChallenge = await sha256Base64Url(codeVerifier)
  if (isBrowser()) {
    sessionStorage.setItem(STATE_KEY, state)
    sessionStorage.setItem(VERIFIER_KEY, codeVerifier)
  }

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectUri,
    scope,
    state,
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
  })

  return `${cognitoDomain}/login?${params.toString()}`
}

export async function completeAdminSessionFromCallback(code, state) {
  if (!isBrowser()) return false

  const expectedState = sessionStorage.getItem(STATE_KEY)
  const verifier = sessionStorage.getItem(VERIFIER_KEY)
  if (!expectedState || !state || expectedState !== state || !code || !verifier) {
    sessionStorage.removeItem(STATE_KEY)
    sessionStorage.removeItem(VERIFIER_KEY)
    return false
  }

  const { clientId, redirectUri, tokenEndpoint } = getAdminAuthConfig()
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: clientId,
    code,
    redirect_uri: redirectUri,
    code_verifier: verifier,
  })

  let tokenResponse
  try {
    tokenResponse = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    })
  } catch {
    return false
  }

  if (!tokenResponse.ok) {
    return false
  }

  let tokenPayload
  try {
    tokenPayload = await tokenResponse.json()
  } catch {
    return false
  }

  if (!tokenPayload?.access_token) {
    return false
  }

  const expiresIn = Number(tokenPayload.expires_in || 3600)
  const expiresAt = Date.now() + Math.max(60, expiresIn) * 1000

  sessionStorage.removeItem(STATE_KEY)
  sessionStorage.removeItem(VERIFIER_KEY)
  sessionStorage.setItem(SESSION_KEY, JSON.stringify({
    createdAt: Date.now(),
    expiresAt: Math.min(Date.now() + SESSION_DURATION_MS, expiresAt),
  }))
  sessionStorage.setItem(ACCESS_TOKEN_KEY, tokenPayload.access_token)
  if (tokenPayload.id_token) {
    sessionStorage.setItem(ID_TOKEN_KEY, tokenPayload.id_token)
  } else {
    sessionStorage.removeItem(ID_TOKEN_KEY)
  }
  return true
}

export function clearAdminSession() {
  if (!isBrowser()) return
  sessionStorage.removeItem(SESSION_KEY)
  sessionStorage.removeItem(STATE_KEY)
  sessionStorage.removeItem(VERIFIER_KEY)
  sessionStorage.removeItem(ACCESS_TOKEN_KEY)
  sessionStorage.removeItem(ID_TOKEN_KEY)
  localStorage.removeItem('isAuthenticated')
}

export function getAdminAccessToken() {
  if (!isBrowser()) return ''
  return sessionStorage.getItem(ACCESS_TOKEN_KEY) || ''
}

export function hasAdminSession() {
  if (!isBrowser()) return false

  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    const accessToken = sessionStorage.getItem(ACCESS_TOKEN_KEY)
    if (!raw) return false
    if (!accessToken) {
      clearAdminSession()
      return false
    }
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
