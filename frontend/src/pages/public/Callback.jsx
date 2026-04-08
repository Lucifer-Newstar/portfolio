import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { completeAdminSessionFromCallback } from '../../utils/adminAuth'

function Callback() {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const code = params.get('code')
    const state = params.get('state')

    const complete = async () => {
      if (!code) {
        navigate('/')
        return
      }
      const completed = await completeAdminSessionFromCallback(code, state)
      navigate(completed ? '/lucifer-newstar_dashboard' : '/')
    }

    complete()
  }, [location, navigate])

  return <div className="container text-center mt-4">Processing login...</div>
}

export default Callback
