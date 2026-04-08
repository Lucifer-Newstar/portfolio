import { Link } from 'react-router-dom'
import { useSiteContent } from '../../context/useSiteContent'

function About() {
  const { siteContent } = useSiteContent()
  const about = siteContent.about
  const notes = about.notesBoard?.length
    ? about.notesBoard
    : [
        { eyebrow: 'Working note', text: 'Complex systems are easier to trust when the interface feels calm, tactile, and legible.' },
        { eyebrow: 'Portfolio intent', text: 'This page leans more like an annotated studio board than a standard about page.' }
      ]
  const principles = about.principles?.length
    ? about.principles
    : [
        { eyebrow: 'Principle 01', title: 'Readable systems', text: 'Interfaces should explain the platform instead of hiding it behind noise.' },
        { eyebrow: 'Principle 02', title: 'Deliberate motion', text: 'Animation should guide attention, not distract from meaning.' },
        { eyebrow: 'Principle 03', title: 'Operational empathy', text: 'Good cloud and DevOps work reduces stress for the people running it every day.' }
      ]

  return (
    <div className="page-shell about-shell">
      <section className="container page-hero" data-reveal="up">
        <span className="eyebrow">{about.eyebrow}</span>
        <h1>{about.title}</h1>
        <p className="page-lead">{about.lead}</p>
      </section>

      <section className="container page-section">
        <div className="bento-layout" data-reveal="scale">
          <article className="bento-card bento-card-large">
            <span className="eyebrow">{about.profileEyebrow}</span>
            <h3>{about.profileTitle}</h3>
            <p>{about.profileText}</p>
          </article>
          <article className="bento-card">
            <span className="eyebrow">{about.northStarEyebrow}</span>
            <p>{about.northStarText}</p>
          </article>
          <article className="bento-card">
            <span className="eyebrow">{about.themesEyebrow}</span>
            <div className="tag-cloud">
              {about.themes.map((theme) => (
                <span key={theme} className="skill-tag">{theme}</span>
              ))}
            </div>
          </article>
          {about.visualImage && (
            <article className="bento-card bento-card-large">
              <img src={about.visualImage} alt={about.title} className="content-visual-image" />
            </article>
          )}
        </div>
      </section>

      <section className="container page-section" data-reveal="left">
        <div className="section-header">
          <span className="eyebrow">{about.journey.eyebrow}</span>
          <h2>{about.journey.title}</h2>
        </div>
        <div className="stepper">
          {about.journey.steps.map((step, index) => (
            <article key={step} className="step-card">
              <span className="step-index">{`0${index + 1}`}</span>
              <p>{step}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container page-section" data-reveal="up">
        <div className="section-header">
          <span className="eyebrow">{about.approach.eyebrow}</span>
          <h2>{about.approach.title}</h2>
        </div>
        <div className="accordion-list">
          {about.approach.items.map((item, index) => (
            <details key={item.title} className="accordion-card" open={index === 0}>
              <summary>{item.title}</summary>
              <p>{item.body}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="container page-section" data-reveal="scale">
        <div className="about-notes-board">
          {notes.map((note, index) => (
            <article key={`${note.eyebrow}-${index}`} className="widget-card sketch-note-card">
              <span className="eyebrow">{note.eyebrow}</span>
              <p>{note.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container page-section" data-reveal="up">
        <div className="principle-grid">
          {principles.map((principle, index) => (
            <article key={`${principle.title}-${index}`} className="principle-card">
              <span className="eyebrow">{principle.eyebrow}</span>
              <h3>{principle.title}</h3>
              <p>{principle.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container page-section inline-actions" data-reveal="up">
        {about.actions.map((action) => (
          <Link
            key={action.href}
            to={action.href}
            className={action.primary ? 'btn btn-primary' : 'btn btn-secondary'}
          >
            {action.label}
          </Link>
        ))}
      </section>
    </div>
  )
}

export default About
