import { Link } from 'react-router-dom'

function Contact() {
  return (
    <div>
      <h1>Contact</h1>
      
      <div>
        <p><strong>Email:</strong> navin.jairam@gmail.com</p>
        <p><strong>LinkedIn:</strong> <a href="https://www.linkedin.com/in/navin-jairam" target="_blank" rel="noopener noreferrer">linkedin.com/in/navin-jairam</a></p>
        <p><strong>GitHub:</strong> Coming soon</p>
        <p><strong>Phone:</strong> +91 9941360835</p>
      </div>
      
      <hr />
      
      <div>
        <p>
          <Link to="/">Back to home</Link> |{' '}
          <Link to="/projects">View my work</Link>
        </p>
      </div>
    </div>
  )
}

export default Contact