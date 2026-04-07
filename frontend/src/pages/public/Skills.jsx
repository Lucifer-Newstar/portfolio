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
    return <div className="container text-center mt-4">Loading skills...</div>
  }

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = []
    }
    acc[skill.category].push(skill)
    return acc
  }, {})

  return (
    <div className="container">
      <h1 className="text-center">Skills & Technologies</h1>
      <p className="text-center">Here's what I'm learning and building with.</p>
      
      <div className="skills-grid">
        {Object.entries(groupedSkills).map(([category, categorySkills]) => (
          <div key={category} className="skill-category">
            <h2>{category}</h2>
            <div className="skill-list">
              {categorySkills.map((skill) => (
                <span key={skill.id} className="skill-tag">
                  {skill.name} {skill.level !== 'Advanced' && `(${skill.level})`}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <hr className="mt-4" />
      
      <div className="text-center mt-3">
        <Link to="/projects" className="btn btn-secondary">Browse my projects</Link>
        {' '}
        <Link to="/experience" className="btn btn-secondary">See my experience</Link>
        {' '}
        <Link to="/certifications" className="btn btn-secondary">View certifications</Link>
      </div>
    </div>
  )
}

export default Skills