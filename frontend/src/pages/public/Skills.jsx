import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchSkills } from '../../utils/api'

function Skills() {
  const [skills, setSkills] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadSkills = async () => {
      const data = await fetchSkills()
      setSkills(data)
      setLoading(false)
    }
    loadSkills()
  }, [])

  if (loading) {
    return <div>Loading skills...</div>
  }

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = []
    }
    acc[skill.category].push(skill)
    return acc
  }, {})

  return (
    <div>
      <h1>Skills & Technologies</h1>
      <p>Here's what I'm learning and building with.</p>

      {Object.entries(groupedSkills).map(([category, categorySkills]) => (
        <div key={category}>
          <h2>{category}</h2>
          <ul>
            {categorySkills.map((skill) => (
              <li key={skill.id}>
                {skill.name} {skill.level !== 'Advanced' && `(${skill.level})`}
              </li>
            ))}
          </ul>
        </div>
      ))}

      <hr />
      <div>
        <p>
          <Link to="/projects">Browse my projects</Link> |{' '}
          <Link to="/experience">See my experience</Link> |{' '}
          <Link to="/certifications">View certifications</Link>
        </p>
      </div>
    </div>
  )
}

export default Skills