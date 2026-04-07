import { useEffect, useRef } from 'react'
import { useTheme } from '../context/useTheme'

const interactiveSelector = [
  '.bento-card',
  '.feature-card',
  '.widget-card',
  '.rail-card',
  '.step-card',
  '.project-card',
  '.skill-category',
  '.post-card',
  '.cert-card',
  '.timeline-card',
  '.contact-detail',
  '.contact-form',
  '.footer-panel',
  '.admin-panel',
  '.admin-stat-card',
  '.admin-manager',
  '.btn',
  '.picker-chip',
  '.nav-pill',
  '.skill-tile',
  '.text-visual-card',
  '.royal-note-card',
  '.signal-panel',
  '.orbit-core',
  '.orbit-node',
  '.nav-radial-link',
  '.theme-toggle-shell',
  '.project-rail-card',
  '.response-chip-card',
  '.skill-signal-card',
  '.sketch-note-card',
  '.magnetic-surface',
  '.principle-card',
  '.experience-signal-card',
  '.cert-orbit-card',
  '.feed-spectrum-card'
].join(', ')

function InteractionEffects() {
  const { theme } = useTheme()
  const cursorRef = useRef(null)
  const ringRef = useRef(null)
  const spotlightRef = useRef(null)
  const trailRefs = useRef([])

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      return undefined
    }

    const cursor = cursorRef.current
    const ring = ringRef.current
    const spotlight = spotlightRef.current
    if (!cursor || !ring || !spotlight) {
      return undefined
    }

    const supportsFinePointer = window.matchMedia('(pointer: fine)').matches
    if (!supportsFinePointer) {
      return undefined
    }

    let mouseX = window.innerWidth * 0.5
    let mouseY = window.innerHeight * 0.5
    let ringX = mouseX
    let ringY = mouseY
    const trailPoints = Array.from({ length: 7 }, (_, index) => ({
      x: mouseX,
      y: mouseY,
      lag: 0.1 - index * 0.01
    }))
    let frameId

    const animate = () => {
      ringX += (mouseX - ringX) * 0.16
      ringY += (mouseY - ringY) * 0.16
      cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`
      spotlight.style.setProperty('--spotlight-x', `${mouseX}px`)
      spotlight.style.setProperty('--spotlight-y', `${mouseY}px`)
      trailPoints.forEach((point, index) => {
        point.x += (mouseX - point.x) * point.lag
        point.y += (mouseY - point.y) * point.lag
        const node = trailRefs.current[index]
        if (node) {
          node.style.transform = `translate3d(${point.x}px, ${point.y}px, 0) scale(${1 - index * 0.08})`
          node.style.opacity = `${0.8 - index * 0.09}`
        }
      })
      frameId = window.requestAnimationFrame(animate)
    }

    const handlePointerMove = (event) => {
      mouseX = event.clientX
      mouseY = event.clientY
    }

    const handlePointerDown = () => {
      document.documentElement.classList.add('cursor-pressed')
    }

    const handlePointerUp = () => {
      document.documentElement.classList.remove('cursor-pressed')
    }

    const interactiveNodes = Array.from(document.querySelectorAll(interactiveSelector))

    const attachSurface = (node) => {
      const handleMove = (event) => {
        const rect = node.getBoundingClientRect()
        const offsetX = event.clientX - rect.left
        const offsetY = event.clientY - rect.top
        const rotateY = ((offsetX / rect.width) - 0.5) * 10
        const rotateX = ((offsetY / rect.height) - 0.5) * -10
        const shiftX = ((offsetX / rect.width) - 0.5) * 10
        const shiftY = ((offsetY / rect.height) - 0.5) * 10

        node.style.setProperty('--pointer-x', `${offsetX}px`)
        node.style.setProperty('--pointer-y', `${offsetY}px`)
        node.style.setProperty('--rotate-x', `${rotateX}deg`)
        node.style.setProperty('--rotate-y', `${rotateY}deg`)
        node.style.setProperty('--shift-x', `${shiftX}px`)
        node.style.setProperty('--shift-y', `${shiftY}px`)
      }

      const handleEnter = () => {
        document.documentElement.classList.add('cursor-hovering')
        node.classList.add('is-tilting')
      }

      const handleLeave = () => {
        document.documentElement.classList.remove('cursor-hovering')
        node.classList.remove('is-tilting')
        node.style.removeProperty('--rotate-x')
        node.style.removeProperty('--rotate-y')
        node.style.removeProperty('--shift-x')
        node.style.removeProperty('--shift-y')
      }

      node.addEventListener('pointermove', handleMove)
      node.addEventListener('pointerenter', handleEnter)
      node.addEventListener('pointerleave', handleLeave)

      return () => {
        node.removeEventListener('pointermove', handleMove)
        node.removeEventListener('pointerenter', handleEnter)
        node.removeEventListener('pointerleave', handleLeave)
      }
    }

    const detachFns = interactiveNodes.map(attachSurface)

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    window.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('pointerup', handlePointerUp)
    animate()

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('pointerup', handlePointerUp)
      window.cancelAnimationFrame(frameId)
      detachFns.forEach((detach) => detach())
    }
  }, [theme])

  return (
    <>
      <div ref={spotlightRef} className="mouse-spotlight" aria-hidden="true" />
      {Array.from({ length: 7 }, (_, index) => (
        <div
          key={index}
          ref={(node) => {
            trailRefs.current[index] = node
          }}
          className={`cursor-trail-particle cursor-trail-${index + 1} ${theme === 'dark' ? 'is-dark' : 'is-light'}`}
          aria-hidden="true"
        />
      ))}
      <div ref={ringRef} className="interactive-cursor cursor-ring" aria-hidden="true" />
      <div ref={cursorRef} className="interactive-cursor cursor-dot" aria-hidden="true" />
    </>
  )
}

export default InteractionEffects
