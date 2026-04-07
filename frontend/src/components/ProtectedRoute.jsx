import { useEffect, useState } from 'react'
import { getCurrentUser } from 'aws-amplify/auth'
import LoginButton from './LoginButton'
import { hasFallbackAdminSession } from '../utils/adminAuth'

function ProtectedRoute({ children }) {
  const [status, setStatus] = useState('checking')

  useEffect(() => {
    let mounted = true

    const checkAuth = async () => {
      try {
        await getCurrentUser()
        if (mounted) setStatus('authenticated')
      } catch {
        if (mounted) {
          setStatus(hasFallbackAdminSession() ? 'authenticated' : 'unauthenticated')
        }
      }
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
