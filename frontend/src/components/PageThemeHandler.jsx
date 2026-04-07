import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

function PageThemeHandler() {
  const location = useLocation()

  useEffect(() => {
    const path = location.pathname
    let pageType = 'default'
    
    if (path === '/') pageType = 'hero'
    else if (path === '/about') pageType = 'about'
    else if (path === '/skills') pageType = 'skills'
    else if (path === '/projects') pageType = 'projects'
    else if (path === '/devops-lab') pageType = 'devops'
    else if (path === '/experience') pageType = 'experience'
    else if (path === '/certifications') pageType = 'certifications'
    else if (path === '/posts') pageType = 'posts'
    else if (path === '/contact') pageType = 'contact'
    else pageType = 'default'
    
    document.documentElement.setAttribute('data-page', pageType)
  }, [location])

  return null
}

export default PageThemeHandler
