import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { completeFallbackAdminSession } from '../../utils/adminAuth'

function Callback() {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const code = params.get('code')
    const state = params.get('state')

    if (code) {
      const completed = completeFallbackAdminSession(state)
      navigate(completed ? '/lucifer-newstar_dashboard' : '/')
    } else {
      navigate('/')
    }
  }, [location, navigate])

  return <div className="container text-center mt-4">Processing login...</div>
}

export default Callback
