import { useState } from 'react'
import { useSiteContent } from '../../context/useSiteContent'

function updateByPath(target, path, value) {
  if (path.length === 0) return value

  const [head, ...tail] = path
  const clone = Array.isArray(target) ? [...target] : { ...target }
  clone[head] = updateByPath(target[head], tail, value)
  return clone
}

function renderPrimitiveInput(value, onChange) {
  if (typeof value === 'boolean') {
    return <input type="checkbox" checked={value} onChange={(event) => onChange(event.target.checked)} />
  }

  if (typeof value === 'string' && (value.includes('\n') || value.length > 110)) {
    return <textarea rows="4" value={value} onChange={(event) => onChange(event.target.value)} />
  }

  return <input type="text" value={value ?? ''} onChange={(event) => onChange(event.target.value)} />
}

function looksLikeImageUrl(value) {
  return typeof value === 'string' && /^(https?:\/\/|\/).+\.(avif|gif|jpe?g|png|svg|webp)(\?.*)?$/i.test(value)
}

function ContentNodeEditor({ label, value, path, onChange }) {
  if (Array.isArray(value)) {
    const allPrimitive = value.every((item) => typeof item !== 'object' || item === null)
    return (
      <div className="content-node">
        <h4>{label}</h4>
        {allPrimitive ? (
          <textarea
            rows="6"
            value={JSON.stringify(value, null, 2)}
            onChange={(event) => {
              try {
                onChange(path, JSON.parse(event.target.value))
              } catch {
                // Let the user keep editing invalid JSON temporarily.
              }
            }}
          />
        ) : (
          value.map((item, index) => (
            <details key={`${label}-${index}`} className="accordion-card" open={index === 0}>
              <summary>{`${label} ${index + 1}`}</summary>
              <ContentNodeEditor
                label={`${label} ${index + 1}`}
                value={item}
                path={[...path, index]}
                onChange={onChange}
              />
            </details>
          ))
        )}
      </div>
    )
  }

  if (value && typeof value === 'object') {
    return (
      <div className="content-node">
        <h4>{label}</h4>
        <div className="content-grid">
          {Object.entries(value).map(([key, childValue]) => (
            <ContentNodeEditor
              key={key}
              label={key}
              value={childValue}
              path={[...path, key]}
              onChange={onChange}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="content-field">
      <label>{label}</label>
      {renderPrimitiveInput(value, (nextValue) => onChange(path, nextValue))}
      {looksLikeImageUrl(value) && (
        <div className="content-image-preview">
          <img src={value} alt={label} className="content-visual-image" />
        </div>
      )}
    </div>
  )
}

function ContentManager() {
  const { siteContent, setSiteContent, resetSiteContent } = useSiteContent()
  const [activeSection, setActiveSection] = useState('global')
  const [searchTerm, setSearchTerm] = useState('')
  const managerContent = siteContent.admin?.contentManager

  const sections = Object.keys(siteContent)
  const filteredSections = sections.filter((section) =>
    section.toLowerCase().includes(searchTerm.toLowerCase())
  )
  const resolvedSection = filteredSections.includes(activeSection)
    ? activeSection
    : filteredSections[0] ?? null

  const handlePathChange = (path, value) => {
    setSiteContent((current) => updateByPath(current, path, value))
  }

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(siteContent, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'portfolio-site-content.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    const text = await file.text()
    try {
      setSiteContent(JSON.parse(text))
    } catch {
      // Ignore invalid imports and keep the current content intact.
    }
    event.target.value = ''
  }

  return (
    <div className="content-manager">
      <div className="admin-section-header">
        <div>
          <span className="eyebrow">{managerContent?.eyebrow ?? 'Editable copy + images'}</span>
          <h2>{managerContent?.title ?? 'Content manager'}</h2>
          <p>{managerContent?.description ?? 'Edit page text, labels, links, arrays, and image URLs in one place.'}</p>
        </div>
        <div className="admin-toolbar">
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder={siteContent.admin?.searchPlaceholder ?? 'Search content'}
          />
          <div className="inline-actions">
            <label className="btn btn-secondary btn-sm">
              Import JSON
              <input type="file" accept="application/json" hidden onChange={handleImport} />
            </label>
            <button type="button" className="btn btn-secondary btn-sm" onClick={handleExport}>
              Export JSON
            </button>
          </div>
          <button type="button" className="btn btn-secondary" onClick={resetSiteContent}>
            {managerContent?.resetLabel ?? 'Reset content defaults'}
          </button>
        </div>
      </div>

      <div className="content-meta-strip">
        <span className="metric-pill">
          {(managerContent?.sectionLabel ?? 'Content sections')}: {filteredSections.length}
        </span>
        <span className="metric-pill">Persistent local editing</span>
        <span className="metric-pill">Image preview enabled</span>
      </div>

      <div className="picker-row wrap">
        {filteredSections.map((section) => (
          <button
            key={section}
            type="button"
            className={`picker-chip ${activeSection === section ? 'is-active' : ''}`}
            onClick={() => setActiveSection(section)}
          >
            {section}
          </button>
        ))}
      </div>

      <div className="content-editor-surface">
        {resolvedSection ? (
          <div className="content-workspace-grid">
            <aside className="content-workspace-panel">
              <span className="eyebrow">Current section</span>
              <h3>{resolvedSection}</h3>
              <p>Use the search bar, chips, and nested editors to move through the content model with less friction.</p>
              <div className="detail-list">
                <p>Text fields support quick inline editing.</p>
                <p>Large blocks automatically switch to textareas.</p>
                <p>Image URLs show previews for safer updates.</p>
              </div>
            </aside>
            <div className="content-workspace-panel">
              <ContentNodeEditor
                label={resolvedSection}
                value={siteContent[resolvedSection]}
                path={[resolvedSection]}
                onChange={handlePathChange}
              />
            </div>
          </div>
        ) : (
          <p>No matching section found.</p>
        )}
      </div>
    </div>
  )
}

export default ContentManager
