import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/global.css'
import './styles/overrides/layout.css'
import './styles/overrides/navbar-explore.css'
import './styles/overrides/interaction.css'
import './styles/overrides/home-hero.css'
import './styles/overrides/admin-content.css'
import './styles/overrides/scroll-story.css'
import './styles/overrides/visual-additions.css'
import './styles/overrides/advanced-visuals.css'
import './styles/overrides/theme-signatures.css'
import './styles/overrides/typography-rhythm.css'
import './styles/overrides/page-experiences.css'
import './styles/overrides/interaction-mobile-polish.css'
import './styles/overrides/devops-observability.css'
import './styles/overrides/posts-source-cards.css'
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
