import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import SkillsManager from '../../components/admin/SkillsManager'
import ProjectsManager from '../../components/admin/ProjectsManager'
import ExperienceManager from '../../components/admin/ExperienceManager'
import CertificationsManager from '../../components/admin/CertificationsManager'
import PostsManager from '../../components/admin/PostsManager'
import ContentManager from '../../components/admin/ContentManager'
import { useSiteContent } from '../../context/useSiteContent'
import { useTheme } from '../../context/useTheme'
import { clearAdminSession } from '../../utils/adminAuth'

function AdminDashboard() {
  const { siteContent } = useSiteContent()
  const { theme } = useTheme()
  const adminContent = siteContent.admin
  const [activeTab, setActiveTab] = useState('overview')

  const handleLogout = () => {
    clearAdminSession()
    window.location.href = '/'
  }

  const tabs = useMemo(() => adminContent.tabs.map((tab) => ({
    ...tab,
    component:
      tab.id === 'content' ? ContentManager
      : tab.id === 'skills' ? SkillsManager
      : tab.id === 'projects' ? ProjectsManager
      : tab.id === 'experience' ? ExperienceManager
      : tab.id === 'certifications' ? CertificationsManager
      : tab.id === 'posts' ? PostsManager
      : undefined
  })), [adminContent.tabs])

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component
  const activeMeta = tabs.find((tab) => tab.id === activeTab)

  return (
    <div className="admin-workspace-shell">
      <header className="admin-topbar admin-panel">
        <div className="admin-topbar-brand">
          <div>
            <span className="eyebrow">{adminContent.eyebrow}</span>
            <h1>{adminContent.title}</h1>
          </div>
          <p>{adminContent.lead}</p>
        </div>

        <nav className="admin-topbar-nav" aria-label="Admin sections">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`admin-tab admin-tab-pill ${activeTab === tab.id ? 'is-active' : ''}`}
            >
              <strong>{tab.name}</strong>
              <span>{tab.description}</span>
            </button>
          ))}
        </nav>

        <div className="admin-topbar-actions">
          <div className="admin-topbar-stats">
            {adminContent.stats.map((stat) => (
              <article key={stat.label} className="admin-stat-card">
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </article>
            ))}
          </div>
          <div className="admin-hero-actions">
            <Link to="/" className="btn btn-secondary">{adminContent.openSiteLabel}</Link>
            <button onClick={handleLogout} className="btn btn-primary">{adminContent.logoutLabel}</button>
          </div>
        </div>
      </header>

      <section className="admin-content-shell">
        <div className="admin-section-header admin-panel">
          <div className="admin-window-grid">
            <article className="admin-window-card">
              <span className="eyebrow">{adminContent.workspaceLabel}</span>
              <h2>{activeMeta?.name}</h2>
              <p>{activeMeta?.description}</p>
            </article>
            <article className="admin-window-card">
              <span className="eyebrow">Editing mode</span>
              <h3>{theme === 'dark' ? 'Focused control room' : 'Editorial workspace'}</h3>
              <p>
                {activeTab === 'content'
                  ? 'Use the wider content area to edit text, links, image URLs, and imports without the public-site chrome getting in your way.'
                  : 'This admin layout keeps navigation in the top bar so the full body stays dedicated to managing, creating, updating, and deleting content.'}
              </p>
            </article>
          </div>
        </div>

        {activeTab === 'overview' ? (
          <div className="admin-overview admin-main-content">
            <div className={`admin-preview-ribbon ${theme === 'dark' ? 'is-dark' : 'is-light'}`}>
              <div>
                <span className="eyebrow">{adminContent.previewTitle}</span>
                <h3>{theme === 'dark' ? 'Control deck online' : 'Studio board online'}</h3>
                <p>{adminContent.previewText}</p>
              </div>
              <div className="admin-ribbon-metrics">
                <span className="metric-pill">Theme: {theme}</span>
                <span className="metric-pill">Editable copy: enabled</span>
                <span className="metric-pill">Image URLs: enabled</span>
              </div>
            </div>

            <div className="admin-overview-grid">
              {adminContent.overview.cards.map((card) => (
                <article key={card.title} className="admin-stat-card">
                  <strong>{card.title}</strong>
                  <span>{card.text}</span>
                </article>
              ))}
            </div>

            <div className={`admin-comfort-board ${theme === 'dark' ? 'is-dark' : 'is-light'}`}>
              <article className="admin-stat-card">
                <strong>{adminContent.comfortTitle}</strong>
                <div className="detail-list">
                  {adminContent.comfortTips.map((tip) => (
                    <p key={tip}>{tip}</p>
                  ))}
                </div>
              </article>
              <article className="admin-stat-card">
                <strong>{theme === 'dark' ? 'Neon workflow' : 'Editorial workflow'}</strong>
                <span>
                  {theme === 'dark'
                    ? 'Dark mode organizes the dashboard like a softer operations console with grouped controls and clearer state focus.'
                    : 'Light mode presents the dashboard like a premium studio workspace with brighter sections and easier scanning.'}
                </span>
              </article>
            </div>

            <div className="admin-quick-actions">
              {adminContent.overview.actions.map((action) => (
                <button
                  key={action.tab}
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setActiveTab(action.tab)}
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <section className="admin-main-content admin-panel">
            <div className="admin-manager admin-manager-surface">
              {ActiveComponent && <ActiveComponent />}
            </div>
          </section>
        )}
      </section>
    </div>
  )
}

export default AdminDashboard
