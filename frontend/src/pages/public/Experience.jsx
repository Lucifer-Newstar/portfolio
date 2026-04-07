import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchExperience } from '../../utils/api'

function Experience() {
  const [experiences, setExperiences] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadExperience = async () => {
      const data = await fetchExperience()
      setExperiences(data)
      setLoading(false)
    }
    loadExperience()
  }, [])

  const parseDescription = (description) => {
    if (Array.isArray(description)) return description
    if (typeof description === 'string') {
      try {
        return JSON.parse(description)
      } catch {
        return [description]
      }
    }
    return []
  }

  if (loading) {
    return <div className="container text-center mt-4">Loading experience...</div>
  }

  return (
    <div className="container">
      <h1 className="text-center">Experience</h1>
      <p className="text-center">My professional journey in DevOps, Cloud, and leadership.</p>
      
      <div className="timeline">
        {experiences.map((exp) => (
          <div key={exp.id} className="experience-item">
            <h3>{exp.title}</h3>
            <h4>{exp.organization}</h4>
            <span className="exp-period">{exp.period} | {exp.location}</span>
            <ul>
              {parseDescription(exp.description).map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
            <div>
              <strong>Skills used:</strong>
              <div className="skill-list mt-1">
                {exp.skills?.map((skill, idx) => (
                  <span key={idx} className="skill-tag">{skill}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <hr className="mt-4" />
      
      <div className="text-center mt-3">
        <Link to="/skills" className="btn btn-secondary">View my skills</Link>
        {' '}
        <Link to="/projects" className="btn btn-secondary">See my projects</Link>
        {' '}
        <Link to="/certifications" className="btn btn-secondary">Check certifications</Link>
      </div>
    </div>
  )
}

export default Experience