import { useEffect, useMemo, useState } from 'react'
import { deepCloneContent, mergeWithDefaultContent } from '../content/siteContent'
import { SiteContentContext } from './site-content-context'

const STORAGE_KEY = 'portfolio-site-content-v1'

export function SiteContentProvider({ children }) {
  const [siteContent, setSiteContent] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? mergeWithDefaultContent(JSON.parse(saved)) : deepCloneContent()
    } catch {
      return deepCloneContent()
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(siteContent))
  }, [siteContent])

  const value = useMemo(() => ({
    siteContent,
    setSiteContent,
    resetSiteContent: () => setSiteContent(deepCloneContent())
  }), [siteContent])

  return (
    <SiteContentContext.Provider value={value}>
      {children}
    </SiteContentContext.Provider>
  )
}
