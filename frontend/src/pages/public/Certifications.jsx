import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchCertifications } from '../../utils/api'
import LinkedDataModal from '../../components/LinkedDataModal'

function Certifications() {
  const [certifications, setCertifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState({ type: '', id: '', name: '' })

  useEffect(() => {
    const loadCertifications = async () => {
      const data = await fetchCertifications()
      setCertifications(data)
      setLoading(false)
    }
    loadCertifications()
  }, [])

  const handleSkillClick = (skillName) => {
    setSelectedItem({
      type: 'skill',
      id: skillName.toLowerCase().replace(/\s/g, '-'),
      name: skillName
    })
    setModalOpen(true)
  }

  if (loading) {
    return <div className="container text-center mt-4">Loading certifications...</div>
  }

  return (
    <div className="container">
      <h1 className="text-center">Certifications</h1>
      <p className="text-center">Click on any skill to see related projects and certifications.</p>
      
      <div className="certs-grid">
        {certifications.map((cert) => (
          <div key={cert.id} className="cert-card">
            <h3>{cert.name}</h3>
            <p><strong>Issuer:</strong> {cert.issuer}</p>
            <p><strong>Date:</strong> {cert.date}</p>
            <div>
              <strong>Skills:</strong>
              <div className="skill-list mt-1">
                {cert.skills?.map((skill, idx) => (
                  <span 
                    key={idx} 
                    className="skill-tag clickable"
                    onClick={() => handleSkillClick(skill)}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            {cert.link && (
              <a href={cert.link} target="_blank" rel="noopener noreferrer" className="cert-link">
                View Credential →
              </a>
            )}
          </div>
        ))}
      </div>
      
      <hr className="mt-4" />
      
      <div className="text-center mt-3">
        <Link to="/skills" className="btn btn-secondary">View related skills</Link>
        {' '}
        <Link to="/projects" className="btn btn-secondary">See projects</Link>
        {' '}
        <Link to="/posts" className="btn btn-secondary">Read my posts</Link>
      </div>
      
      <LinkedDataModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        itemType={selectedItem.type}
        itemId={selectedItem.id}
        itemName={selectedItem.name}
      />
    </div>
  )
}

export default Certifications