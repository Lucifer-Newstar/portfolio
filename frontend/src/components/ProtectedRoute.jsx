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
    return <div className="container text-center mt-4">Checking admin access...</div>
  }

  if (status !== 'authenticated') {
    return <LoginButton />
  }

  return children
}

export default ProtectedRoute
