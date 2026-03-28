import { Link } from 'react-router-dom'

function Posts() {
  return (
    <div>
      <h1>Posts</h1>
      <p>My latest thoughts, learnings, and updates from LinkedIn.</p>
      
      <div>
        <p><em>LinkedIn feed integration coming soon.</em></p>
        <p>This page will automatically display my recent LinkedIn posts.</p>
      </div>
      
      <div>
        <h3>Preview of what's coming:</h3>
        <ul>
          <li>📝 Latest LinkedIn articles and updates</li>
          <li>🏆 Certifications and achievements</li>
          <li>🚀 Project launches and milestones</li>
          <li>💡 Cloud & DevOps learnings</li>
        </ul>
      </div>
      
      <p>
        📌 Visit my <a href="https://www.linkedin.com/in/navin-jairam" target="_blank" rel="noopener noreferrer">LinkedIn profile</a> for now.
      </p>
      
      <hr />
      
      <div>
        <p>
          <Link to="/skills">View my skills</Link> |{' '}
          <Link to="/projects">See my projects</Link>
        </p>
      </div>
    </div>
  )
}

export default Posts