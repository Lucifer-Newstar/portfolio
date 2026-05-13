import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { useLucifer } from '../../context/useLucifer'
import { clearAdminSession } from '../../utils/adminAuth'
import ThemeToggle from '../ThemeToggle'

const EDIT_LINKS = [
  { to: '/lucifer-newstar_dashboard/edit', label: 'Edit Mode', detail: 'Full editorial CMS for public content.' },
]

const LUCIFER_LINKS = [
  { to: '/lucifer-newstar_dashboard/lucifer', label: 'Dashboard', detail: 'Streaks, quick stats, and activity snapshots.' },
  { to: '/lucifer-newstar_dashboard/lucifer/skills', label: 'Skills', detail: 'Shared skills with private progress overlays.' },
  { to: '/lucifer-newstar_dashboard/lucifer/projects', label: 'Projects', detail: 'Portfolio projects plus private delivery notes.' },
  { to: '/lucifer-newstar_dashboard/lucifer/posts', label: 'Posts', detail: 'Shared posts with private context and quick logs.' },
  { to: '/lucifer-newstar_dashboard/lucifer/learning', label: 'Learning', detail: 'Logs, certifications, notes, and resources.' },
  { to: '/lucifer-newstar_dashboard/lucifer/workouts', label: 'Workouts', detail: 'Exercise logs, PRs, and body tracking.' },
  { to: '/lucifer-newstar_dashboard/lucifer/hobbies', label: 'Hobbies', detail: 'Manual-first reading, anime, movies, TV, and goals.' },
]

function WorkspaceNavGroup({ title, items }) {
  return (
    <section className="private-nav-group">
      <span className="eyebrow">{title}</span>
      <div className="private-nav-stack">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/lucifer-newstar_dashboard/edit' || item.to === '/lucifer-newstar_dashboard/lucifer'}
            className={({ isActive }) => `private-nav-link ${isActive ? 'is-active' : ''}`}
          >
            <strong>{item.label}</strong>
            <span>{item.detail}</span>
          </NavLink>
        ))}
      </div>
    </section>
  )
}

function PrivateWorkspace() {
  const location = useLocation()
  const [exploreState, setExploreState] = useState({ isOpen: false, pathname: '' })
  const { summary } = useLucifer()
  const privateMode = location.pathname.includes('/lucifer-newstar_dashboard/edit')
    ? 'edit'
    : location.pathname.includes('/lucifer-newstar_dashboard/lucifer')
      ? 'lucifer'
      : 'home'
  const isExploreOpen = exploreState.isOpen && exploreState.pathname === location.pathname
  const activeLuciferLink = useMemo(() => (
    LUCIFER_LINKS.find((item) => item.to === location.pathname)
    || LUCIFER_LINKS.find((item) => location.pathname.startsWith(item.to))
    || LUCIFER_LINKS[0]
  ), [location.pathname])

  useEffect(() => {
    document.body.setAttribute('data-private-mode', privateMode)

    return () => {
      document.body.removeAttribute('data-private-mode')
    }
  }, [privateMode])

  useEffect(() => {
    const active = privateMode === 'lucifer' && isExploreOpen
    document.body.classList.toggle('lucifer-explore-active', active)

    return () => {
      document.body.classList.remove('lucifer-explore-active')
    }
  }, [isExploreOpen, privateMode])

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setExploreState((current) => ({ ...current, isOpen: false }))
      }
    }

    window.addEventListener('keydown', handleEscape)

    return () => {
      window.removeEventListener('keydown', handleEscape)
    }
  }, [])

  if (privateMode === 'edit') {
    return (
      <div className={`admin-shell private-workspace private-workspace--${privateMode}`}>
        <div className="admin-shell-backdrop" aria-hidden="true">
          <span className="admin-shell-orb admin-shell-orb-1" />
          <span className="admin-shell-orb admin-shell-orb-2" />
          <span className="admin-shell-gridline" />
        </div>

        <div className="edit-shell">
          <header className="edit-shell-topbar admin-shell-panel">
            <div className="edit-shell-topbar-copy">
              <span className="eyebrow">Edit mode</span>
              <h1>Spacious editing workspace</h1>
              <p>The editor stays front and center here so you can work through long content changes without the navigation squeezing the form.</p>
            </div>

            <div className="edit-shell-topbar-actions">
              <div className="edit-shell-theme-toggle" aria-label="Theme control">
                <ThemeToggle />
              </div>
              <NavLink to="/lucifer-newstar_dashboard" end className="btn btn-secondary">
                Private home
              </NavLink>
              <NavLink to="/lucifer-newstar_dashboard/lucifer" className="btn btn-secondary">
                Lucifer mode
              </NavLink>
              <a href="/" className="btn btn-secondary">Public site</a>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  clearAdminSession()
                  window.location.href = '/'
                }}
              >
                Logout
              </button>
            </div>
          </header>

          <section className="edit-shell-stage admin-shell-panel">
            <Outlet />
          </section>
        </div>
      </div>
    )
  }

  if (privateMode === 'lucifer') {
    return (
      <div className={`admin-shell private-workspace private-workspace--${privateMode}`}>
        <div className="admin-shell-backdrop" aria-hidden="true">
          <span className="admin-shell-orb admin-shell-orb-1" />
          <span className="admin-shell-orb admin-shell-orb-2" />
          <span className="admin-shell-gridline" />
          <span className="private-workspace-flare private-workspace-flare-a" />
          <span className="private-workspace-flare private-workspace-flare-b" />
          <span className="private-workspace-noise" />
        </div>

        <div className="lucifer-shell">
          <header className="lucifer-topbar admin-shell-panel">
            <div className="lucifer-topbar-brand">
              <span className="eyebrow">Lucifer mode</span>
              <h1>Private operating system</h1>
              <p>Cleaner top navigation, focused subpages, and richer private tracking without touching Edit Mode.</p>
            </div>

            <div className="lucifer-topbar-actions">
              <div className="lucifer-theme-toggle-slot" aria-label="Theme control">
                <ThemeToggle />
              </div>

              <div className={`lucifer-explore ${isExploreOpen ? 'is-open' : ''}`}>
                <button
                  type="button"
                  className={`lucifer-explore-trigger nav-explore-toggle ${isExploreOpen ? 'is-open' : ''}`}
                  onClick={() => setExploreState((current) => ({
                    isOpen: current.pathname === location.pathname ? !current.isOpen : true,
                    pathname: location.pathname,
                  }))}
                  aria-expanded={isExploreOpen}
                  aria-haspopup="true"
                >
                  <span>Explore</span>
                  <strong>{activeLuciferLink.label}</strong>
                </button>
              </div>

              <NavLink to="/lucifer-newstar_dashboard" end className="btn btn-secondary">
                Private home
              </NavLink>
              <NavLink to="/lucifer-newstar_dashboard/edit" className="btn btn-secondary">
                Edit Mode
              </NavLink>
              <a href="/" className="btn btn-secondary">Public site</a>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  clearAdminSession()
                  window.location.href = '/'
                }}
              >
                Logout
              </button>
            </div>

            <div className="lucifer-topbar-metrics">
              <article className="private-mini-card">
                <strong>{summary.currentStreak}</strong>
                <span>Learning streak</span>
              </article>
              <article className="private-mini-card">
                <strong>{summary.weeklySummary.workouts}</strong>
                <span>Workouts this week</span>
              </article>
              <article className="private-mini-card">
                <strong>{summary.quickStats.hobbiesTracked}</strong>
                <span>Tracked hobbies</span>
              </article>
              <article className="private-mini-card">
                <strong>{summary.quickStats.totalProjects}</strong>
                <span>Shared projects</span>
              </article>
            </div>
          </header>

          <section className="lucifer-main-stage admin-shell-panel">
            <Outlet />
          </section>
        </div>

        <div className={`lucifer-explore-layer ${isExploreOpen ? 'is-open' : ''}`}>
          <button
            type="button"
            className="lucifer-explore-backdrop"
            aria-label="Close Lucifer explore navigation"
            onClick={() => setExploreState((current) => ({ ...current, isOpen: false }))}
          />
          <div className="lucifer-board-menu">
            <NavLink
              to="/lucifer-newstar_dashboard/lucifer"
              end
              className="lucifer-board-home"
              onClick={() => setExploreState((current) => ({ ...current, isOpen: false }))}
            >
              Dashboard
            </NavLink>

            <div className="lucifer-board-core">
              <span className="lucifer-board-pulse lucifer-board-pulse-1" />
              <span className="lucifer-board-pulse lucifer-board-pulse-2" />
              <span className="eyebrow">Explore Lucifer</span>
              <strong>Choose a route inside the private operating system.</strong>
            </div>

            {LUCIFER_LINKS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/lucifer-newstar_dashboard/lucifer'}
                className={({ isActive }) => `lucifer-board-link ${isActive ? 'is-active' : ''}`}
                onClick={() => setExploreState((current) => ({ ...current, isOpen: false }))}
              >
                <strong>{item.label}</strong>
                <span>{item.detail}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`admin-shell private-workspace private-workspace--${privateMode}`}>
      <div className="admin-shell-backdrop" aria-hidden="true">
        <span className="admin-shell-orb admin-shell-orb-1" />
        <span className="admin-shell-orb admin-shell-orb-2" />
        <span className="admin-shell-gridline" />
        <span className="private-workspace-flare private-workspace-flare-a" />
        <span className="private-workspace-flare private-workspace-flare-b" />
        <span className="private-workspace-noise" />
      </div>

      <div className="admin-shell-grid">
        <aside className="admin-shell-sidebar admin-shell-panel">
          <div className="admin-shell-sidebar-top">
            <span className="eyebrow">Private workspace</span>
            <h1>Lucifer Control Room</h1>
            <p>
              Keep the public editor stable, then switch into the private operating system for progress,
              learning, workouts, and faster daily updates.
            </p>
          </div>

          <div className="private-nav-summary">
            <article className="private-mini-card">
              <strong>{summary.currentStreak}</strong>
              <span>Current learning streak</span>
            </article>
            <article className="private-mini-card">
              <strong>{summary.quickStats.totalSkills}</strong>
              <span>Shared skills tracked</span>
            </article>
            <article className="private-mini-card">
              <strong>{summary.weeklySummary.workouts}</strong>
              <span>Workouts this week</span>
            </article>
          </div>

          <WorkspaceNavGroup title="Modes" items={EDIT_LINKS} />
          <WorkspaceNavGroup title="Lucifer Mode" items={LUCIFER_LINKS} />

          <div className="admin-shell-actions">
            <NavLink to="/lucifer-newstar_dashboard" end className="btn btn-secondary">
              Private home
            </NavLink>
            <a href="/" className="btn btn-secondary">Public site</a>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                clearAdminSession()
                window.location.href = '/'
              }}
            >
              Logout
            </button>
          </div>
        </aside>

        <section className="admin-shell-main admin-shell-panel">
          <Outlet />
        </section>
      </div>
    </div>
  )
}

export default PrivateWorkspace
