import LuciferSectionNav from './LuciferSectionNav'

function LuciferPageFrame({
  eyebrow,
  title,
  lead,
  sections = [],
  heroVisual = null,
  metrics = [],
  children,
  className = '',
}) {
  return (
    <div className={`private-page-shell lucifer-page-frame ${className}`.trim()}>
      <section className="private-hero lucifer-page-hero">
        <div className="lucifer-hero-copy">
          <span className="eyebrow">{eyebrow}</span>
          <h2>{title}</h2>
          <p>{lead}</p>
        </div>
        {heroVisual ? <div className="lucifer-page-hero-visual">{heroVisual}</div> : null}
      </section>

      {metrics.length ? (
        <section className="private-card-grid lucifer-metric-grid">
          {metrics.map((metric) => (
            <article key={metric.label} className="private-card lucifer-metric-card">
              <strong>{metric.value}</strong>
              <span>{metric.label}</span>
              {metric.note ? <small>{metric.note}</small> : null}
            </article>
          ))}
        </section>
      ) : null}

      <LuciferSectionNav items={sections} />
      {children}
    </div>
  )
}

export default LuciferPageFrame
