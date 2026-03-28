import LoginButton from './LoginButton'

function ProtectedRoute({ children }) {
  const isAuthenticated = localStorage.getItem('isAuthenticated')

  if (!isAuthenticated) {
    return <LoginButton />
  }

  return children
}

export default ProtectedRoute