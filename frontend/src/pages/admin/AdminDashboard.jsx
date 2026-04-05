import { useState } from 'react'
import SkillsManager from '../../components/admin/SkillsManager'
import ProjectsManager from '../../components/admin/ProjectsManager'
import ExperienceManager from '../../components/admin/ExperienceManager'
import CertificationsManager from '../../components/admin/CertificationsManager'
import PostsManager from '../../components/admin/PostsManager'

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('skills')

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated')
    window.location.href = '/'
  }

  const tabs = [
    { id: 'skills', name: 'Skills', component: SkillsManager },
    { id: 'projects', name: 'Projects', component: ProjectsManager },
    { id: 'experience', name: 'Experience', component: ExperienceManager },
    { id: 'certifications', name: 'Certifications', component: CertificationsManager },
    { id: 'posts', name: 'Posts', component: PostsManager }
  ]

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component

  return (
    <div className="container">
      <div className="text-center">
        <h1>Admin Dashboard</h1>
        <button onClick={handleLogout} className="btn btn-danger">Logout</button>
      </div>
      
      <hr />
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {tabs.map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)} 
            className="btn btn-secondary"
            style={{
              background: activeTab === tab.id ? '#00D4FF' : 'transparent',
              color: activeTab === tab.id ? '#0A0A0F' : '#00D4FF'
            }}
          >
            {tab.name}
          </button>
        ))}
      </div>
      
      <div className="card">
        {ActiveComponent && <ActiveComponent />}
      </div>
    </div>
  )
}

export default AdminDashboard