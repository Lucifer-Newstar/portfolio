import { useEffect, useMemo, useState } from 'react'
import { fetchAdminOpsInsights, fetchOpsSummary } from '../utils/api'

function formatNumber(value) {
  if (typeof value !== 'number' || Number.isNaN(value)) return '--'
  return new Intl.NumberFormat().format(Math.round(value))
}

function formatDateTime(value) {
  if (!value) return 'Just now'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Just now'
  return date.toLocaleString()
}

function formatRelative(value) {
  if (!value) return 'moments ago'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'moments ago'
  const diffMs = date.getTime() - Date.now()
  const formatter = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' })
  const minutes = Math.round(diffMs / 60000)
  if (Math.abs(minutes) < 60) return formatter.format(minutes, 'minute')
  const hours = Math.round(minutes / 60)
  if (Math.abs(hours) < 24) return formatter.format(hours, 'hour')
  const days = Math.round(hours / 24)
  return formatter.format(days, 'day')
}

function fallbackSummary() {
  return {
    live: false,
    generatedAt: new Date().toISOString(),
    cloudWatch: {
      lambdaInvocations24h: 0,
      lambdaErrors24h: 0,
      apiLatencyMs: 0,
      api5xx24h: 0,
      lambdaBreakdown: [],
    },
    analytics: {
      requestVolume24h: 0,
      requestVolume7d: 0,
      estimatedVisitors24h: null,
      apiCalls24h: 0,
      note: 'Live analytics will appear once the observability summary endpoint is available.',
    },
    status: [],
  }
}

function fallbackAdminSummary() {
  return {
    ...fallbackSummary(),
    deployHistory: [],
    logs: [],
  }
}

function normalizeText(value) {
  return String(value || '').toLowerCase()
}

function matchesQuery(query, values) {
  if (!query) return true
  return values.some((value) => normalizeText(value).includes(query))
}

function getMetricCards(summary) {
  const cloudWatch = summary?.cloudWatch || {}
  const analytics = summary?.analytics || {}

  return [
    {
      label: 'Lambda invocations',
      value: formatNumber(cloudWatch.lambdaInvocations24h),
      detail: 'Rolling last 24 hours',
      tone: 'primary',
    },
    {
      label: 'API latency',
      value: cloudWatch.apiLatencyMs ? `${formatNumber(cloudWatch.apiLatencyMs)} ms` : '--',
      detail: 'Average gateway response time',
      tone: 'secondary',
    },
    {
      label: 'Error rate',
      value: cloudWatch.lambdaInvocations24h
        ? `${((cloudWatch.lambdaErrors24h / cloudWatch.lambdaInvocations24h) * 100).toFixed(2)}%`
        : '0%',
      detail: `${formatNumber(cloudWatch.lambdaErrors24h)} lambda errors and ${formatNumber(cloudWatch.api5xx24h)} API 5xx`,
      tone: 'danger',
    },
    {
      label: 'Page requests',
      value: formatNumber(analytics.requestVolume24h),
      detail: analytics.estimatedVisitors24h
        ? `${formatNumber(analytics.estimatedVisitors24h)} estimated visitors`
        : analytics.note || 'CloudFront request volume',
      tone: 'accent',
    },
  ]
}

function HealthChip({ status }) {
  return (
    <span className={`ops-health-chip is-${status?.status || 'unknown'}`}>
      {status?.statusLabel || status?.status || 'Unknown'}
    </span>
  )
}

function MetricCard({ item }) {
  return (
    <article className={`ops-metric-card tone-${item.tone}`}>
      <span className="eyebrow">{item.label}</span>
      <strong>{item.value}</strong>
      <p>{item.detail}</p>
    </article>
  )
}

function StatusGrid({ items }) {
  return (
    <div className="ops-status-grid">
      {items.map((item) => (
        <article key={item.id || item.name} className="ops-status-card">
          <div className="ops-status-head">
            <div>
              <span className="eyebrow">{item.label}</span>
              <h3>{item.name}</h3>
            </div>
            <HealthChip status={item} />
          </div>
          <p>{item.detail}</p>
          <div className="ops-status-meta">
            <span>{item.latencyMs ? `${formatNumber(item.latencyMs)} ms probe` : 'Probe pending'}</span>
            {item.href ? (
              <a href={item.href} target="_blank" rel="noreferrer">
                Open target
              </a>
            ) : (
              <span>Internal service</span>
            )}
          </div>
        </article>
      ))}
    </div>
  )
}

function BreakdownPanel({ items }) {
  const maxValue = Math.max(...items.map((item) => item.invocations || 0), 1)

  return (
    <article className="ops-panel ops-breakdown-panel">
      <div className="ops-panel-heading">
        <div>
          <span className="eyebrow">CloudWatch metrics</span>
          <h3>Lambda activity lanes</h3>
        </div>
        <span className="ops-panel-tag">Last 24h</span>
      </div>
      <div className="ops-breakdown-list">
        {items.length ? items.map((item) => (
          <div key={item.name} className="ops-breakdown-row">
            <div className="ops-breakdown-copy">
              <strong>{item.name}</strong>
              <span>{formatNumber(item.invocations)} invokes • {formatNumber(item.errors)} errors</span>
            </div>
            <div className="ops-breakdown-bar">
              <span style={{ width: `${Math.max(10, ((item.invocations || 0) / maxValue) * 100)}%` }} />
            </div>
          </div>
        )) : (
          <p className="ops-empty-state">No Lambda metric data available yet.</p>
        )}
      </div>
    </article>
  )
}

function AnalyticsPanel({ analytics }) {
  return (
    <article className="ops-panel ops-analytics-panel">
      <div className="ops-panel-heading">
        <div>
          <span className="eyebrow">Site analytics</span>
          <h3>Traffic and request shape</h3>
        </div>
        <span className="ops-panel-tag">CloudFront + API</span>
      </div>
      <div className="ops-analytics-grid">
        <div className="ops-analytics-block">
          <small>24h requests</small>
          <strong>{formatNumber(analytics.requestVolume24h)}</strong>
        </div>
        <div className="ops-analytics-block">
          <small>7d requests</small>
          <strong>{formatNumber(analytics.requestVolume7d)}</strong>
        </div>
        <div className="ops-analytics-block">
          <small>API calls 24h</small>
          <strong>{formatNumber(analytics.apiCalls24h)}</strong>
        </div>
        <div className="ops-analytics-block">
          <small>Visitor estimate</small>
          <strong>{analytics.estimatedVisitors24h == null ? '--' : formatNumber(analytics.estimatedVisitors24h)}</strong>
        </div>
      </div>
      <p>{analytics.note || 'Request volume is sourced from cloud telemetry. Unique visitor estimation may require a dedicated analytics provider.'}</p>
    </article>
  )
}

function DeployHistoryPanel({ items }) {
  return (
    <article className="ops-panel ops-deploy-panel">
      <div className="ops-panel-heading">
        <div>
          <span className="eyebrow">Deploy history</span>
          <h3>Recent GitHub Actions runs</h3>
        </div>
        <span className="ops-panel-tag">Admin only</span>
      </div>
      <div className="ops-timeline">
        {items.length ? items.map((run) => (
          <a
            key={run.id}
            className={`ops-timeline-item is-${run.status || 'unknown'}`}
            href={run.url}
            target="_blank"
            rel="noreferrer"
          >
            <div className="ops-timeline-copy">
              <strong>{run.name}</strong>
              <span>{run.branch} • {formatRelative(run.createdAt)}</span>
            </div>
            <span className="ops-timeline-status">{run.statusLabel}</span>
          </a>
        )) : (
          <p className="ops-empty-state">No deploy runs available yet.</p>
        )}
      </div>
    </article>
  )
}

function LogViewerPanel({ items }) {
  return (
    <article className="ops-panel ops-log-panel">
      <div className="ops-panel-heading">
        <div>
          <span className="eyebrow">Log viewer</span>
          <h3>CloudWatch event stream</h3>
        </div>
        <span className="ops-panel-tag">Admin only</span>
      </div>
      <div className="ops-log-stream">
        {items.length ? items.map((item, index) => (
          <div key={`${item.timestamp}-${index}`} className="ops-log-line">
            <span>{formatDateTime(item.timestamp)}</span>
            <strong>{item.source}</strong>
            <p>{item.message}</p>
          </div>
        )) : (
          <p className="ops-empty-state">No recent logs available.</p>
        )}
      </div>
    </article>
  )
}

function LatestDeployPanel({ run }) {
  return (
    <article className="ops-panel ops-latest-deploy-panel">
      <div className="ops-panel-heading">
        <div>
          <span className="eyebrow">Deploy status</span>
          <h3>Latest deployment signal</h3>
        </div>
        <span className={`ops-panel-tag is-${run?.status || 'unknown'}`}>
          {run?.statusLabel || 'No runs'}
        </span>
      </div>
      {run ? (
        <div className="ops-latest-deploy-body">
          <div className="ops-latest-deploy-copy">
            <strong>{run.name}</strong>
            <p>{run.branch} branch • started {formatRelative(run.createdAt)}</p>
          </div>
          <a href={run.url} target="_blank" rel="noreferrer" className="btn btn-secondary">
            Open workflow run
          </a>
        </div>
      ) : (
        <p className="ops-empty-state">No deploy runs available yet.</p>
      )}
    </article>
  )
}

export function DevOpsTelemetryWall() {
  const [summary, setSummary] = useState(() => fallbackSummary())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      try {
        const result = await fetchOpsSummary()
        if (!cancelled) setSummary(result || fallbackSummary())
      } catch {
        if (!cancelled) setSummary(fallbackSummary())
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  const metricCards = useMemo(() => getMetricCards(summary), [summary])

  return (
    <section className="ops-wall-shell" data-reveal="up">
      <div className="ops-wall-heading">
        <div>
          <span className="eyebrow">Observability wall</span>
          <h2>Live telemetry, request patterns, and infrastructure health</h2>
        </div>
        <p>{loading ? 'Refreshing telemetry...' : `Last refreshed ${formatRelative(summary.generatedAt)}`}</p>
      </div>
      <div className="ops-metric-grid">
        {metricCards.map((item) => <MetricCard key={item.label} item={item} />)}
      </div>
      <div className="ops-grid-layout">
        <BreakdownPanel items={summary.cloudWatch?.lambdaBreakdown || []} />
        <AnalyticsPanel analytics={summary.analytics || fallbackSummary().analytics} />
      </div>
      <StatusGrid items={summary.status || []} />
    </section>
  )
}

export function AdminOpsInsightBoard({ searchable = false } = {}) {
  const [summary, setSummary] = useState(() => fallbackAdminSummary())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      try {
        const result = await fetchAdminOpsInsights()
        if (!cancelled) {
          setSummary(result || fallbackAdminSummary())
          setError('')
        }
      } catch (loadError) {
        if (!cancelled) {
          setSummary(fallbackAdminSummary())
          setError(loadError.message || 'Unable to load admin observability data.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  const metricCards = useMemo(() => getMetricCards(summary), [summary])
  const normalizedQuery = normalizeText(query.trim())
  const filteredDeployHistory = useMemo(
    () => (summary.deployHistory || []).filter((run) => matchesQuery(normalizedQuery, [
      run.name,
      run.branch,
      run.status,
      run.statusLabel,
    ])),
    [normalizedQuery, summary.deployHistory],
  )
  const filteredLogs = useMemo(
    () => (summary.logs || []).filter((item) => matchesQuery(normalizedQuery, [
      item.source,
      item.message,
      item.timestamp,
    ])),
    [normalizedQuery, summary.logs],
  )
  const filteredStatus = useMemo(
    () => (summary.status || []).filter((item) => matchesQuery(normalizedQuery, [
      item.name,
      item.label,
      item.status,
      item.statusLabel,
      item.detail,
    ])),
    [normalizedQuery, summary.status],
  )
  const latestDeploy = filteredDeployHistory[0] || summary.deployHistory?.[0] || null

  return (
    <section className="ops-admin-shell">
      <div className="ops-wall-heading is-admin">
        <div>
          <span className="eyebrow">Ops control feed</span>
          <h3>{loading ? 'Loading deploy and telemetry feed...' : 'Deploy status, logs, and service health'}</h3>
        </div>
        <div className="ops-admin-head-actions">
          {searchable ? (
            <label className="ops-search-shell">
              <span className="eyebrow">Search ops</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search deploys, logs, services..."
                className="ops-search-input"
              />
            </label>
          ) : null}
          <p>{summary.generatedAt ? `Updated ${formatRelative(summary.generatedAt)}` : 'Waiting for telemetry'}</p>
        </div>
      </div>
      {error ? <p className="contact-submit-error">{error}</p> : null}
      <div className="ops-metric-grid is-admin">
        {metricCards.map((item) => <MetricCard key={item.label} item={item} />)}
      </div>
      <LatestDeployPanel run={latestDeploy} />
      <div className="ops-grid-layout is-admin">
        <DeployHistoryPanel items={filteredDeployHistory} />
        <LogViewerPanel items={filteredLogs} />
      </div>
      <StatusGrid items={filteredStatus} />
    </section>
  )
}
