import { Link } from 'react-router-dom'

function About() {
  return (
    <div>
      <h1>About Me</h1>
      <p>My background, education, and story will appear here.</p>
      <p>Use the admin dashboard to update this information.</p>
      
      <div>
        <p><em>Coming soon: About editor in admin dashboard.</em></p>
      </div>
      
      <hr />
      <div>
        <p>
          <Link to="/experience">My experience</Link> |{' '}
          <Link to="/skills">Skills I'm learning</Link>
        </p>
      </div>
    </div>
  )
}

export default About