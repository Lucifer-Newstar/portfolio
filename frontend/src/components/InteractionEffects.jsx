import { useEffect, useRef } from 'react'
import { useTheme } from '../context/useTheme'

const interactiveSelector = [
  '.btn',
  '.picker-chip',
  '.nav-pill',
  '.theme-toggle-shell',
  '.skill-tag',
  '.tech-badge'
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

        node.style.setProperty('--pointer-x', `${offsetX}px`)
        node.style.setProperty('--pointer-y', `${offsetY}px`)
      }

      const handleEnter = () => {
        document.documentElement.classList.add('cursor-hovering')
      }

      const handleLeave = () => {
        document.documentElement.classList.remove('cursor-hovering')
        node.style.removeProperty('--pointer-x')
        node.style.removeProperty('--pointer-y')
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
