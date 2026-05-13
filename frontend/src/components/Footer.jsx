import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSiteContent } from '../context/useSiteContent'

function Footer() {
  const { siteContent } = useSiteContent()
  const footer = siteContent.global.footer
  const signalHeading = footer.signalHeading || ''
  const [typedSignalHeading, setTypedSignalHeading] = useState('')
  const [isDeletingSignal, setIsDeletingSignal] = useState(false)
  const prefersReducedMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const shouldAnimateSignal = Boolean(signalHeading) && !prefersReducedMotion

  useEffect(() => {
    if (!shouldAnimateSignal) {
      return undefined
    }

    const nextDelay = isDeletingSignal
      ? typedSignalHeading === '' ? 450 : 40
      : typedSignalHeading === signalHeading ? 1800 : 95

    const timer = window.setTimeout(() => {
      if (isDeletingSignal) {
        const nextText = signalHeading.slice(0, Math.max(typedSignalHeading.length - 1, 0))
        setTypedSignalHeading(nextText)

        if (nextText === '') {
          setIsDeletingSignal(false)
        }
        return
      }

      const nextText = signalHeading.slice(0, typedSignalHeading.length + 1)
      setTypedSignalHeading(nextText)

      if (nextText === signalHeading) {
        setIsDeletingSignal(true)
      }
    }, nextDelay)

    return () => window.clearTimeout(timer)
  }, [isDeletingSignal, shouldAnimateSignal, signalHeading, typedSignalHeading])

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
              <strong>
                <span className="typed-text">{shouldAnimateSignal ? typedSignalHeading : signalHeading}</span>
                <span className="cursor" aria-hidden="true">|</span>
              </strong>
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
