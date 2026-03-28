import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchCertifications } from '../../utils/api'

function Certifications() {
  const [certifications, setCertifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCertifications = async () => {
      const data = await fetchCertifications()
      setCertifications(data)
      setLoading(false)
    }
    loadCertifications()
  }, [])

  if (loading) {
    return <div className="container text-center mt-4">Loading certifications...</div>
  }

  return (
    <div className="container">
      <h1 className="text-center">Certifications</h1>
      <p className="text-center">Professional certifications and credentials.</p>
      
      <div className="certs-grid mt-4">
        {certifications.map((cert) => (
          <div key={cert.id} className="cert-card">
            <h3>{cert.name}</h3>
            <p><strong>Issuer:</strong> {cert.issuer}</p>
            <p><strong>Date:</strong> {cert.date}</p>
            {cert.link && (
              <a href={cert.link} target="_blank" rel="noopener noreferrer" className="btn btn-primary cert-link">
                View Credential →
              </a>
            )}
            <div className="mt-2">
              <strong>Skills:</strong>
              <div className="skill-list mt-1">
                {cert.skills?.map((skill, idx) => (
                  <span key={idx} className="skill-tag">{skill}</span>
                ))}
              </div>
            </div>
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
    </div>
  )
}

export default Certifications