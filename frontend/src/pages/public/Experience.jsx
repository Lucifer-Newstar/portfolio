import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchExperience } from '../../utils/api'

function Experience() {
  const [experiences, setExperiences] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadExperience = async () => {
      const data = await fetchExperience()
      // Handle the API response structure
      const parsedData = data.body ? JSON.parse(data.body) : data
      setExperiences(parsedData)
      setLoading(false)
    }
    loadExperience()
  }, [])

  if (loading) {
    return <div>Loading experience...</div>
  }

  // Parse description string into array if needed
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

  return (
    <div>
      <h1>Experience</h1>
      <p>My professional journey in DevOps, Cloud, and leadership.</p>

      {experiences.map((exp) => (
        <div key={exp.id}>
          <h2>{exp.title}</h2>
          <h3>{exp.organization}</h3>
          <p>{exp.period} | {exp.location}</p>
          <ul>
            {parseDescription(exp.description).map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
          <div>
            <strong>Skills used:</strong>
            <ul>
              {exp.skills?.map((skill, idx) => (
                <li key={idx}>{skill}</li>
              ))}
            </ul>
          </div>
          <hr />
        </div>
      ))}

      <div>
        <p>
          <Link to="/skills">View my skills</Link> |{' '}
          <Link to="/projects">See my projects</Link> |{' '}
          <Link to="/certifications">Check certifications</Link>
        </p>
      </div>
    </div>
  )
}

export default Experience