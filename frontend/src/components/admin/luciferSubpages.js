import { useLocation } from 'react-router-dom'

export function useLuciferSubpage(sections = [], basePath = '') {
  const location = useLocation()
  const normalizedBasePath = basePath.endsWith('/') ? basePath.slice(0, -1) : basePath
  const pathname = location.pathname.endsWith('/') && location.pathname !== '/'
    ? location.pathname.slice(0, -1)
    : location.pathname

  const suffix = pathname.startsWith(normalizedBasePath)
    ? pathname.slice(normalizedBasePath.length).replace(/^\/+/, '')
    : ''

  const matchedSection = sections.find((section) => section.id === suffix)
  const fallbackSection = sections[0] || null
  const activeSection = matchedSection || fallbackSection

  return {
    activeSectionId: activeSection?.id || '',
    sections: sections.map((section) => ({
      ...section,
      href: `${normalizedBasePath}/${section.id}`,
      isActive: section.id === activeSection?.id,
    })),
    shouldRedirect: Boolean(activeSection) && (!suffix || !matchedSection),
    redirectPath: activeSection ? `${normalizedBasePath}/${activeSection.id}` : normalizedBasePath,
  }
}
