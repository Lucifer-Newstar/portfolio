import { lazy, Suspense, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchExperience } from '../../utils/api'
import { useSiteContent } from '../../context/useSiteContent'

const LinkedDataModal = lazy(() => import('../../components/LinkedDataModal'))

function Experience() {
  const { siteContent } = useSiteContent()
  const content = siteContent.experiencePage
  const [experiences, setExperiences] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState({ type: '', id: '', name: '' })

  useEffect(() => {
    const loadExperience = async () => {
      const data = await fetchExperience()
      setExperiences(data)
      setLoading(false)
    }
    loadExperience()
  }, [])

  const handleSkillClick = (skillName) => {
    setSelectedItem({
      type: 'skill',
      id: skillName.toLowerCase().replace(/\s/g, '-'),
      name: skillName
    })
    setModalOpen(true)
  }

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
    <div className="page-shell experience-shell">
      <section className="container page-hero" data-reveal="up">
        <span className="eyebrow">{content.eyebrow}</span>
        <h1>{content.title}</h1>
        <p className="page-lead">{content.lead}</p>
      </section>

      <section className="container page-section" data-reveal="scale">
        <div className="dashboard-strip">
          <article className="widget-card"><strong>{experiences.length}</strong><span>{content.stats[0].value}</span></article>
          <article className="widget-card"><strong>{content.stats[1].value}</strong><span>{content.stats[1].label}</span></article>
          <article className="widget-card"><strong>{content.stats[2].value}</strong><span>{content.stats[2].label}</span></article>
        </div>
      </section>

      <section className="container page-section" data-reveal="up">
        <div className="experience-signal-grid">
          {experiences.slice(0, 3).map((exp, index) => (
            <article key={exp.id} className="experience-signal-card">
              <span className="eyebrow">Track 0{index + 1}</span>
              <h3>{exp.title}</h3>
              <p>{exp.organization}</p>
              <span className="metric-pill">{exp.period}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="container page-section">
        <div className="timeline">
          {experiences.map((exp, index) => (
            <article key={exp.id} className="timeline-card" data-reveal={index % 2 === 0 ? 'left' : 'right'}>
              <div className="timeline-marker" />
              <div className="timeline-card-header">
                <div>
                  <span className="eyebrow">{exp.period}</span>
                  <h3>{exp.title}</h3>
                  <p className="muted-line">{exp.organization} · {exp.location}</p>
                </div>
                <span className="metric-pill">{exp.skills?.length || 0} skills</span>
              </div>

              <details className="accordion-card experience-accordion" open={index === 0}>
                <summary>Expand responsibilities</summary>
                <ul className="detail-list">
                  {parseDescription(exp.description).map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </details>

              <div className="tag-cloud">
                {exp.skills?.map((skill, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="skill-tag clickable"
                    onClick={() => handleSkillClick(skill)}
                  >
                    {skill}
                  </button>
                ))}
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
      </Suspense>
    </div>
  )
}

export default Experience
