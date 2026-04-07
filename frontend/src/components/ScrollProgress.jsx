import { useEffect, useState } from 'react'

function ScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight
      const progress = totalScroll > 0 ? (window.scrollY / totalScroll) * 100 : 0
      setScrollProgress(Math.min(100, Math.max(0, progress)))
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [])

  const circumference = 2 * Math.PI * 44
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference

  return (
    <button
      type="button"
      className="scroll-progress"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Scroll to top"
    >
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <circle cx="50" cy="50" r="44" className="scroll-progress-track" />
        <circle
          cx="50"
          cy="50"
          r="44"
          className="scroll-progress-indicator"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
        />
      </svg>
      <span>{Math.round(scrollProgress)}%</span>
    </button>
  )
}

export default ScrollProgress
