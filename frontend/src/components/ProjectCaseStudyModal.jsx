import { useMemo } from 'react'

function deriveNarrative(project) {
  const stack = project.tech_stack || []
  return [
    `Built around ${stack.slice(0, 3).join(', ') || 'a focused stack'} with a delivery-first structure.`,
    `Primary emphasis is on ${project.workstreams?.[0]?.name?.toLowerCase() || 'architecture'} and execution clarity.`,
    project.github_link ? 'Includes a linked implementation reference for deeper inspection.' : 'Structured as a portfolio case study without a linked public repository.',
  ]
}

function deriveCaseStudyBlocks(project) {
  const primaryStream = project.workstreams?.[0]?.name || 'Platform delivery'
  const secondaryStream = project.workstreams?.[1]?.name || 'Observability'
  return [
    {
      title: 'Problem',
      text: `Needed a clear, scalable implementation path with stronger reliability than a basic showcase build.`,
    },
    {
      title: 'Approach',
      text: `Structured execution around ${primaryStream.toLowerCase()} and ${secondaryStream.toLowerCase()} with measurable progress.`,
    },
    {
      title: 'Result',
      text: `Reached ${project.completion}% completion with reusable patterns that can be extended quickly.`,
    },
  ]
}

function ProjectCaseStudyModal({ project, onClose }) {
  const narrative = useMemo(() => (project ? deriveNarrative(project) : []), [project])
  const blocks = useMemo(() => (project ? deriveCaseStudyBlocks(project) : []), [project])

  if (!project) return null

  return (
    <div className="modal-overlay project-case-study-overlay" onClick={onClose}>
      <div className="modal-content project-case-study-modal" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span className="eyebrow">Case study</span>
            <h2>{project.title}</h2>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body project-case-study-body">
          <section className="project-case-study-hero">
            <div className="project-case-study-summary">
              <p>{project.description}</p>
              <div className="project-tech">
                {(project.tech_stack || []).map((tech) => (
                  <span key={`${project.id}-${tech}`} className="tech-badge">{tech}</span>
                ))}
              </div>
            </div>
            <div className="project-case-study-stats">
              <article className="project-case-study-stat">
                <strong>{project.completion}%</strong>
                <span>Completion</span>
              </article>
              <article className="project-case-study-stat">
                <strong>{project.workstreams?.length || 0}</strong>
                <span>Workstreams</span>
              </article>
              <article className="project-case-study-stat">
                <strong>{project.tech_stack?.length || 0}</strong>
                <span>Core tools</span>
              </article>
            </div>
          </section>

          <section className="project-case-study-grid">
            <article className="project-case-study-panel">
              <span className="eyebrow">Story</span>
              <h3>What this project is doing</h3>
              <div className="detail-list">
                {narrative.map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </div>
            </article>

            <article className="project-case-study-panel">
              <span className="eyebrow">Delivery map</span>
              <h3>Workstreams</h3>
              <div className="project-workstreams">
                {(project.workstreams || []).map((stream) => (
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
            </article>
          </section>

          <section className="project-case-study-grid">
            {blocks.map((block) => (
              <article key={block.title} className="project-case-study-panel">
                <span className="eyebrow">{block.title}</span>
                <p>{block.text}</p>
              </article>
            ))}
          </section>

          <section className="project-case-study-actions">
            {project.github_link ? (
              <a href={project.github_link} target="_blank" rel="noreferrer" className="btn btn-primary">
                Open GitHub
              </a>
            ) : null}
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Close case study
            </button>
          </section>
        </div>
      </div>
    </div>
  )
}

export default ProjectCaseStudyModal
