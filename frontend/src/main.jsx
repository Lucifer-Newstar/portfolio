import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/global.css'
import { ThemeProvider } from './context/ThemeContext'
import { SiteContentProvider } from './context/SiteContentContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <SiteContentProvider>
        <App />
      </SiteContentProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
