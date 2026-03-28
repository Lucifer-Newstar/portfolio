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
      
      <hr />
      
      <h2>Content Management</h2>
      <p>Coming soon: Manage skills, projects, experience, and certifications.</p>
      
      <ul>
        <li>Skills Manager - Add, edit, delete skills</li>
        <li>Projects Manager - Add, edit, delete projects</li>
        <li>Experience Manager - Add, edit, delete experience</li>
        <li>Certifications Manager - Add, edit, delete certifications</li>
      </ul>
    </div>
  )
}

export default AdminDashboard