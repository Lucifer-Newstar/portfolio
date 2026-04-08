import { useState, useEffect } from 'react'
import { ThemeContext } from './theme-context'

export const ThemeProvider = ({ children }) => {
  const forcedTheme = new URLSearchParams(window.location.search).get('theme')
  const resolvedForcedTheme = forcedTheme === 'dark' || forcedTheme === 'light' ? forcedTheme : null
  const [storedTheme, setStoredTheme] = useState(() => {
    const saved = localStorage.getItem('theme')
    if (saved === 'dark' || saved === 'light') return saved
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })
  const theme = resolvedForcedTheme ?? storedTheme

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark')
    } else {
      document.documentElement.removeAttribute('data-theme')
    }
    if (!resolvedForcedTheme) {
      localStorage.setItem('theme', theme)
    }
  }, [resolvedForcedTheme, theme])

  const toggleTheme = () => {
    if (resolvedForcedTheme) return
    setStoredTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
