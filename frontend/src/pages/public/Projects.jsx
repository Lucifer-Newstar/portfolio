import { Link } from 'react-router-dom'

function Projects() {
  return (
    <div>
      <h1>Projects</h1>
      <p>My portfolio projects will appear here.</p>
      <p>Use the admin dashboard to add, edit, or manage projects.</p>
      
      <div>
        <p><em>Coming soon: Projects manager in admin dashboard.</em></p>
      </div>
      
      <hr />
      <div>
        <p>
          <Link to="/skills">View my skills</Link> |{' '}
          <Link to="/experience">See my experience</Link>
        </p>
      </div>
    </div>
  )
}

export default Projects