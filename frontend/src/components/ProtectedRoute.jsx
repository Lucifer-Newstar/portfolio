function ProtectedRoute({ children }) {
  const isAuthenticated = localStorage.getItem('isAuthenticated')
  
  if (!isAuthenticated) {
    const cognitoDomain = "https://us-east-1iwnapdbk8.auth.us-east-1.amazoncognito.com"
    const clientId = "2kqig6fjtjb5rot22ccttr398n"
    const redirectUri = "http://localhost:5173/callback"
    const loginUrl = `${cognitoDomain}/login?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}`
    
    return (
      <div>
        <h1>Admin Access Only</h1>
        <a href={loginUrl}>Login to Admin Dashboard</a>
      </div>
    )
  }
  
  return children
}

export default ProtectedRoute