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

  const previewUrl = useMemo(() => {
    const suffix = previewMode === 'draft' ? '?admin-preview=draft' : ''
    return `${selectedPath}${suffix}`
  }, [previewMode, selectedPath])

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
            <p>Use the open button if you want the selected page in a full tab.</p>
          </div>

          <a className="btn btn-secondary" href={previewUrl} target="_blank" rel="noreferrer">
            Open selected page
          </a>
        </aside>

        <section className="admin-preview-stage admin-panel">
          <div className="admin-preview-stage-header">
            <div>
              <span className="eyebrow">Live frame</span>
              <h3>{PREVIEW_ROUTES.find((route) => route.path === selectedPath)?.label}</h3>
            </div>
            <span className="metric-pill">{previewMode === 'draft' ? 'Draft mode' : 'Saved mode'}</span>
          </div>

          <div className="admin-preview-frame-shell">
            <iframe
              key={previewUrl}
              title="Portfolio preview"
              src={previewUrl}
              className="admin-preview-frame"
            />
          </div>
        </section>
      </div>
    </div>
  )
}

export default PreviewManager
