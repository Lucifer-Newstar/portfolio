import { useState } from 'react'
import SkillsManager from '../../components/admin/SkillsManager'
import ProjectsManager from '../../components/admin/ProjectsManager'
import ExperienceManager from '../../components/admin/ExperienceManager'
import CertificationsManager from '../../components/admin/CertificationsManager'

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('skills')

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated')
    window.location.href = '/'
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <button onClick={handleLogout}>Logout</button>
      
      <hr />
      
      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <button onClick={() => setActiveTab('skills')}>Skills</button>
        <button onClick={() => setActiveTab('projects')}>Projects</button>
        <button onClick={() => setActiveTab('experience')}>Experience</button>
        <button onClick={() => setActiveTab('certifications')}>Certifications</button>
      </div>
      
      {/* Tab Content */}
      {activeTab === 'skills' && <SkillsManager />}
      {activeTab === 'projects' && <ProjectsManager />}
      {activeTab === 'experience' && <ExperienceManager />}
      {activeTab === 'certifications' && <CertificationsManager />}
    </div>
  )
}

export default AdminDashboard