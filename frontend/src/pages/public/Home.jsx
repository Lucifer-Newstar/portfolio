import { Link } from 'react-router-dom'

function Home() {
  return (
    <div>
      <h1>Navin Jairam</h1>
      <p>DevOps & Cloud Trainee</p>
      <p>Building reliable systems, one pipeline at a time.</p>
      
      <div>
        <Link to="/about">Learn about me</Link> |{' '}
        <Link to="/projects">View my projects</Link> |{' '}
        <Link to="/contact">Get in touch</Link>
      </div>
      
      <hr />
      
      <div>
        <h2>Featured</h2>
        <p><em>Skills, projects, and achievements will be highlighted here.</em></p>
        <p>Use admin dashboard to customize this page.</p>
      </div>
    </div>
  )
}

export default Home