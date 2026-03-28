import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { signIn, confirmSignIn, getCurrentUser } from 'aws-amplify/auth'

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mfaCode, setMfaCode] = useState('')
  const [step, setStep] = useState('login')
  const [error, setError] = useState('')
  const [session, setSession] = useState(null)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const user = await getCurrentUser()
      if (user) {
        navigate('/lucifer-newstar_dashboard')
      }
    } catch (err) {
      // Not logged in
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const result = await signIn({
        username: email,
        password: password,
      })

      if (result.nextStep?.signInStep === 'CONFIRM_SIGN_IN_WITH_TOTP_MFA') {
        setSession(result.nextStep)
        setStep('mfa')
      } else if (result.isSignedIn) {
        navigate('/lucifer-newstar_dashboard')
      }
    } catch (err) {
      setError(err.message || 'Login failed')
    }
  }

  const handleMFA = async (e) => {
    e.preventDefault()
    setError('')

    try {
      await confirmSignIn({
        challengeResponse: mfaCode,
      })
      navigate('/lucifer-newstar_dashboard')
    } catch (err) {
      setError(err.message || 'MFA verification failed')
    }
  }

  if (step === 'mfa') {
    return (
      <div>
        <h1>Two-Factor Authentication</h1>
        <p>Enter the code from your Google Authenticator app.</p>
        <form onSubmit={handleMFA}>
          <div>
            <label>MFA Code:</label>
            <input
              type="text"
              value={mfaCode}
              onChange={(e) => setMfaCode(e.target.value)}
              required
            />
          </div>
          <button type="submit">Verify</button>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    )
  }

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  )
}

export default Login