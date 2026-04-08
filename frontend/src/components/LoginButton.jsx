import { useEffect, useState } from 'react'
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
    <div className="container text-center mt-4">
      <h1>Admin Access Only</h1>
      <p>This area is restricted. Please login to continue with the configured admin auth flow.</p>
      <a href={loginUrl || '#'} className="btn btn-primary" aria-disabled={!loginUrl}>
        {loginUrl ? 'Login to Admin Dashboard' : 'Preparing secure login...'}
      </a>
    </div>
  )
}

export default LoginButton
