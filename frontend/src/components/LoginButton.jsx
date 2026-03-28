function LoginButton() {
  const cognitoDomain = "https://us-east-1iwnapdbk8.auth.us-east-1.amazoncognito.com"
  const clientId = "2kqig6fjtjb5rot22ccttr398n"
  const redirectUri = "http://localhost:5173/callback"

  const loginUrl = `${cognitoDomain}/login?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}`

  return (
    <div className="container text-center mt-4">
      <h1>Admin Access Only</h1>
      <p>This area is restricted. Please login to continue.</p>
      <a href={loginUrl} className="btn btn-primary">Login to Admin Dashboard</a>
    </div>
  )
}

export default LoginButton