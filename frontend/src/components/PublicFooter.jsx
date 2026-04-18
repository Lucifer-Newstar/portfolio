import { Link } from 'react-router-dom'
import { useSiteContent } from '../context/useSiteContent'

function PublicFooter() {
  const { siteContent } = useSiteContent()
  const footer = siteContent.global.footer
  const brandName = siteContent.global.nav.brandName

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-professional">
          <div className="footer-professional-copy">
            <span className="eyebrow">{footer.eyebrow || 'Portfolio'}</span>
            <h3>Cloud, DevOps, and platform engineering work presented with clarity.</h3>
            <p>
              The public site is designed to be easier to scan, more confident in tone,
              and better aligned with what recruiters, hiring managers, and engineering
              teams expect from a professional portfolio.
            </p>
          </div>

          <div className="footer-professional-links">
            {footer.links.map((link) => (
              <Link key={link.href} to={link.href}>{link.label}</Link>
            ))}
          </div>

          <div className="footer-professional-signal">
            <span className="eyebrow">{footer.signalTitle || 'Focus'}</span>
            <strong>Cloud | DevOps | SRE</strong>
            <span>{footer.signalText}</span>
          </div>
        </div>

        <div className="footer-meta footer-meta-professional">
          <p>© {new Date().getFullYear()} {brandName}. {footer.copyrightText}</p>
          <p>Built to feel polished on the public side while leaving the admin workflow unchanged.</p>
        </div>
      </div>
    </footer>
  )
}

export default PublicFooter
