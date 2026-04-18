import { useEffect, useState } from 'react'
import LoginButton from './LoginButton'
import { hasAdminSession } from '../utils/adminAuth'

function ProtectedRoute({ children }) {
  const [status, setStatus] = useState('checking')

  useEffect(() => {
    let mounted = true

    const checkAuth = () => {
      if (!mounted) return
      setStatus(hasAdminSession() ? 'authenticated' : 'unauthenticated')
    }

    checkAuth()
    return () => {
      mounted = false
    }
  }, [])

  if (status === 'checking') {
    return (
      <div className="admin-access-gate">
        <div className="admin-access-gate-card admin-shell-panel">
          <span className="eyebrow">Secure entry</span>
          <h2>Checking admin access</h2>
          <p>Verifying the active session before opening the dedicated dashboard workspace.</p>
          <div className="admin-access-gate-meta">
            <span className="metric-pill">Session check in progress</span>
          </div>
        </div>
      </div>
    )
  }

  if (status !== 'authenticated') {
    return <LoginButton />
  }

  return children
}

export default ProtectedRoute
