import { Link } from 'react-router-dom'
import { HorizontalGraph, InsightChartStrip, MicroBarChart } from '../../components/InsightCharts'
import { useSiteContent } from '../../context/useSiteContent'

function DevOpsLab() {
  const { siteContent } = useSiteContent()
  const content = siteContent.devopsLabPage
  const heroCard = content.heroCard || {}

  const chartData = content.tools.map((tool) => ({
    title: tool.name,
    value: tool.completion,
    detail: tool.detail,
  }))

  return (
    <div className="page-shell devops-shell">
      <section className="container page-hero" data-reveal="up">
        <span className="eyebrow">{content.eyebrow}</span>
        <h1 data-echo="OBSERVE • AUTOMATE • SHIP">{content.title}</h1>
        <p className="page-lead">{content.lead}</p>
      </section>

      <section className="container page-section" data-reveal="scale">
        <div className="dashboard-strip">
          {content.heroStats.map((stat) => (
            <article key={stat.label} className="widget-card cloud-stat-card">
              <span className="eyebrow">{stat.label}</span>
              <strong>{stat.value}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="container page-section" data-reveal="up">
        <InsightChartStrip charts={chartData.slice(0, 3)} />
      </section>

      <section className="container page-section devops-grid-zone">
        <article className="bento-card bento-card-large devops-hero-card" data-reveal="left">
          <span className="eyebrow">{heroCard.eyebrow || 'Stack focus'}</span>
          <h2>{heroCard.title || 'AWS, Prometheus, Grafana, CI/CD, and reliability patterns woven into one visual system.'}</h2>
          <p>{heroCard.text || 'This page is designed like a cloud operations wall, with more telemetry, richer cards, and a clearer relationship between delivery, monitoring, and platform engineering.'}</p>
        </article>

        <HorizontalGraph
          title="Tool completion"
          items={content.tools.map((tool) => ({ label: tool.name, value: tool.completion }))}
        />

        <MicroBarChart
          title="Operational spread"
          items={content.tools.map((tool) => ({ label: tool.name, value: tool.completion }))}
        />
      </section>

      <section className="container page-section" data-reveal="up">
        <div className="feature-grid">
          {content.pillars.map((pillar) => (
            <article key={pillar.title} className="feature-card devops-feature-card">
              <h3>{pillar.title}</h3>
              <p>{pillar.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container page-section" data-reveal="scale">
        <div className="services-cloud-grid">
          {content.services.map((service, index) => (
            <article key={service} className={`rail-card service-cloud-card service-cloud-card-${(index % 6) + 1}`}>
              <span className="eyebrow">Capability</span>
              <strong>{service}</strong>
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

export default DevOpsLab
