import { useState } from 'react'
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

  const tabs = adminContent.tabs.map((tab) => ({
    ...tab,
    component:
      tab.id === 'content' ? ContentManager
      : tab.id === 'skills' ? SkillsManager
      : tab.id === 'projects' ? ProjectsManager
      : tab.id === 'experience' ? ExperienceManager
      : tab.id === 'certifications' ? CertificationsManager
      : tab.id === 'posts' ? PostsManager
      : undefined
  }))

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component
  const activeMeta = tabs.find((tab) => tab.id === activeTab)

  return (
    <div className="container admin-dashboard">
      <section className="admin-hero admin-panel">
        <div>
          <span className="eyebrow">{adminContent.eyebrow}</span>
          <h1>{adminContent.title}</h1>
          <p className="page-lead">{adminContent.lead}</p>
        </div>
        <div className="admin-hero-actions">
          <a href="/" className="btn btn-secondary">{adminContent.openSiteLabel}</a>
          <button onClick={handleLogout} className="btn btn-primary">{adminContent.logoutLabel}</button>
        </div>
      </section>

      <section className="admin-layout">
        <aside className="admin-sidebar admin-panel">
          <div className="admin-stat-grid">
            {adminContent.stats.map((stat) => (
              <article key={stat.label} className="admin-stat-card">
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </article>
            ))}
          </div>

          <div className="admin-tab-list">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`admin-tab ${activeTab === tab.id ? 'is-active' : ''}`}
              >
                <strong>{tab.name}</strong>
                <span>{tab.description}</span>
              </button>
            ))}
          </div>
        </aside>

        <section className="admin-main admin-panel">
          <div className="admin-section-header">
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
                    ? 'Use search, section chips, import/export, and previews to keep large content edits manageable.'
                    : 'This workspace is laid out as a wider editing surface so forms, tables, and actions feel less cramped.'}
                </p>
              </article>
            </div>
          </div>

          {activeTab === 'overview' ? (
            <div className="admin-overview">
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
                      ? 'Dark mode organizes the dashboard like a softer operations console with glow, grouping, and stronger state focus.'
                      : 'Light mode presents the dashboard like a premium studio workspace with framed cards, offset surfaces, and warmer scanability.'}
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
            <div className="admin-manager admin-manager-surface">
              {ActiveComponent && <ActiveComponent />}
            </div>
          )}
        </section>
      </section>
    </div>
  )
}

export default AdminDashboard
