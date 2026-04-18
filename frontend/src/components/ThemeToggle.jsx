import { Within } from "@theme-toggles/react"
import "@theme-toggles/react/css/Within.css"
import { useTheme } from '../context/useTheme'

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  return (
    <div
      className={`theme-toggle-shell ${theme === 'dark' ? 'is-dark' : 'is-light'}`}
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
      <Within duration={750} toggled={theme === 'dark'} onToggle={() => {}} className="theme-toggle-button" />
    </div>
  )
}

export default ThemeToggle
