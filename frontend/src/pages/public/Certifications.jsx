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
    return <div>Loading certifications...</div>
  }

  return (
    <div>
      <h1>Certifications</h1>
      <p>Professional certifications and credentials.</p>

      {certifications.map((cert) => (
        <div key={cert.id}>
          <h2>{cert.name}</h2>
          <p><strong>Issuer:</strong> {cert.issuer}</p>
          <p><strong>Date:</strong> {cert.date}</p>
          {cert.link && (
            <p>
              <a href={cert.link} target="_blank" rel="noopener noreferrer">
                View Credential →
              </a>
            </p>
          )}
          <div>
            <strong>Skills:</strong>
            <ul>
              {cert.skills.map((skill, idx) => (
                <li key={idx}>{skill}</li>
              ))}
            </ul>
          </div>
          <hr />
        </div>
      ))}

      <div>
        <p>
          <Link to="/skills">View related skills</Link> |{' '}
          <Link to="/projects">See projects using these skills</Link> |{' '}
          <Link to="/posts">Read my posts</Link>
        </p>
      </div>
    </div>
  )
}

export default Certifications