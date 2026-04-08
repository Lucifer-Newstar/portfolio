import { lazy, Suspense, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchProjects } from '../../utils/api'
import { HorizontalGraph, MicroBarChart, PieChart } from '../../components/InsightCharts'
import { useSiteContent } from '../../context/useSiteContent'
import { deriveProjectInsights } from '../../utils/portfolioInsights'

const LinkedDataModal = lazy(() => import('../../components/LinkedDataModal'))
const ProjectCaseStudyModal = lazy(() => import('../../components/ProjectCaseStudyModal'))

function Projects() {
  const { siteContent } = useSiteContent()
  const content = siteContent.projectsPage
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState({ type: '', id: '', name: '' })
  const [selectedProject, setSelectedProject] = useState(null)
  const [activeTech, setActiveTech] = useState('All')

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

  const handleProjectOpen = (project) => {
    setSelectedProject(project)
  }

  if (loading) {
    return <div className="container text-center mt-4">Loading projects...</div>
  }

  const insights = deriveProjectInsights(projects)
  const techOptions = ['All', ...new Set(insights.projects.flatMap((project) => project.tech_stack || []))]
  const visibleProjects = activeTech === 'All'
    ? insights.projects
    : insights.projects.filter((project) => project.tech_stack?.includes(activeTech))
  const featuredProjects = visibleProjects.slice(0, 4)

  return (
    <div className="page-shell projects-shell">
      <section className="container page-hero" data-reveal="up">
        <span className="eyebrow">{content.eyebrow}</span>
        <h1 data-echo="MICRO EXPERIENCES">{content.title}</h1>
        <p className="page-lead">{content.lead}</p>
        {content.heroImage && <img src={content.heroImage} alt={content.title} className="page-hero-image" />}
      </section>

      <section className="container page-section" data-reveal="scale">
        <div className="picker-row wrap">
          {techOptions.map((tech) => (
            <button
              key={tech}
              type="button"
              className={`picker-chip ${activeTech === tech ? 'is-active' : ''}`}
              onClick={() => setActiveTech(tech)}
            >
              {tech}
            </button>
          ))}
        </div>
      </section>

      <section className="container page-section" data-reveal="up">
        <div className="horizontal-rail projects-rail">
          {featuredProjects.map((project, index) => (
            <article key={project.id} className={`rail-card project-rail-card project-rail-card-${index + 1}`}>
              <span className="eyebrow">Featured</span>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <span className="metric-pill">{project.completion}% complete</span>
              <div className="project-tech">
                {project.tech_stack?.slice(0, 4).map((tech, idx) => (
                  <button key={idx} type="button" className="tech-badge clickable" onClick={() => handleTechClick(tech)}>
                    {tech}
                  </button>
                ))}
              </div>
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => handleProjectOpen(project)}>
                Open case study
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="container page-section" data-reveal="scale">
        <div className="homepage-graph-zone">
          <HorizontalGraph
            title="Project completion"
            items={visibleProjects.slice(0, 5).map((project) => ({ label: project.title.slice(0, 14), value: project.completion }))}
          />
          <MicroBarChart
            title="Track density"
            items={insights.tracks.slice(0, 5).map((track) => ({ label: track.track.slice(0, 10), value: track.completion }))}
          />
        </div>
      </section>

      <section className="container page-section" data-reveal="scale">
        <PieChart
          title="Featured project split"
          items={featuredProjects.map((project, index) => ({
            label: project.title.slice(0, 12),
            value: project.completion,
            color: ['#69e2ff', '#9c7cff', '#ff647c', '#2ce5a4'][index % 4]
          }))}
        />
      </section>

      <section className="container page-section">
        <div className="projects-bento-intro" data-reveal="up">
          <article className="bento-card bento-card-large liquid-stage-card">
            <span className="eyebrow">Bento lab</span>
            <h2>Each project becomes a modular micro-experience.</h2>
            <p>
              Tiles scale, shift, and layer like a living case-study wall instead of a flat gallery. Hover and scroll
              are part of the storytelling now.
            </p>
          </article>
          <article className="bento-card liquid-stage-card">
            <span className="eyebrow">Motion</span>
            <strong>Physics-inspired momentum</strong>
            <p>Cards lean into spatial depth, stronger contrast, and smoother directional movement.</p>
          </article>
        </div>
      </section>

      <section className="container page-section">
        <div className="projects-bento-grid">
          {visibleProjects.map((project, index) => (
            <article
              key={project.id}
              className={`project-card card project-bento-tile tile-${(index % 6) + 1}`}
              data-reveal={index % 3 === 0 ? 'left' : index % 3 === 1 ? 'up' : 'scale'}
              data-project-tile="true"
            >
              <div className="liquid-layer liquid-layer-top" />
              <div className="liquid-layer liquid-layer-bottom" />
              <div className="project-content">
                <div className="project-card-top">
                  <span className="eyebrow">Project</span>
                  <span className="metric-pill">{project.tech_stack?.length || 0} tools · {project.completion}%</span>
                </div>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="project-micro-stats">
                  <span className="metric-pill">Case study</span>
                  <span className="metric-pill">{index % 2 === 0 ? 'Interactive' : 'Systems'}</span>
                </div>
                <div className="project-workstreams">
                  {project.workstreams.map((stream) => (
                    <div key={`${project.id}-${stream.name}`} className="graph-row compact-graph-row">
                      <div className="graph-row-meta">
                        <strong>{stream.name}</strong>
                        <span>{stream.completion}%</span>
                      </div>
                      <div className="graph-bar">
                        <span style={{ width: `${stream.completion}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="project-tech">
                  {project.tech_stack?.map((tech, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className="tech-badge clickable"
                      onClick={() => handleTechClick(tech)}
                    >
                      {tech}
                    </button>
                  ))}
                </div>
                <div className="project-links">
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => handleProjectOpen(project)}
                  >
                    Case study
                  </button>
                  {project.github_link && (
                    <a href={project.github_link} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm">
                      Open GitHub
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="container page-section inline-actions" data-reveal="up">
        {content.actions.map((action) => (
          <Link key={action.href} to={action.href} className={action.primary ? 'btn btn-primary' : 'btn btn-secondary'}>
            {action.label}
          </Link>
        ))}
      </section>

      <Suspense fallback={null}>
        <LinkedDataModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          itemType={selectedItem.type}
          itemId={selectedItem.id}
          itemName={selectedItem.name}
        />
        <ProjectCaseStudyModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      </Suspense>
    </div>
  )
}

export default Projects
