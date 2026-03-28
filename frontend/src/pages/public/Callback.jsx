import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

function Callback() {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const code = params.get('code')

    if (code) {
      // Store that user is authenticated
      localStorage.setItem('isAuthenticated', 'true')
      // In production, you'd exchange the code for tokens here
      navigate('/lucifer-newstar_dashboard')
    } else {
      navigate('/')
    }
  }, [location, navigate])

  return <div className="container text-center mt-4">Processing login...</div>
}

export default Callback