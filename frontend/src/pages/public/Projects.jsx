import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchProjects } from '../../utils/api'

function Projects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProjects = async () => {
      const data = await fetchProjects()
      setProjects(data)
      setLoading(false)
    }
    loadProjects()
  }, [])

  if (loading) {
    return <div>Loading projects...</div>
  }

  return (
    <div>
      <h1>Projects</h1>
      <p>Here are some things I've built.</p>

      {projects.map((project) => (
        <div key={project.id}>
          <h2>{project.title}</h2>
          <p>{project.description}</p>
          <p>
            <strong>Tech Stack:</strong> {project.tech_stack?.join(', ')}
          </p>
          {project.github_link && (
            <p>
              <a href={project.github_link} target="_blank" rel="noopener noreferrer">
                GitHub →
              </a>
            </p>
          )}
          <hr />
        </div>
      ))}

      <div>
        <p>
          <Link to="/skills">View my skills</Link> |{' '}
          <Link to="/experience">See my experience</Link>
        </p>
      </div>
    </div>
  )
}

export default Projects