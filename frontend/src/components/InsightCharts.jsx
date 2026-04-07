function CircularDial({ value, label, detail }) {
  const safeValue = Math.max(0, Math.min(100, value))
  const radius = 42
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (safeValue / 100) * circumference

  return (
    <article className="chart-card glass-orb-card">
      <div className="chart-visual">
        <svg viewBox="0 0 120 120" className="chart-ring" aria-hidden="true">
          <circle cx="60" cy="60" r={radius} className="chart-ring-track" />
          <circle
            cx="60"
            cy="60"
            r={radius}
            className="chart-ring-progress"
            style={{ strokeDasharray: circumference, strokeDashoffset: offset }}
          />
        </svg>
        <strong>{safeValue}%</strong>
      </div>
      <div className="chart-copy">
        <span className="eyebrow">Telemetry</span>
        <h3>{label}</h3>
        <p>{detail}</p>
      </div>
    </article>
  )
}

function HorizontalGraph({ title, items }) {
  return (
    <article className="chart-card graph-card">
      <div className="section-header">
        <span className="eyebrow">Graph view</span>
        <h3>{title}</h3>
      </div>
      <div className="graph-list">
        {items.map((item) => (
          <div key={item.label} className="graph-row">
            <div className="graph-row-meta">
              <strong>{item.label}</strong>
              <span>{item.value}%</span>
            </div>
            <div className="graph-bar">
              <span style={{ width: `${item.value}%` }} />
            </div>
          </div>
        ))}
      </div>
    </article>
  )
}

function MicroBarChart({ title, items }) {
  return (
    <article className="chart-card micro-bar-card">
      <div className="section-header">
        <span className="eyebrow">Comparison</span>
        <h3>{title}</h3>
      </div>
      <div className="micro-bar-grid">
        {items.map((item) => (
          <div key={item.label} className="micro-bar-item">
            <div className="micro-bar-column">
              <span style={{ height: `${Math.max(item.value, 12)}%` }} />
            </div>
            <strong>{item.label}</strong>
            <small>{item.value}%</small>
          </div>
        ))}
      </div>
    </article>
  )
}

function PieChart({ title, items }) {
  const total = items.reduce((sum, item) => sum + item.value, 0) || 1
  const stops = items.reduce((acc, item) => {
    const previousEnd = acc.length > 0 ? acc[acc.length - 1].end : 0
    const nextEnd = previousEnd + (item.value / total) * 100
    return [...acc, { ...item, start: previousEnd, end: nextEnd }]
  }, [])

  const gradient = stops.map((item) => `${item.color} ${item.start}% ${item.end}%`).join(', ')

  return (
    <article className="chart-card pie-chart-card">
      <div className="section-header">
        <span className="eyebrow">Pie view</span>
        <h3>{title}</h3>
      </div>
      <div className="pie-chart-layout">
        <div className="pie-chart-visual" style={{ background: `conic-gradient(${gradient})` }}>
          <div className="pie-chart-hole">
            <strong>{Math.round(total / items.length)}%</strong>
            <small>avg</small>
          </div>
        </div>
        <div className="pie-chart-legend">
          {stops.map((item) => (
            <div key={item.label} className="pie-legend-row">
              <span className="pie-swatch" style={{ background: item.color }} />
              <strong>{item.label}</strong>
              <small>{item.value}%</small>
            </div>
          ))}
        </div>
      </div>
    </article>
  )
}

export function InsightChartStrip({ charts }) {
  return (
    <div className="chart-strip">
      {charts.map((chart) => (
        <CircularDial key={chart.title} value={chart.value} label={chart.title} detail={chart.detail} />
      ))}
    </div>
  )
}

export { HorizontalGraph, MicroBarChart, PieChart }
