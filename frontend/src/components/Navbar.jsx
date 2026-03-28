import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav>
      <div>
        <Link to="/">Navin Jairam</Link>
      </div>
      <ul>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/experience">Experience</Link></li>
        <li><Link to="/skills">Skills</Link></li>
        <li><Link to="/projects">Projects</Link></li>
        <li><Link to="/certifications">Certifications</Link></li>
        <li><Link to="/posts">Posts</Link></li>
        <li><Link to="/contact">Contact</Link></li>
      </ul>
    </nav>
  )
}

export default Navbar