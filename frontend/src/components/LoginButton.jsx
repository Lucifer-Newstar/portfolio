import { createAdminLoginUrl } from '../utils/adminAuth'

function LoginButton() {
  const loginUrl = createAdminLoginUrl()

  return (
    <div className="container text-center mt-4">
      <h1>Admin Access Only</h1>
      <p>This area is restricted. Please login to continue with the configured admin auth flow.</p>
      <a href={loginUrl} className="btn btn-primary">Login to Admin Dashboard</a>
    </div>
  )
}

export default LoginButton
