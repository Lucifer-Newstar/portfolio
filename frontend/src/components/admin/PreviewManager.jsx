import { useMemo, useState } from 'react'
import { useSiteContent } from '../../context/useSiteContent'

const PREVIEW_ROUTES = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Experience', path: '/experience' },
  { label: 'Skills', path: '/skills' },
  { label: 'Projects', path: '/projects' },
  { label: 'DevOps Lab', path: '/devops-lab' },
  { label: 'Certifications', path: '/certifications' },
  { label: 'Feed', path: '/posts' },
  { label: 'Contact', path: '/contact' },
]

function PreviewManager() {
  const { hasUnsavedChanges } = useSiteContent()
  const [selectedPath, setSelectedPath] = useState('/')
  const [previewMode, setPreviewMode] = useState('draft')
  const [previewLayout, setPreviewLayout] = useState('split')

  const buildPreviewUrl = (theme) => {
    const params = new URLSearchParams()
    if (previewMode === 'draft') params.set('admin-preview', 'draft')
    if (theme) params.set('theme', theme)
    const query = params.toString()
    return `${selectedPath}${query ? `?${query}` : ''}`
  }

  const singlePreviewUrl = useMemo(() => buildPreviewUrl('light'), [previewMode, selectedPath])
  const lightPreviewUrl = useMemo(() => buildPreviewUrl('light'), [previewMode, selectedPath])
  const darkPreviewUrl = useMemo(() => buildPreviewUrl('dark'), [previewMode, selectedPath])

  return (
    <div className="admin-preview-page">
      <div className="admin-preview-shell">
        <aside className="admin-preview-sidebar admin-panel">
          <span className="eyebrow">Preview workspace</span>
          <h2>Public-site preview</h2>
          <p>Switch between saved content and your current draft, then review each page without leaving the dashboard.</p>

          <div className="content-meta-strip">
            <span className="metric-pill">{hasUnsavedChanges ? 'Unsaved draft available' : 'Draft is saved'}</span>
            <span className="metric-pill">Separate preview section</span>
          </div>

          <div className="admin-preview-mode-switch" role="tablist" aria-label="Preview mode">
            <button
              type="button"
              className={`picker-chip ${previewMode === 'draft' ? 'is-active' : ''}`}
              onClick={() => setPreviewMode('draft')}
            >
              Draft preview
            </button>
            <button
              type="button"
              className={`picker-chip ${previewMode === 'saved' ? 'is-active' : ''}`}
              onClick={() => setPreviewMode('saved')}
            >
              Saved preview
            </button>
          </div>

          <div className="admin-preview-mode-switch" role="tablist" aria-label="Preview layout">
            <button
              type="button"
              className={`picker-chip ${previewLayout === 'split' ? 'is-active' : ''}`}
              onClick={() => setPreviewLayout('split')}
            >
              Light + dark
            </button>
            <button
              type="button"
              className={`picker-chip ${previewLayout === 'single' ? 'is-active' : ''}`}
              onClick={() => setPreviewLayout('single')}
            >
              Single frame
            </button>
          </div>

          <div className="picker-row wrap">
            {PREVIEW_ROUTES.map((route) => (
              <button
                key={route.path}
                type="button"
                className={`picker-chip ${selectedPath === route.path ? 'is-active' : ''}`}
                onClick={() => setSelectedPath(route.path)}
              >
                {route.label}
              </button>
            ))}
          </div>

          <div className="detail-list">
            <p>Draft preview reads the current unsaved editor state.</p>
            <p>Saved preview shows what the public site will load normally.</p>
            <p>Light + dark view lets you compare both themes side by side.</p>
          </div>

          <a className="btn btn-secondary" href={singlePreviewUrl} target="_blank" rel="noreferrer">
            Open selected page
          </a>
        </aside>

        <section className="admin-preview-stage admin-panel">
          <div className="admin-preview-stage-header">
            <div>
              <span className="eyebrow">Live frame</span>
              <h3>{PREVIEW_ROUTES.find((route) => route.path === selectedPath)?.label}</h3>
            </div>
            <div className="admin-ribbon-metrics">
              <span className="metric-pill">{previewMode === 'draft' ? 'Draft mode' : 'Saved mode'}</span>
              <span className="metric-pill">{previewLayout === 'split' ? 'Side-by-side themes' : 'Single frame'}</span>
            </div>
          </div>

          {previewLayout === 'split' ? (
            <div className="admin-preview-compare-grid">
              <div className="admin-preview-frame-shell">
                <div className="admin-preview-frame-meta">
                  <span className="eyebrow">Theme</span>
                  <strong>Light</strong>
                </div>
                <iframe
                  key={lightPreviewUrl}
                  title="Portfolio light preview"
                  src={lightPreviewUrl}
                  className="admin-preview-frame"
                />
              </div>
              <div className="admin-preview-frame-shell">
                <div className="admin-preview-frame-meta">
                  <span className="eyebrow">Theme</span>
                  <strong>Dark</strong>
                </div>
                <iframe
                  key={darkPreviewUrl}
                  title="Portfolio dark preview"
                  src={darkPreviewUrl}
                  className="admin-preview-frame"
                />
              </div>
            </div>
          ) : (
            <div className="admin-preview-frame-shell">
              <iframe
                key={singlePreviewUrl}
                title="Portfolio preview"
                src={singlePreviewUrl}
                className="admin-preview-frame"
              />
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default PreviewManager
