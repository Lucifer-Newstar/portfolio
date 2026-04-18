import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { createAdminLoginUrl } from '../utils/adminAuth'

function LoginButton() {
  const [loginUrl, setLoginUrl] = useState('')

  useEffect(() => {
    let mounted = true
    const hydrateLoginUrl = async () => {
      const url = await createAdminLoginUrl()
      if (mounted) {
        setLoginUrl(url)
      }
    }
    hydrateLoginUrl()
    return () => {
      mounted = false
    }
  }, [])

  return (
    <div className="admin-access-gate">
      <div className="admin-access-gate-card admin-shell-panel">
        <span className="eyebrow">Secure entry</span>
        <h2>Admin access only</h2>
        <p>
          The dashboard now lives in its own dedicated workspace. Authenticate with the configured
          admin flow to manage content, preview changes, and publish updates without mixing with the public site.
        </p>

        <div className="admin-access-gate-meta">
          <span className="metric-pill">Protected area</span>
          <span className="metric-pill">Portfolio operations enabled</span>
          <span className="metric-pill admin-access-gate-status">
            {loginUrl ? 'Secure login ready' : 'Preparing secure login'}
          </span>
        </div>

        <div className="admin-access-gate-actions">
          <a href={loginUrl || '#'} className="btn btn-primary" aria-disabled={!loginUrl}>
            {loginUrl ? 'Login to Admin Dashboard' : 'Preparing secure login...'}
          </a>
          <Link to="/" className="btn btn-secondary">Return to public site</Link>
        </div>
      </div>
    </div>
  )
}

export default LoginButton
