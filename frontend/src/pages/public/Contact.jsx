import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSiteContent } from '../../context/useSiteContent'

function Contact() {
  const { siteContent } = useSiteContent()
  const content = siteContent.contact
  const [activeReason, setActiveReason] = useState(content.reasons[0])

  return (
    <div className="page-shell contact-shell">
      <section className="container page-hero" data-reveal="up">
        <span className="eyebrow">{content.eyebrow}</span>
        <h1>{content.title}</h1>
        <p className="page-lead">{content.lead}</p>
      </section>

      <section className="container page-section" data-reveal="scale">
        <div className="picker-row wrap">
          {content.reasons.map((reason) => (
            <button
              key={reason}
              type="button"
              className={`picker-chip ${activeReason === reason ? 'is-active' : ''}`}
              onClick={() => setActiveReason(reason)}
            >
              {reason}
            </button>
          ))}
        </div>
      </section>

      <section className="container page-section contact-layout">
        <div className="contact-info" data-reveal="left">
          <article className="widget-card">
            <span className="eyebrow">{content.selectedReasonLabel}</span>
            <strong>{activeReason}</strong>
            <p>{content.selectedReasonText}</p>
          </article>
          {content.contacts.map((item) => (
            <a key={item.title} className="contact-detail" href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}>
              <span>{item.icon}</span>
              <strong>{item.title}</strong>
              <small>{item.value}</small>
            </a>
          ))}
        </div>
        
        <form className="contact-form" data-reveal="right">
          <div className="form-group">
            <label>{content.form.nameLabel}</label>
            <input type="text" placeholder={content.form.namePlaceholder} />
          </div>
          <div className="form-group">
            <label>{content.form.emailLabel}</label>
            <input type="email" placeholder={content.form.emailPlaceholder} />
          </div>
          <div className="form-group">
            <label>{content.form.reasonLabel}</label>
            <input type="text" value={activeReason} readOnly />
          </div>
          <div className="form-group">
            <label>{content.form.messageLabel}</label>
            <textarea rows="5" placeholder={content.form.messagePlaceholder} />
          </div>
          <button type="submit" className="btn btn-primary">{content.form.submitLabel}</button>
        </form>
      </section>

      <section className="container page-section" data-reveal="up">
        <div className="stepper">
          {content.steps.map((step, index) => (
            <article key={step} className="step-card">
              <span className="step-index">{`0${index + 1}`}</span>
              <p>{step}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container page-section" data-reveal="scale">
        <div className="contact-response-wall">
          {content.reasons.map((reason, index) => (
            <article key={reason} className={`widget-card response-chip-card response-chip-card-${(index % 4) + 1}`}>
              <span className="eyebrow">Path {`0${index + 1}`}</span>
              <strong>{reason}</strong>
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
    </div>
  )
}

export default Contact
