import { Within } from "@theme-toggles/react"
import "@theme-toggles/react/css/Within.css"
import { useTheme } from '../context/useTheme'

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <div
      className={`theme-toggle-shell ${isDark ? 'is-dark' : 'is-light'}`}
      onClick={toggleTheme}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          toggleTheme()
        }
      }}
      role="button"
      tabIndex={0}
      aria-label="Toggle theme"
    >
      <span className="theme-toggle-orb" aria-hidden="true" />
      <span className="theme-toggle-glow theme-toggle-glow-a" aria-hidden="true" />
      <span className="theme-toggle-glow theme-toggle-glow-b" aria-hidden="true" />
      <span className="theme-toggle-ring theme-toggle-ring-a" aria-hidden="true" />
      <span className="theme-toggle-ring theme-toggle-ring-b" aria-hidden="true" />
      <span className="theme-toggle-copy">
        <small>Mode</small>
        <strong>{isDark ? 'Future' : 'Royal'}</strong>
      </span>
      <Within duration={750} toggled={isDark} onToggle={() => {}} className="theme-toggle-button" />
    </div>
  )
}

export default ThemeToggle
