import { Link } from 'react-router-dom'
import { useSiteContent } from '../context/useSiteContent'

function Footer() {
  const { siteContent } = useSiteContent()
  const footer = siteContent.global.footer

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-panel">
            <span className="eyebrow">{footer.eyebrow}</span>
            <h3>{footer.title}</h3>
            <p>{footer.description}</p>
          </div>

          <div className="footer-panel">
            <span className="eyebrow">{footer.linksTitle}</span>
            <div className="footer-links">
              {footer.links.map((link) => (
                <Link key={link.href} to={link.href}>{link.label}</Link>
              ))}
            </div>
          </div>

          <div className="footer-panel footer-widget">
            <span className="eyebrow">{footer.signalTitle}</span>
            <div className="widget-stat">
              <strong>{footer.signalHeading}</strong>
              <span>{footer.signalText}</span>
            </div>
          </div>
        </div>

        <div className="footer-meta">
          <p>© {new Date().getFullYear()} {siteContent.global.nav.brandName}. {footer.copyrightText}</p>
          <p>{footer.metaText}</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
