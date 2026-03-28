function AdminDashboard() {
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated')
    window.location.href = '/'
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>You are logged in!</p>
      <button onClick={handleLogout}>Logout</button>
      <p>Features planned:</p>
      <ul>
        <li>Deploy history</li>
        <li>Manual deploy</li>
        <li>CloudWatch metrics</li>
        <li>Site analytics</li>
        <li>Skill tracker</li>
        <li>Projects manager</li>
        <li>Certifications manager</li>
      </ul>
    </div>
  )
}

export default AdminDashboard