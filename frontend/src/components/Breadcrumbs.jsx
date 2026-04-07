import { Link, useLocation } from 'react-router-dom'

const labelMap = {
  about: 'About',
  experience: 'Experience',
  skills: 'Skills',
  projects: 'Projects',
  certifications: 'Certifications',
  posts: 'Feed',
  contact: 'Contact',
  callback: 'Callback',
  login: 'Login',
  'lucifer-newstar_dashboard': 'Dashboard'
}

function Breadcrumbs() {
  const location = useLocation()

  if (location.pathname === '/') {
    return null
  }

  const segments = location.pathname.split('/').filter(Boolean)
  const crumbs = segments.map((segment, index) => ({
    label: labelMap[segment] || segment,
    path: `/${segments.slice(0, index + 1).join('/')}`
  }))

  return (
    <div className="container">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        {crumbs.map((crumb) => (
          <span key={crumb.path} className="breadcrumb-item">
            <span className="breadcrumb-separator">/</span>
            <Link to={crumb.path}>{crumb.label}</Link>
          </span>
        ))}
      </nav>
    </div>
  )
}

export default Breadcrumbs
