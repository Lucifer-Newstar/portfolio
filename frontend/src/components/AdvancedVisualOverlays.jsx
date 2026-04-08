import { useEffect, useMemo, useRef } from 'react'
import { useLocation } from 'react-router-dom'

function getSceneSeed(pathname) {
  if (pathname === '/') return 'home'
  if (pathname.includes('projects')) return 'projects'
  if (pathname.includes('skills')) return 'skills'
  if (pathname.includes('experience')) return 'experience'
  if (pathname.includes('posts')) return 'posts'
  if (pathname.includes('contact')) return 'contact'
  return 'default'
}

function classifyTarget(target) {
  if (!target) return 'neutral'
  const element = target.closest('a,button,input,textarea,select,[role="button"],[data-project-tile]')
  if (!element) return 'neutral'
  const className = String(element.className || '').toLowerCase()
  if (element.matches('a') || className.includes('link') || className.includes('nav')) return 'navigate'
  if (element.matches('button,[role="button"]') || className.includes('btn') || className.includes('chip')) return 'action'
  if (className.includes('card') || className.includes('tile') || className.includes('panel')) return 'inspect'
  return 'action'
}

function AdvancedVisualOverlays() {
  const location = useLocation()
  const reducedMotion = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, [])
  const coarsePointer = useMemo(() => window.matchMedia('(pointer: coarse)').matches, [])
  const canUsePointerFx = !reducedMotion && !coarsePointer
  const pointerAuraRef = useRef(null)
  const sceneSeed = useMemo(() => getSceneSeed(location.pathname), [location.pathname])

  useEffect(() => {
    const viewportWidth = window.innerWidth
    const visualTier = reducedMotion || coarsePointer || viewportWidth < 880 ? 'low' : viewportWidth < 1200 ? 'mid' : 'high'

    document.documentElement.setAttribute('data-visual-tier', visualTier)
  }, [coarsePointer, reducedMotion])

  useEffect(() => {
    document.body.dataset.sceneSeed = sceneSeed
  }, [sceneSeed])

  useEffect(() => {
    let rafId = 0
    let lastY = window.scrollY
    let lastT = performance.now()

    const tick = (now) => {
      const y = window.scrollY
      const h = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      const progress = Math.min(1, Math.max(0, y / h))
      const dt = Math.max(16, now - lastT)
      const velocity = Math.min(1, Math.abs(y - lastY) / dt * 8)

      document.documentElement.style.setProperty('--scroll-progress', progress.toFixed(4))
      document.documentElement.style.setProperty('--scroll-velocity', velocity.toFixed(4))

      lastY = y
      lastT = now
      rafId = window.requestAnimationFrame(tick)
    }

    rafId = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(rafId)
  }, [])

  useEffect(() => {
    if (!canUsePointerFx) return undefined

    const auraNode = pointerAuraRef.current
    if (!auraNode) return undefined

    let currentX = -120
    let currentY = -120
    let targetX = -120
    let targetY = -120
    let rafId = 0

    const syncAura = () => {
      currentX += (targetX - currentX) * 0.18
      currentY += (targetY - currentY) * 0.18
      auraNode.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`
      rafId = window.requestAnimationFrame(syncAura)
    }

    const handleMove = (event) => {
      targetX = event.clientX
      targetY = event.clientY
      auraNode.className = `advanced-pointer-aura advanced-pointer-${classifyTarget(event.target)}`
    }

    const handleLeave = () => {
      targetX = -120
      targetY = -120
      auraNode.className = 'advanced-pointer-aura advanced-pointer-neutral'
    }

    window.addEventListener('pointermove', handleMove, { passive: true })
    document.addEventListener('pointerleave', handleLeave)
    rafId = window.requestAnimationFrame(syncAura)

    return () => {
      window.removeEventListener('pointermove', handleMove)
      document.removeEventListener('pointerleave', handleLeave)
      window.cancelAnimationFrame(rafId)
    }
  }, [canUsePointerFx])

  return (
    <>
      <div className="advanced-cinematic-layer" aria-hidden="true">
        <span className="cinematic-fog cinematic-fog-a" />
        <span className="cinematic-fog cinematic-fog-b" />
        <span className="cinematic-beam cinematic-beam-a" />
        <span className="cinematic-beam cinematic-beam-b" />
      </div>

      <div className="advanced-telemetry-layer" aria-hidden="true">
        <div className="telemetry-orbit telemetry-orbit-a" />
        <div className="telemetry-orbit telemetry-orbit-b" />
        <div className="telemetry-node telemetry-node-a" />
        <div className="telemetry-node telemetry-node-b" />
        <div className="telemetry-node telemetry-node-c" />
      </div>

      {canUsePointerFx ? (
        <div
          ref={pointerAuraRef}
          aria-hidden="true"
          className="advanced-pointer-aura advanced-pointer-neutral"
        />
      ) : null}
    </>
  )
}

export default AdvancedVisualOverlays
