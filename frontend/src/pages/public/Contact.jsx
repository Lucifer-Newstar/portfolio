import { Link } from 'react-router-dom'

function Contact() {
  return (
    <div className="container">
      <h1 className="text-center">Contact</h1>
      <p className="text-center">Get in touch with me.</p>
      
      <div className="contact-container">
        <div className="contact-info">
          <h3>Let's Connect</h3>
          <div className="contact-detail">
            <span>📧</span>
            <a href="mailto:navin.jairam@gmail.com">navin.jairam@gmail.com</a>
          </div>
          <div className="contact-detail">
            <span>💼</span>
            <a href="https://www.linkedin.com/in/navin-jairam" target="_blank" rel="noopener noreferrer">
              linkedin.com/in/navin-jairam
            </a>
          </div>
          <div className="contact-detail">
            <span>📱</span>
            <a href="tel:+919941360835">+91 99413 60835</a>
          </div>
          <div className="contact-detail">
            <span>🐙</span>
            <a href="https://github.com/Lucifer-Newstar" target="_blank" rel="noopener noreferrer">
              github.com/Lucifer-Newstar
            </a>
          </div>
        </div>
        
        <form className="contact-form">
          <div className="form-group">
            <label>Name</label>
            <input type="text" placeholder="Your name" />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" placeholder="your.email@example.com" />
          </div>
          <div className="form-group">
            <label>Message</label>
            <textarea rows="5" placeholder="Your message..."></textarea>
          </div>
          <button type="submit" className="btn btn-primary">Send Message</button>
        </form>
      </div>
      
      <hr className="mt-4" />
      
      <div className="text-center mt-3">
        <Link to="/" className="btn btn-secondary">Back to home</Link>
        {' '}
        <Link to="/projects" className="btn btn-secondary">View my work</Link>
      </div>
    </div>
  )
}

export default Contact