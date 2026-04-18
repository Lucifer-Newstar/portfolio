import { useEffect } from 'react'
import ParticleBackground from '../ParticleBackground'
import ThemeAtmosphere from '../ThemeAtmosphere'
import AdvancedVisualOverlays from '../AdvancedVisualOverlays'
import InteractionEffects from '../InteractionEffects'
import ScrollAnimations from '../ScrollAnimations'

function AdminShell({ children }) {
  useEffect(() => {
    document.body.setAttribute('data-ui-surface', 'admin')

    return () => {
      document.body.removeAttribute('data-ui-surface')
    }
  }, [])

  return (
    <>
      <ParticleBackground />
      <ThemeAtmosphere />
      <AdvancedVisualOverlays />
      <InteractionEffects />
      <ScrollAnimations />

      <div className="app-shell app-shell-admin">
        <main className="app-main app-main-admin">
          {children}
        </main>
      </div>
    </>
  )
}

export default AdminShell
