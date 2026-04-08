import { useEffect, useState } from 'react'

function ScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight
      const progress = (window.scrollY / totalScroll) * 100
      setScrollProgress(progress)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <button
      type="button"
      className="scroll-progress"
      onClick={handleClick}
      aria-label={`Scroll to top, ${Math.round(scrollProgress)} percent read`}
      title="Scroll to top"
    >
      <span className="scroll-progress-label">{Math.round(scrollProgress)}%</span>
      <span className="scroll-progress-track">
        <span
          className="scroll-progress-fill"
          style={{ width: `${Math.max(0, Math.min(100, scrollProgress))}%` }}
        />
      </span>
    </button>
  )
}

export default ScrollProgress
