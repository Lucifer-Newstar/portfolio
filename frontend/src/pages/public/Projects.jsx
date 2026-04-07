import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchProjects } from '../../utils/api'
import LinkedDataModal from '../../components/LinkedDataModal'

function Projects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState({ type: '', id: '', name: '' })

  useEffect(() => {
    const loadProjects = async () => {
      const data = await fetchProjects()
      setProjects(data)
      setLoading(false)
    }
    loadProjects()
  }, [])

  const handleTechClick = (techName) => {
    setSelectedItem({
      type: 'skill',
      id: techName.toLowerCase().replace(/\s/g, '-'),
      name: techName
    })
    setModalOpen(true)
  }

  if (loading) {
    return <div className="container text-center mt-4">Loading projects...</div>
  }

  return (
    <div className="container">
      <h1 className="text-center">Projects</h1>
      <p className="text-center">Click on any tech badge to see related skills and certifications.</p>
      
      <div className="projects-grid">
        {projects.map((project) => (
          <div key={project.id} className="project-card card">
            <div className="project-content">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <div className="project-tech">
                {project.tech_stack?.map((tech, idx) => (
                  <span 
                    key={idx} 
                    className="tech-badge clickable"
                    onClick={() => handleTechClick(tech)}
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <div className="project-links">
                {project.github_link && (
                  <a href={project.github_link} target="_blank" rel="noopener noreferrer">
                    GitHub →
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <hr className="mt-4" />
      
      <div className="text-center mt-3">
        <Link to="/skills" className="btn btn-secondary">View my skills</Link>
        {' '}
        <Link to="/experience" className="btn btn-secondary">See my experience</Link>
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

export default Projects