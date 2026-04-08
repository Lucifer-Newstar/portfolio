import { lazy, Suspense, useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { InsightChartStrip, MicroBarChart, PieChart } from '../../components/InsightCharts'
import DepthPrism from '../../components/DepthPrism'
import { useSiteContent } from '../../context/useSiteContent'
import { useTheme } from '../../context/useTheme'
import { fetchProjects, fetchSkills } from '../../utils/api'
import { buildHomepageSignals, deriveProjectInsights, deriveSkillInsights } from '../../utils/portfolioInsights'

const SceneOrb = lazy(() => import('../../components/SceneOrb'))

function Home() {
  const { siteContent } = useSiteContent()
  const { theme } = useTheme()
  const home = siteContent.home
  const resolvedPortraitImage = theme === 'dark'
    ? (home.portraitImageDark || home.portraitImage || home.heroImageDark || home.heroImage)
    : (home.portraitImageLight || home.portraitImage || home.heroImageLight || home.heroImage)
  const resolvedHeroImage = theme === 'dark'
    ? (home.heroImageDark || home.heroImage)
    : (home.heroImageLight || home.heroImage)
  const roles = useMemo(() => (home.roles?.length ? home.roles : ['Cloud Engineer']), [home.roles])
  const signalModes = useMemo(
    () => (home.signalModes?.length ? home.signalModes : [{ name: 'Platform', headline: 'Reliable systems.', detail: 'Modern cloud delivery with calmer operations.' }]),
    [home.signalModes]
  )
  const [currentRole, setCurrentRole] = useState(0)
  const [displayText, setDisplayText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [typingSpeed, setTypingSpeed] = useState(150)
  const [activeSignalName, setActiveSignalName] = useState(() => signalModes[0]?.name ?? '')
  const [skills, setSkills] = useState([])
  const [projects, setProjects] = useState([])
  const activeSignal = signalModes.find((mode) => mode.name === activeSignalName) ?? signalModes[0]
  const activeRoleLabel = roles[currentRole] || roles[0]
  const stickyPhases = home.stickyStory?.phases?.length
    ? home.stickyStory.phases
    : [
        { eyebrow: 'Phase 01', title: 'See the signal', text: 'Typography, particles, and telemetry introduce the portfolio like a live operating surface.' },
        { eyebrow: 'Phase 02', title: 'Read the systems', text: 'Charts, cards, and bento modules show how projects, cloud skills, and reliability thinking connect.' },
        { eyebrow: 'Phase 03', title: 'Choose the path', text: 'Navigation and action blocks turn the visual story into a practical way to explore work and capabilities.' }
      ]
  const skillInsights = useMemo(() => deriveSkillInsights(skills), [skills])
  const projectInsights = useMemo(() => deriveProjectInsights(projects), [projects])
  const homepageSignals = useMemo(() => buildHomepageSignals(skills, projects), [skills, projects])

  useEffect(() => {
    const handleTyping = () => {
      const fullText = roles[currentRole]

      if (isDeleting) {
        setDisplayText(fullText.substring(0, displayText.length - 1))
        setTypingSpeed(50)
      } else {
        setDisplayText(fullText.substring(0, displayText.length + 1))
        setTypingSpeed(150)
      }

      if (!isDeleting && displayText === fullText) {
        setIsDeleting(true)
        setTypingSpeed(2000)
      } else if (isDeleting && displayText === "") {
        setIsDeleting(false)
        setCurrentRole((currentRole + 1) % roles.length)
        setTypingSpeed(500)
      }
    }

    const timer = setTimeout(handleTyping, typingSpeed)
    return () => clearTimeout(timer)
  }, [displayText, isDeleting, currentRole, roles, typingSpeed])

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
      <section className="container hero-panel">
        <div className="hero-copy" data-reveal="up">
          <div className="hero-heading-grid">
            <div className="hero-heading-copy">
              <span className="eyebrow">{home.eyebrow}</span>
              <h1 className="hero-title" data-echo={home.titleEcho || home.title}>{home.title}</h1>
              <p className="hero-subtitle">
                {home.introPrefix}{' '}
                <span className="typed-text">{displayText}</span>
                <span className="cursor">|</span>
              </p>
              <p className="hero-description">{home.description}</p>
            </div>

            <div className="hero-portrait-shell" data-reveal="right">
              <div className={`hero-portrait-decor hero-portrait-decor-${theme}`}>
                {theme === 'light' ? (
                  <>
                    <span className="hero-royal-crown" aria-hidden="true">♕</span>
                    <span className="hero-royal-arc hero-royal-arc-1" aria-hidden="true" />
                    <span className="hero-royal-star hero-royal-star-1" aria-hidden="true">✦</span>
                    <span className="hero-royal-star hero-royal-star-2" aria-hidden="true">✦</span>
                    <span className="hero-royal-star hero-royal-star-3" aria-hidden="true">✦</span>
                    <span className="hero-royal-gem hero-royal-gem-1" aria-hidden="true" />
                    <span className="hero-royal-gem hero-royal-gem-2" aria-hidden="true" />
                    <span className="hero-royal-orbit hero-royal-orbit-1" aria-hidden="true" />
                    <span className="hero-royal-orbit hero-royal-orbit-2" aria-hidden="true" />
                  </>
                ) : (
                  <>
                    <span className="hero-signal-chip hero-signal-chip-1" aria-hidden="true">SYS</span>
                    <span className="hero-signal-chip hero-signal-chip-2" aria-hidden="true">LIVE</span>
                    <span className="hero-signal-node hero-signal-node-1" aria-hidden="true" />
                    <span className="hero-signal-node hero-signal-node-2" aria-hidden="true" />
                    <span className="hero-signal-node hero-signal-node-3" aria-hidden="true" />
                    <span className="hero-signal-ring hero-signal-ring-1" aria-hidden="true" />
                    <span className="hero-signal-ring hero-signal-ring-2" aria-hidden="true" />
                    <span className="hero-signal-ring hero-signal-ring-3" aria-hidden="true" />
                    <span className="hero-signal-beam hero-signal-beam-1" aria-hidden="true" />
                    <span className="hero-signal-beam hero-signal-beam-2" aria-hidden="true" />
                  </>
                )}
              </div>
              <div className="hero-portrait-card">
                <img
                  src={resolvedPortraitImage}
                  alt={home.portraitAlt || `${home.title} portrait`}
                  className="hero-portrait-image"
                />
                <div className="hero-portrait-badge">
                  <strong>{home.title}</strong>
                  <span>{activeRoleLabel}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="hero-buttons">
            <Link to={home.primaryCta.href} className="btn btn-primary">{home.primaryCta.label}</Link>
            <Link to={home.secondaryCta.href} className="btn btn-secondary">{home.secondaryCta.label}</Link>
          </div>
          {resolvedHeroImage && (
            <div className="hero-visual-card" data-reveal="right">
              <img src={resolvedHeroImage} alt={home.title} className="hero-visual-image" />
            </div>
          )}
          <div className="hero-depth-strip zoom-blur-panel" data-reveal="up" data-parallax="-18">
            <Suspense fallback={<div className="scene-orb scene-orb-fallback" />}>
              <SceneOrb />
            </Suspense>
            <div className="hero-depth-copy">
              <span className="eyebrow">3D signal object</span>
              <p>{theme === 'dark' ? 'A glowing control-core for the futuristic deck.' : 'A sculptural royal object for the editorial mode.'}</p>
              <DepthPrism label={theme === 'dark' ? 'Signal prism' : 'Royal prism'} tone={theme === 'dark' ? 'neon' : 'royal'} />
            </div>
          </div>
        </div>

        <div className="hero-bento zoom-blur-panel" data-reveal="scale" data-parallax="14">
          <article className="bento-card bento-card-large">
            <span className="eyebrow">Signal deck</span>
            <h3>{activeSignal.headline}</h3>
            <p>{activeSignal.detail}</p>
            <div className="picker-row">
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
          </article>

          <article className="bento-card">
            <span className="eyebrow">Quick look</span>
            <div className="stat-stack">
              {home.stats.map((stat) => (
                <div key={stat.label} className="stat-line">
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
          </article>

          <article className="bento-card bento-card-accent" data-parallax="35">
            <span className="eyebrow">Scrolling widget</span>
            <div className="ticker-rail">
              <div className="ticker-track">
                {home.focusCards.concat(home.focusCards).map((item, index) => (
                  <span key={`${item}-${index}`} className="ticker-pill">{item}</span>
                ))}
              </div>
            </div>
          </article>

          <article className="bento-card">
            <span className="eyebrow">Command menu</span>
            <div className="command-grid">
              {home.commandLinks.map((item) => (
                <Link key={item.href} to={item.href} className="command-tile">{item.label}</Link>
              ))}
            </div>
          </article>

          {theme === 'light' ? (
            <article className="light-royal-stage bento-card bento-card-large">
              <span className="eyebrow">{home.lightShowcase.eyebrow}</span>
              <div className="light-royal-grid">
                <div>
                  <h3>{home.lightShowcase.title}</h3>
                  <p>{home.lightShowcase.description}</p>
                </div>
                <div className="royal-note-stack">
                  {home.lightShowcase.notes.map((note) => (
                    <div key={note} className="royal-note-card">{note}</div>
                  ))}
                </div>
              </div>
            </article>
          ) : (
            <article className="dark-signal-stage bento-card bento-card-large">
              <span className="eyebrow">{home.darkShowcase.eyebrow}</span>
              <div className="dark-signal-grid">
                <div>
                  <h3>{home.darkShowcase.title}</h3>
                  <p>{home.darkShowcase.description}</p>
                </div>
                <div className="signal-panel-stack">
                  {home.darkShowcase.panels.map((panel) => (
                    <div key={panel.label} className="signal-panel">
                      <small>{panel.label}</small>
                      <strong>{panel.value}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          )}
        </div>
      </section>

      <section className="container kinetic-marquee-section" data-reveal="up">
        <div className="kinetic-marquee-track">
          {home.marquee.concat(home.marquee).map((item, index) => (
            <span key={`${item}-${index}`} className="kinetic-marquee-word">{item}</span>
          ))}
        </div>
      </section>

      <section className="container page-section" data-reveal="up">
        <InsightChartStrip charts={homepageSignals.charts} />
      </section>

      <section className="container page-section" data-reveal="scale">
        <div className="homepage-graph-zone">
          <MicroBarChart
            title="Top skill lanes"
            items={skillInsights.categories.slice(0, 4).map((item) => ({ label: item.category, value: item.completion }))}
          />
          <MicroBarChart
            title="Project delivery"
            items={projectInsights.featured.slice(0, 4).map((item) => ({ label: item.title.slice(0, 10), value: item.completion }))}
          />
        </div>
      </section>

      <section className="container page-section" data-reveal="scale">
        <div className="homepage-graph-zone">
          <PieChart
            title="Skill mix"
            items={skillInsights.categories.slice(0, 4).map((item, index) => ({
              label: item.category,
              value: item.completion,
              color: ['#ff8e5f', '#3456d1', '#d94d78', '#f3c357'][index % 4]
            }))}
          />
          <PieChart
            title="Project mix"
            items={projectInsights.featured.slice(0, 4).map((item, index) => ({
              label: item.title.slice(0, 12),
              value: item.completion,
              color: ['#69e2ff', '#9c7cff', '#ff647c', '#2ce5a4'][index % 4]
            }))}
          />
        </div>
      </section>

      <section className="container page-section scrolly-story-section" data-reveal="up">
        <div className="section-header">
          <span className="eyebrow">{home.storySection.eyebrow}</span>
          <h2>{home.storySection.title}</h2>
          <p>{home.storySection.description}</p>
        </div>
        <div className={`story-stage morph-scroll-stage ${theme === 'dark' ? 'story-stage-dark' : 'story-stage-light'}`}>
          <div className="story-stepper">
            {home.storySection.steps.map((step, index) => (
              <article key={step.title} className="step-card story-step-card">
                <span className="story-index">0{index + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
          <div className="text-visual-column">
            {home.textVisuals.map((visual) => (
              <article key={visual.label} className="text-visual-card">
                <strong>{visual.label}</strong>
                <span>{visual.caption}</span>
              </article>
            ))}
          </div>
          <div className="orbit-widget zoom-blur-panel" data-parallax="20">
            <div className="orbit-core">
              <span>System mood</span>
              <strong>{theme === 'dark' ? 'Future ready' : 'Royal craft'}</strong>
            </div>
            {home.orbitMetrics.map((metric, index) => (
              <div
                key={metric.label}
                className={`orbit-node orbit-node-${index + 1}`}
              >
                <small>{metric.label}</small>
                <strong>{metric.value}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container page-section sticky-story-shell" data-reveal="up">
        <div className="sticky-story-stage">
          {stickyPhases.map((phase, index) => (
            <article
              key={`${phase.eyebrow}-${index}`}
              className="sticky-story-card zoom-blur-panel"
              data-parallax={index === 0 ? '-14' : index === 1 ? '8' : '18'}
            >
              <span className="eyebrow">{phase.eyebrow}</span>
              <h3>{phase.title}</h3>
              <p>{phase.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container page-section" data-reveal="up">
        <div className="section-header">
          <span className="eyebrow">{home.featureSection.eyebrow}</span>
          <h2>{home.featureSection.title}</h2>
          <p>{home.featureSection.description}</p>
        </div>
        <div className="feature-grid">
          {home.featureSection.cards.map((card) => (
            <article key={card.title} className="feature-card">
              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container page-section home-cta-band" data-reveal="up">
        <article className="bento-card bento-card-large">
          <span className="eyebrow">{home.ctaBand.eyebrow}</span>
          <h2>{home.ctaBand.title}</h2>
          <p>{home.ctaBand.description}</p>
          <div className="hero-buttons">
            <Link to={home.ctaBand.primary.href} className="btn btn-primary">{home.ctaBand.primary.label}</Link>
            <Link to={home.ctaBand.secondary.href} className="btn btn-secondary">{home.ctaBand.secondary.label}</Link>
          </div>
        </article>
      </section>
    </div>
  )
}

export default Home
