import { useCallback, useEffect, useMemo, useState } from 'react'
import { deepCloneContent, mergeWithDefaultContent } from '../content/siteContent'
import { SiteContentContext } from './site-content-context'

const STORAGE_KEY = 'portfolio-site-content-v1'
const DRAFT_STORAGE_KEY = 'portfolio-site-content-draft-v1'
const SAVED_AT_STORAGE_KEY = 'portfolio-site-content-saved-at-v1'

function readStoredContent(key) {
  try {
    const saved = localStorage.getItem(key)
    return saved ? mergeWithDefaultContent(JSON.parse(saved)) : null
  } catch {
    return null
  }
}

function isDraftPreviewMode() {
  try {
    return new URLSearchParams(window.location.search).get('admin-preview') === 'draft'
  } catch {
    return false
  }
}

export function SiteContentProvider({ children }) {
  const [savedContent, setSavedContent] = useState(() => {
    return readStoredContent(STORAGE_KEY) ?? deepCloneContent()
  })
  const [draftContent, setDraftContent] = useState(() => {
    return readStoredContent(DRAFT_STORAGE_KEY) ?? readStoredContent(STORAGE_KEY) ?? deepCloneContent()
  })
  const [lastSavedAt, setLastSavedAt] = useState(() => localStorage.getItem(SAVED_AT_STORAGE_KEY))
  const previewDraft = isDraftPreviewMode()

  useEffect(() => {
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draftContent))
  }, [draftContent])

  const hasUnsavedChanges = useMemo(
    () => JSON.stringify(draftContent) !== JSON.stringify(savedContent),
    [draftContent, savedContent],
  )

  const saveSiteContent = useCallback(() => {
    const snapshot = JSON.parse(JSON.stringify(draftContent))
    const savedAt = new Date().toISOString()

    setSavedContent(snapshot)
    setLastSavedAt(savedAt)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot))
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(snapshot))
    localStorage.setItem(SAVED_AT_STORAGE_KEY, savedAt)
  }, [draftContent])

  const discardDraftChanges = useCallback(() => {
    const snapshot = JSON.parse(JSON.stringify(savedContent))
    setDraftContent(snapshot)
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(snapshot))
  }, [savedContent])

  const resetSiteContent = useCallback(() => {
    const defaults = deepCloneContent()
    setDraftContent(defaults)
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(defaults))
  }, [])

  const value = useMemo(() => ({
    siteContent: previewDraft ? draftContent : savedContent,
    draftContent,
    setDraftContent,
    saveSiteContent,
    discardDraftChanges,
    resetSiteContent,
    hasUnsavedChanges,
    lastSavedAt,
  }), [
    discardDraftChanges,
    draftContent,
    hasUnsavedChanges,
    lastSavedAt,
    previewDraft,
    resetSiteContent,
    saveSiteContent,
    savedContent,
  ])

  return (
    <SiteContentContext.Provider value={value}>
      {children}
    </SiteContentContext.Provider>
  )
}
