import { Within } from "@theme-toggles/react"
import "@theme-toggles/react/css/Within.css"
import { useTheme } from '../context/ThemeContext'

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <div className="theme-toggle-wrapper">
      <Within
        duration={750}
        toggled={isDark}
        onToggle={toggleTheme}
        className="theme-toggle-button"
        style={{
          fontSize: '2.5rem',
          width: '3rem',
          height: '3rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#9b8140'
        }}
      />
    </div>
  )
}

export default ThemeToggle