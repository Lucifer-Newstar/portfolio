import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { InsightChartStrip, MicroBarChart, PieChart } from '../../components/InsightCharts'
import { useSiteContent } from '../../context/useSiteContent'
import { useTheme } from '../../context/useTheme'
import { fetchProjects, fetchSkills } from '../../utils/api'
import { buildHomepageSignals, deriveProjectInsights, deriveSkillInsights } from '../../utils/portfolioInsights'

function HomeProfessional() {
  const { siteContent } = useSiteContent()
  const { theme } = useTheme()
  const home = siteContent.home
  const roles = useMemo(() => (home.roles?.length ? home.roles : ['Cloud Engineer']), [home.roles])
  const signalModes = useMemo(
    () => (
      home.signalModes?.length
        ? home.signalModes
        : [{ name: 'Platform', headline: 'Reliable systems.', detail: 'Modern cloud delivery with calmer operations.' }]
    ),
    [home.signalModes],
  )
  const [currentRole, setCurrentRole] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [typingSpeed, setTypingSpeed] = useState(150)
  const [activeSignalName, setActiveSignalName] = useState(() => signalModes[0]?.name ?? '')
  const [skills, setSkills] = useState([])
  const [projects, setProjects] = useState([])

  const activeSignal = signalModes.find((mode) => mode.name === activeSignalName) ?? signalModes[0]
  const activeRoleLabel = roles[currentRole] || roles[0]
  const roleText = roles[currentRole] || roles[0] || ''
  const prefersReducedMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const shouldAnimateRole = Boolean(roleText) && !prefersReducedMotion
  const resolvedPortraitImage = theme === 'dark'
    ? (home.portraitImageDark || home.portraitImage || home.heroImageDark || home.heroImage)
    : (home.portraitImageLight || home.portraitImage || home.heroImageLight || home.heroImage)
  const resolvedHeroImage = theme === 'dark'
    ? (home.heroImageDark || home.heroImage)
    : (home.heroImageLight || home.heroImage)
  const skillInsights = useMemo(() => deriveSkillInsights(skills), [skills])
  const projectInsights = useMemo(() => deriveProjectInsights(projects), [projects])
  const homepageSignals = useMemo(() => buildHomepageSignals(skills, projects), [skills, projects])
  const storySteps = home.storySection?.steps?.length ? home.storySection.steps : []
  const stickyPhases = home.stickyStory?.phases?.length ? home.stickyStory.phases : []
  const resumeSection = home.resumeSection || null

  useEffect(() => {
    if (!shouldAnimateRole) {
      return undefined
    }

    const handleTyping = () => {
      if (isDeleting) {
        setDisplayText(roleText.substring(0, displayText.length - 1))
        setTypingSpeed(50)
      } else {
        setDisplayText(roleText.substring(0, displayText.length + 1))
        setTypingSpeed(150)
      }

      if (!isDeleting && displayText === roleText) {
        setIsDeleting(true)
        setTypingSpeed(1800)
      } else if (isDeleting && displayText === '') {
        setIsDeleting(false)
        setCurrentRole((value) => (value + 1) % roles.length)
        setTypingSpeed(500)
      }
    }

    const timer = window.setTimeout(handleTyping, typingSpeed)

    return () => window.clearTimeout(timer)
  }, [currentRole, displayText, isDeleting, roleText, roles.length, shouldAnimateRole, typingSpeed])

  useEffect(() => {
    let mounted = true

    const loadInsights = async () => {
      const [skillData, projectData] = await Promise.all([fetchSkills(), fetchProjects()])
      if (!mounted) return
      setSkills(Array.isArray(skillData) ? skillData : [])
      setProjects(Array.isArray(projectData) ? projectData : [])
    }

    loadInsights()
    return () => {
      mounted = false
    }
  }, [])

  return (
    <div className="page-shell home-shell">
      <section className="container page-section">
        <div className="home-hero-professional">
          <div className="home-hero-copy">
            <span className="eyebrow">Cloud Engineer | DevOps | Reliability</span>
            <h1 className="hero-title">{home.title}</h1>
            <p className="hero-subtitle">
              {home.introPrefix} <span className="typed-text">{shouldAnimateRole ? displayText : roleText}</span><span className="cursor" aria-hidden="true">|</span>
            </p>
            <p className="hero-description">
              I build cloud platforms, delivery systems, and observability workflows that help
              teams ship faster with better operational clarity.
            </p>
            <div className="hero-buttons">
              <Link to={home.primaryCta.href} className="btn btn-primary">{home.primaryCta.label}</Link>
              <Link to={home.secondaryCta.href} className="btn btn-secondary">{home.secondaryCta.label}</Link>
            </div>
            <div className="home-role-pills">
              {roles.map((role) => (
                <span key={role} className={`home-role-pill ${role === activeRoleLabel ? 'is-active' : ''}`}>
                  {role}
                </span>
              ))}
            </div>
            <div className="home-stat-grid">
              {home.stats.map((stat) => (
                <article key={stat.label} className="home-stat-card">
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </article>
              ))}
            </div>
          </div>

          <aside className="home-hero-sidebar">
            <article className="home-profile-card">
              <div className="home-profile-media">
                <img
                  src={resolvedPortraitImage}
                  alt={home.portraitAlt || `${home.title} portrait`}
                  className="hero-portrait-image"
                />
              </div>
              <div className="home-profile-body">
                <span className="eyebrow">Professional focus</span>
                <h2>{activeSignal.headline}</h2>
                <p>{activeSignal.detail}</p>
                <div className="picker-row wrap">
                  {signalModes.map((mode) => (
                    <button
                      key={mode.name}
                      type="button"
                      className={`picker-chip ${activeSignal.name === mode.name ? 'is-active' : ''}`}
                      onClick={() => setActiveSignalName(mode.name)}
                    >
                      {mode.name}
                    </button>
                  ))}
                </div>
              </div>
            </article>

            {resolvedHeroImage && (
              <article className="home-visual-card">
                <img src={resolvedHeroImage} alt={`${home.title} work preview`} className="hero-visual-image" />
              </article>
            )}
          </aside>
        </div>
      </section>

      <section className="container page-section">
        <div className="home-section-block">
          <div className="section-header">
            <span className="eyebrow">Core strengths</span>
            <h2>Clear signals, reliable delivery, and practical cloud execution.</h2>
            <p>
              The homepage now leads with the professional story first: what you do,
              how you think, and where visitors should go next.
            </p>
          </div>
          <div className="home-focus-grid">
            {home.focusCards.map((item) => (
              <article key={item} className="home-focus-card">
                <h3>{item}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="container page-section">
        <InsightChartStrip charts={homepageSignals.charts} />
      </section>

      <section className="container page-section">
        <div className="home-section-block">
          <div className="section-header">
            <span className="eyebrow">Featured strengths</span>
            <h2>Practical engineering experience, presented with stronger structure.</h2>
            <p>
              The layout is intentionally calmer so visitors can focus on delivery, systems,
              and technical depth instead of novelty UI patterns.
            </p>
          </div>
          <div className="home-momentum-note">
            <div className="home-momentum-copy">
              <span className="eyebrow">Physics-inspired momentum</span>
              <h3>Subtle depth, cleaner motion, and calmer visual feedback.</h3>
              <p>
                Cards respond with measured lift, softer contrast shifts, and more grounded motion so
                the interface feels polished without crossing into something flashy or goofy.
              </p>
            </div>
          </div>
          <div className="home-grid-2">
            <MicroBarChart
              title="Top skill lanes"
              items={skillInsights.categories.slice(0, 4).map((item) => ({ label: item.category, value: item.completion }))}
            />
            <MicroBarChart
              title="Project delivery"
              items={projectInsights.featured.slice(0, 4).map((item) => ({ label: item.title.slice(0, 10), value: item.completion }))}
            />
          </div>
        </div>
      </section>

      <section className="container page-section">
        <div className="home-grid-2">
          <PieChart
            title="Skill mix"
            items={skillInsights.categories.slice(0, 4).map((item, index) => ({
              label: item.category,
              value: item.completion,
              color: ['#ff8e5f', '#3456d1', '#d94d78', '#f3c357'][index % 4],
            }))}
          />
          <PieChart
            title="Project mix"
            items={projectInsights.featured.slice(0, 4).map((item, index) => ({
              label: item.title.slice(0, 12),
              value: item.completion,
              color: ['#69e2ff', '#9c7cff', '#ff647c', '#2ce5a4'][index % 4],
            }))}
          />
        </div>
      </section>

      <section className="container page-section">
        <div className="home-section-block">
          <div className="section-header">
            <span className="eyebrow">{home.storySection.eyebrow || 'How I work'}</span>
            <h2>{home.storySection.title}</h2>
            <p>{home.storySection.description}</p>
          </div>
          <div className="home-process-grid">
            {storySteps.map((step, index) => (
              <article key={step.title} className="home-process-card">
                <span className="home-process-index">0{index + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="container page-section">
        <div className="home-grid-3">
          {stickyPhases.map((phase, index) => (
            <article key={`${phase.eyebrow}-${index}`} className="sticky-story-card">
              <span className="eyebrow">{phase.eyebrow}</span>
              <h3>{phase.title}</h3>
              <p>{phase.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container page-section">
        <div className="feature-grid">
          {home.featureSection.cards.map((card) => (
            <article key={card.title} className="feature-card">
              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </article>
          ))}
        </div>
      </section>

      {resumeSection?.href ? (
        <section className="container page-section">
          <div className="home-resume-button-row">
            <a
              href={resumeSection.href}
              className="btn btn-primary"
              download
              target="_blank"
              rel="noreferrer"
            >
              {resumeSection.label || 'Download resume'}
            </a>
          </div>
        </section>
      ) : null}

      <section className="container page-section home-cta-band">
        <article className="home-cta-card">
          <div className="home-cta-layout">
            <div className="home-cta-copy">
              <h2>{home.ctaBand.title}</h2>
              <p>{home.ctaBand.description}</p>
            </div>
            <div className="hero-buttons home-cta-actions">
              <Link to={home.ctaBand.primary.href} className="btn btn-primary">{home.ctaBand.primary.label}</Link>
              <Link to={home.ctaBand.secondary.href} className="btn btn-secondary">{home.ctaBand.secondary.label}</Link>
            </div>
          </div>
        </article>
      </section>
    </div>
  )
}

export default HomeProfessional
