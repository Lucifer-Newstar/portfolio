import { useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { useSiteContent } from '../context/useSiteContent'

function ensureMeta(name, content, attr = 'name') {
  if (!content) return
  let node = document.head.querySelector(`meta[${attr}="${name}"]`)
  if (!node) {
    node = document.createElement('meta')
    node.setAttribute(attr, name)
    document.head.appendChild(node)
  }
  node.setAttribute('content', content)
}

function buildRouteDetails(pathname, siteContent) {
  const host = window.location.origin
  const fallbackImage = siteContent.home?.heroImage || siteContent.about?.visualImage || ''

  const routes = {
    '/': {
      title: `${siteContent.home?.title || 'Portfolio'} | ${siteContent.global?.nav?.brandName || 'Navin Jairam'}`,
      description: siteContent.home?.description,
      image: siteContent.home?.heroImage || fallbackImage,
    },
    '/about': {
      title: `${siteContent.about?.title || 'About'} | ${siteContent.global?.nav?.brandName || 'Navin Jairam'}`,
      description: siteContent.about?.lead,
      image: siteContent.about?.visualImage || fallbackImage,
    },
    '/experience': {
      title: `${siteContent.experiencePage?.title || 'Experience'} | ${siteContent.global?.nav?.brandName || 'Navin Jairam'}`,
      description: siteContent.experiencePage?.lead,
      image: fallbackImage,
    },
    '/skills': {
      title: `${siteContent.skillsPage?.title || 'Skills'} | ${siteContent.global?.nav?.brandName || 'Navin Jairam'}`,
      description: siteContent.skillsPage?.lead,
      image: fallbackImage,
    },
    '/projects': {
      title: `${siteContent.projectsPage?.title || 'Projects'} | ${siteContent.global?.nav?.brandName || 'Navin Jairam'}`,
      description: siteContent.projectsPage?.lead,
      image: siteContent.projectsPage?.heroImage || fallbackImage,
    },
    '/devops-lab': {
      title: `${siteContent.devopsLabPage?.title || 'DevOps Lab'} | ${siteContent.global?.nav?.brandName || 'Navin Jairam'}`,
      description: siteContent.devopsLabPage?.lead,
      image: fallbackImage,
    },
    '/certifications': {
      title: `${siteContent.certificationsPage?.title || 'Certifications'} | ${siteContent.global?.nav?.brandName || 'Navin Jairam'}`,
      description: siteContent.certificationsPage?.lead,
      image: fallbackImage,
    },
    '/posts': {
      title: `${siteContent.postsPage?.title || 'Feed'} | ${siteContent.global?.nav?.brandName || 'Navin Jairam'}`,
      description: siteContent.postsPage?.lead,
      image: fallbackImage,
    },
    '/contact': {
      title: `${siteContent.contact?.title || 'Contact'} | ${siteContent.global?.nav?.brandName || 'Navin Jairam'}`,
      description: siteContent.contact?.lead,
      image: fallbackImage,
    },
    '/callback': {
      title: `Admin Callback | ${siteContent.global?.nav?.brandName || 'Navin Jairam'}`,
      description: 'Completing secure administrator authentication.',
      image: fallbackImage,
    },
    '/lucifer-newstar_dashboard': {
      title: `Admin Dashboard | ${siteContent.global?.nav?.brandName || 'Navin Jairam'}`,
      description: siteContent.admin?.lead || 'Dedicated admin workspace for managing portfolio content and operations.',
      image: fallbackImage,
    },
  }

  const selected = routes[pathname] || routes['/']
  return {
    title: selected.title || 'Portfolio',
    description: selected.description || 'Cloud, DevOps, and platform engineering portfolio.',
    image: selected.image || fallbackImage,
    url: `${host}${pathname}`,
  }
}

function RouteMeta() {
  const location = useLocation()
  const { siteContent } = useSiteContent()

  const details = useMemo(
    () => buildRouteDetails(location.pathname, siteContent),
    [location.pathname, siteContent]
  )

  useEffect(() => {
    document.title = details.title
    ensureMeta('description', details.description)
    ensureMeta('og:title', details.title, 'property')
    ensureMeta('og:description', details.description, 'property')
    ensureMeta('og:type', 'website', 'property')
    ensureMeta('og:url', details.url, 'property')
    ensureMeta('og:image', details.image, 'property')
    ensureMeta('twitter:card', 'summary_large_image')
    ensureMeta('twitter:title', details.title)
    ensureMeta('twitter:description', details.description)
    ensureMeta('twitter:image', details.image)
  }, [details])

  return null
}

export default RouteMeta
