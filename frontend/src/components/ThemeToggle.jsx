import { Within } from "@theme-toggles/react"
import "@theme-toggles/react/css/Within.css"
import { useTheme } from '../context/ThemeContext'

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <Within
      duration={750}
      toggled={isDark}
      onToggle={toggleTheme}
      className="theme-toggle-button"
    />
  )
}

export default ThemeToggle