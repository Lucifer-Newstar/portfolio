import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'
import { useSiteContent } from '../context/useSiteContent'

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [exploreOpen, setExploreOpen] = useState(false)
  const { siteContent } = useSiteContent()
  const navContent = siteContent.global.nav
  const links = navContent.links || []

  useEffect(() => {
    document.body.classList.toggle('nav-explore-active', exploreOpen)
    return () => {
      document.body.classList.remove('nav-explore-active')
    }
  }, [exploreOpen])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 960) {
        setMenuOpen(false)
      }
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        setExploreOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('keydown', handleEscape)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('keydown', handleEscape)
    }
  }, [])

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <div className="navbar-brand-cluster">
          <Link to="/" className="navbar-brand">
            <span className="brand-mark">{navContent.brandMark || 'NJ'}</span>
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
          aria-expanded={menuOpen}
          aria-controls="navbar-controls"
          onClick={() => setMenuOpen((value) => !value)}
        >
          {menuOpen ? 'Close' : 'Menu'}
        </button>

        <div id="navbar-controls" className={`navbar-controls ${menuOpen ? 'is-open' : ''}`}>
          <div className="navbar-actions">
            <button
              type="button"
              className={`nav-explore-toggle magnetic-surface ${exploreOpen ? 'is-open' : ''}`}
              onClick={() => {
                setExploreOpen((value) => !value)
                setMenuOpen(false)
              }}
            >
              {navContent.exploreLabel || 'Explore'}
            </button>
            <Link to="/contact" className="btn btn-primary btn-sm" onClick={() => setMenuOpen(false)}>
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
          <Link
            to="/"
            className="nav-home-corner"
            onClick={() => {
              setExploreOpen(false)
              setMenuOpen(false)
            }}
          >
            {navContent.homeLabel || 'Home'}
          </Link>
          <div className="nav-radial-core">
            <span className="nav-radial-pulse nav-radial-pulse-1" />
            <span className="nav-radial-pulse nav-radial-pulse-2" />
            <span className="eyebrow">{navContent.exploreEyebrow || 'Explore'}</span>
            <strong>{navContent.exploreTitle || 'Choose a route'}</strong>
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
