import { Link } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'

function Navbar() {
  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <div className="navbar-brand">
          <Link to="/">Navin Jairam</Link>
        </div>
        
        <ul className="navbar-links">
          <li><Link to="/about">About</Link></li>
          <li><Link to="/experience">Experience</Link></li>
          <li><Link to="/skills">Skills</Link></li>
          <li><Link to="/projects">Projects</Link></li>
          <li><Link to="/certifications">Certifications</Link></li>
          <li><Link to="/posts">Posts</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>
        
        <ThemeToggle />
      </div>
    </nav>
  )
}

export default Navbar