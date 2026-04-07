import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'
import { useSiteContent } from '../context/useSiteContent'

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [exploreOpen, setExploreOpen] = useState(false)
  const { siteContent } = useSiteContent()
  const navContent = siteContent.global.nav
  const links = navContent.links || []

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <div className="navbar-brand-cluster">
          <Link to="/" className="navbar-brand">
            <span className="brand-mark">NJ</span>
            <span>
              <strong>{navContent.brandName}</strong>
              <small>{navContent.brandSubtitle}</small>
            </span>
          </Link>
          <div className="navbar-status">
            <span className="status-dot" />
            {navContent.statusText}
          </div>
        </div>

        <button
          type="button"
          className="navbar-toggle"
          aria-label="Toggle navigation"
          onClick={() => setMenuOpen((value) => !value)}
        >
          {menuOpen ? 'Close' : 'Menu'}
        </button>

        <div className={`navbar-controls ${menuOpen ? 'is-open' : ''}`}>
          <div className="navbar-actions">
            <button
              type="button"
              className={`nav-explore-toggle magnetic-surface ${exploreOpen ? 'is-open' : ''}`}
              onClick={() => setExploreOpen((value) => !value)}
            >
              Explore
            </button>
            <Link to="/contact" className="btn btn-primary btn-sm magnetic-surface" onClick={() => setMenuOpen(false)}>
              {navContent.ctaLabel}
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </div>

      <div className={`nav-explore-layer ${exploreOpen ? 'is-open' : ''}`}>
        <button
          type="button"
          className="nav-explore-backdrop"
          aria-label="Close explore navigation"
          onClick={() => setExploreOpen(false)}
        />
        <div className="nav-radial-menu">
          <div className="nav-radial-core">
            <span className="nav-radial-pulse nav-radial-pulse-1" />
            <span className="nav-radial-pulse nav-radial-pulse-2" />
            <span className="eyebrow">Explore</span>
            <strong>Choose a route</strong>
          </div>
          {links.map((link, index) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `nav-radial-link ${isActive ? 'is-active' : ''} nav-radial-link-${index + 1}`}
              onClick={() => {
                setExploreOpen(false)
                setMenuOpen(false)
              }}
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
