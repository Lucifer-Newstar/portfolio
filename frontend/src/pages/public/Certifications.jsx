import { lazy, Suspense, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchCertifications } from '../../utils/api'
import { useSiteContent } from '../../context/useSiteContent'

const LinkedDataModal = lazy(() => import('../../components/LinkedDataModal'))

function Certifications() {
  const { siteContent } = useSiteContent()
  const content = siteContent.certificationsPage
  const [certifications, setCertifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState({ type: '', id: '', name: '' })

  useEffect(() => {
    const loadCertifications = async () => {
      const data = await fetchCertifications()
      setCertifications(data)
      setLoading(false)
    }
    loadCertifications()
  }, [])

  const handleSkillClick = (skillName) => {
    setSelectedItem({
      type: 'skill',
      id: skillName.toLowerCase().replace(/\s/g, '-'),
      name: skillName
    })
    setModalOpen(true)
  }

  if (loading) {
    return <div className="container text-center mt-4">Loading certifications...</div>
  }

  return (
    <div className="page-shell certifications-shell">
      <section className="container page-hero" data-reveal="up">
        <span className="eyebrow">{content.eyebrow}</span>
        <h1>{content.title}</h1>
        <p className="page-lead">{content.lead}</p>
      </section>

      <section className="container page-section" data-reveal="up">
        <div className="horizontal-rail">
          {certifications.slice(0, 6).map((cert) => (
            <article key={cert.id} className="rail-card">
              <span className="eyebrow">{cert.issuer}</span>
              <h3>{cert.name}</h3>
              <p>{cert.date}</p>
              {cert.link && (
                <a href={cert.link} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm">
                  Verify credential
                </a>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="container page-section" data-reveal="scale">
        <div className="cert-orbit-grid">
          {certifications.slice(0, 3).map((cert, index) => (
            <article key={`${cert.id}-orbit`} className={`cert-orbit-card cert-orbit-card-${index + 1}`}>
              <span className="eyebrow">Issuer</span>
              <h3>{cert.issuer}</h3>
              <p>{cert.name}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container page-section">
        <div className="certs-grid">
          {certifications.map((cert, index) => (
            <article key={cert.id} className="cert-card" data-reveal={index % 2 === 0 ? 'scale' : 'up'}>
              <div className="project-card-top">
                <span className="eyebrow">Credential</span>
                <span className="metric-pill">{cert.issuer}</span>
              </div>
              <h3>{cert.name}</h3>
              <p className="muted-line">{cert.date}</p>
              <div className="tag-cloud">
                {cert.skills?.map((skill, idx) => (
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
              {cert.link && (
                <a href={cert.link} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm cert-link">
                  View credential
                </a>
              )}
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

export default Certifications
