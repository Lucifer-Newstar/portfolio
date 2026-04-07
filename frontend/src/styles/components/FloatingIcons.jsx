import { useEffect, useRef } from 'react'
import { useTheme } from '../../context/useTheme'

const icons = [
  '☁️', '🐳', '⚡', '🔧', '📦', '🚀', '💻', '🌐', '🔒', '📊', '🤖', '⚙️',
  '🐍', '📘', '🎨', '🔷', '💎', '✨', '🌟', '💫', '⭐', '⚡', '🔥', '💧'
]

function FloatingIcons() {
  const containerRef = useRef(null)
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const iconElements = []
    
    icons.forEach((icon) => {
      const element = document.createElement('div')
      element.className = 'floating-icon'
      element.textContent = icon
      element.style.position = 'absolute'
      element.style.fontSize = `${Math.random() * 24 + 16}px`
      element.style.left = `${Math.random() * 100}%`
      element.style.top = `${Math.random() * 100}%`
      element.style.animationDelay = `${Math.random() * 10}s`
      element.style.animationDuration = `${Math.random() * 15 + 10}s`
      element.style.opacity = isDark ? 0.25 : 0.12
      element.style.filter = isDark ? 'drop-shadow(0 0 3px #00D4FF)' : 'none'
      element.style.color = isDark ? '#00D4FF' : '#D4AF37'
      container.appendChild(element)
      iconElements.push(element)
    })

    return () => {
      iconElements.forEach(el => el.remove())
    }
  }, [isDark])

  return (
    <div 
      ref={containerRef} 
      className="floating-icons"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none',
        overflow: 'hidden'
      }}
    />
  )
}

export default FloatingIcons
