import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchProjects, fetchCertifications, fetchExperience } from '../utils/api'
import { skillRelations, projectRelations, certificationRelations } from '../data/relationships'

function LinkedDataModal({ isOpen, onClose, itemType, itemId, itemName }) {
  const [activeTab, setActiveTab] = useState('projects')
  const [projects, setProjects] = useState([])
  const [certifications, setCertifications] = useState([])
  const [experience, setExperience] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isOpen) {
      loadRelatedData()
    }
  }, [isOpen, itemType, itemId])

  const loadRelatedData = async () => {
    setLoading(true)
    
    // Fetch all data
    const allProjects = await fetchProjects()
    const allCerts = await fetchCertifications()
    const allExp = await fetchExperience()
    
    let relatedProjectIds = []
    let relatedCertIds = []
    let relatedExpIds = []
    
    // Get relationships based on item type
    if (itemType === 'skill') {
      const relations = skillRelations[itemName] || { projects: [], certifications: [], experience: [] }
      relatedProjectIds = relations.projects
      relatedCertIds = relations.certifications
      relatedExpIds = relations.experience
    } else if (itemType === 'project') {
      const relations = projectRelations[itemId] || { skills: [], certifications: [] }
      relatedCertIds = relations.certifications
      // For projects, also find skills and then their related items
    } else if (itemType === 'certification') {
      const relations = certificationRelations[itemId] || { skills: [], projects: [] }
      relatedProjectIds = relations.projects
    }
    
    // Filter items
    setProjects(allProjects.filter(p => relatedProjectIds.includes(p.id)))
    setCertifications(allCerts.filter(c => relatedCertIds.includes(c.id)))
    setExperience(allExp.filter(e => relatedExpIds.includes(e.id)))
    
    setLoading(false)
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{itemName}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        
        <div className="modal-tabs">
          <button 
            className={`modal-tab ${activeTab === 'projects' ? 'active' : ''}`}
            onClick={() => setActiveTab('projects')}
          >
            Projects ({projects.length})
          </button>
          <button 
            className={`modal-tab ${activeTab === 'experience' ? 'active' : ''}`}
            onClick={() => setActiveTab('experience')}
          >
            Experience ({experience.length})
          </button>
          <button 
            className={`modal-tab ${activeTab === 'certifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('certifications')}
          >
            Certifications ({certifications.length})
          </button>
        </div>
        
        <div className="modal-body">
          {loading && <div className="modal-loading">Loading...</div>}
          
          {!loading && activeTab === 'projects' && (
            <div className="modal-list">
              {projects.length === 0 && <p>No projects found.</p>}
              {projects.map(project => (
                <div key={project.id} className="modal-item">
                  <h3>{project.title}</h3>
                  <p>{project.description?.substring(0, 100)}...</p>
                  <Link to={`/projects`} onClick={onClose} className="modal-link">
                    View Project →
                  </Link>
                </div>
              ))}
            </div>
          )}
          
          {!loading && activeTab === 'experience' && (
            <div className="modal-list">
              {experience.length === 0 && <p>No experience found.</p>}
              {experience.map(exp => (
                <div key={exp.id} className="modal-item">
                  <h3>{exp.title}</h3>
                  <p>{exp.organization} | {exp.period}</p>
                  <Link to={`/experience`} onClick={onClose} className="modal-link">
                    View Experience →
                  </Link>
                </div>
              ))}
            </div>
          )}
          
          {!loading && activeTab === 'certifications' && (
            <div className="modal-list">
              {certifications.length === 0 && <p>No certifications found.</p>}
              {certifications.map(cert => (
                <div key={cert.id} className="modal-item">
                  <h3>{cert.name}</h3>
                  <p>{cert.issuer} | {cert.date}</p>
                  <Link to={`/certifications`} onClick={onClose} className="modal-link">
                    View Certification →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default LinkedDataModal