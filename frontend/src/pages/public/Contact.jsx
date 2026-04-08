import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSiteContent } from '../../context/useSiteContent'
import { submitContactForm } from '../../utils/api'

function Contact() {
  const { siteContent } = useSiteContent()
  const content = siteContent.contact
  const [activeReason, setActiveReason] = useState(content.reasons[0])
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [submitState, setSubmitState] = useState('idle')
  const [submitMessage, setSubmitMessage] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitState('submitting')
    setSubmitMessage('')

    try {
      await submitContactForm({
        name: form.name,
        email: form.email,
        reason: activeReason,
        message: form.message,
      })
      setSubmitState('success')
      setSubmitMessage('Message sent successfully. I will get this in my inbox.')
      setForm({ name: '', email: '', message: '' })
    } catch (error) {
      setSubmitState('error')
      setSubmitMessage(error.message || 'Unable to send message right now.')
    }
  }

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
        
        <form className="contact-form" data-reveal="right" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{content.form.nameLabel}</label>
            <input
              type="text"
              placeholder={content.form.namePlaceholder}
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              required
            />
          </div>
          <div className="form-group">
            <label>{content.form.emailLabel}</label>
            <input
              type="email"
              placeholder={content.form.emailPlaceholder}
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              required
            />
          </div>
          <div className="form-group">
            <label>{content.form.reasonLabel}</label>
            <input type="text" value={activeReason} readOnly />
          </div>
          <div className="form-group">
            <label>{content.form.messageLabel}</label>
            <textarea
              rows="5"
              placeholder={content.form.messagePlaceholder}
              value={form.message}
              onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={submitState === 'submitting'}>
            {submitState === 'submitting' ? 'Sending...' : content.form.submitLabel}
          </button>
          {submitMessage ? (
            <p className={submitState === 'error' ? 'contact-submit-error' : 'contact-submit-success'}>
              {submitMessage}
            </p>
          ) : null}
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
