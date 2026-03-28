function Callback() {
  // Get the code from URL
  const urlParams = new URLSearchParams(window.location.search)
  const code = urlParams.get('code')
  
  if (code) {
    // Store that user is logged in
    localStorage.setItem('isAuthenticated', 'true')
    
    // Redirect to admin dashboard
    window.location.href = '/lucifer-newstar_dashboard'
    return <div>Redirecting to admin dashboard...</div>
  }
  
  // If no code, go home
  window.location.href = '/'
  return <div>No code found, redirecting...</div>
}

export default Callback