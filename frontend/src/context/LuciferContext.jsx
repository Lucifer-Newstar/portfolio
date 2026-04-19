import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  createDailyStatusEntry,
  createEmptyLuciferState,
  createLearningLogEntry,
  createWorkoutLogEntry,
  LUCIFER_COLLECTIONS,
  loadLuciferStateLocal,
  normalizeLuciferState,
  upsertCollectionItem,
  upsertEntityMeta,
  deleteCollectionItem,
  buildLuciferSummary,
} from '../utils/luciferData'
import {
  createPost,
  createSkill,
  fetchLuciferState,
  saveLuciferState,
  fetchPosts,
  fetchProjects,
  fetchSkills,
  uploadAdminImage,
} from '../utils/api'
import { LuciferContext } from './lucifer-context'

export function LuciferProvider({ children }) {
  const [privateState, setPrivateState] = useState(() => createEmptyLuciferState())
  const [sharedSkills, setSharedSkills] = useState([])
  const [sharedProjects, setSharedProjects] = useState([])
  const [sharedPosts, setSharedPosts] = useState([])
  const [loading, setLoading] = useState(true)

  const loadSharedData = useCallback(async () => {
    const [skills, projects, posts] = await Promise.all([
      fetchSkills(),
      fetchProjects(),
      fetchPosts({ includeHidden: true }),
    ])

    setSharedSkills(Array.isArray(skills) ? skills : [])
    setSharedProjects(Array.isArray(projects) ? projects : [])
    setSharedPosts(Array.isArray(posts) ? posts : [])
  }, [])

  useEffect(() => {
    let mounted = true

    const load = async () => {
      setLoading(true)
      try {
        const [state] = await Promise.all([
          fetchLuciferState(),
          loadSharedData(),
        ])

        if (!mounted) return
        setPrivateState(normalizeLuciferState(state))
      } catch {
        if (!mounted) return
        setPrivateState(loadLuciferStateLocal())
      } finally {
        if (mounted) setLoading(false)
      }
    }

    load()

    return () => {
      mounted = false
    }
  }, [loadSharedData])

  const persistState = useCallback(async (nextState) => {
    const saved = await saveLuciferState(nextState)
    setPrivateState(saved)
    return saved
  }, [])

  const saveCollectionItem = useCallback(async (collectionName, item) => {
    const nextState = upsertCollectionItem(privateState, collectionName, item)
    return persistState(nextState)
  }, [persistState, privateState])

  const removeCollectionItem = useCallback(async (collectionName, itemId) => {
    const nextState = deleteCollectionItem(privateState, collectionName, itemId)
    return persistState(nextState)
  }, [persistState, privateState])

  const saveEntityMeta = useCallback(async (entityName, entityId, values) => {
    const nextState = upsertEntityMeta(privateState, entityName, entityId, values)
    return persistState(nextState)
  }, [persistState, privateState])

  const quickAddSkill = useCallback(async ({ id, name, category, level, notes }) => {
    const skill = {
      id,
      name,
      category,
      bucket: 'tools',
      level: level || 'Learning',
      order: sharedSkills.length,
      subSkills: [],
    }

    await createSkill(skill)
    await loadSharedData()
    await saveEntityMeta('skillMeta', id, {
      privateNotes: notes || '',
      progress: level === 'Advanced' ? 90 : level === 'Intermediate' ? 65 : 35,
      focus: 'active',
    })
  }, [loadSharedData, saveEntityMeta, sharedSkills.length])

  const quickAddPost = useCallback(async ({ title, excerpt }) => {
    const postId = `personal-${Date.now()}`
    await createPost({
      id: postId,
      title,
      excerpt,
      content: excerpt,
      source: 'manual',
      type: 'personal',
      visible: false,
      published_at: new Date().toISOString(),
    })
    await loadSharedData()
    return postId
  }, [loadSharedData])

  const markLearningDay = useCallback(async (values) => {
    return saveCollectionItem(LUCIFER_COLLECTIONS.learningLog, createLearningLogEntry(values))
  }, [saveCollectionItem])

  const logWorkout = useCallback(async (values) => {
    return saveCollectionItem(LUCIFER_COLLECTIONS.workoutLog, createWorkoutLogEntry(values))
  }, [saveCollectionItem])

  const updateDailyStatus = useCallback(async (values) => {
    return saveCollectionItem(LUCIFER_COLLECTIONS.dailyStatus, createDailyStatusEntry(values))
  }, [saveCollectionItem])

  const uploadLuciferImage = useCallback(async (file) => {
    if (!(file instanceof File)) {
      throw new Error('A valid image file is required.')
    }

    const toDataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = () => reject(new Error('Unable to read image file.'))
      reader.readAsDataURL(file)
    })

    const result = await uploadAdminImage({
      filename: file.name,
      contentType: file.type || 'image/jpeg',
      data: String(toDataUrl),
    })

    return {
      url: result?.url || '',
      key: result?.key || '',
      uploadedAt: new Date().toISOString(),
      name: file.name,
      size: file.size,
      type: file.type || 'image/jpeg',
    }
  }, [])

  const summary = useMemo(() => buildLuciferSummary(privateState, {
    skills: sharedSkills,
    projects: sharedProjects,
    posts: sharedPosts,
  }), [privateState, sharedPosts, sharedProjects, sharedSkills])

  const value = useMemo(() => ({
    loading,
    privateState,
    sharedSkills,
    sharedProjects,
    sharedPosts,
    summary,
    refreshSharedData: loadSharedData,
    saveCollectionItem,
    removeCollectionItem,
    saveSkillMeta: (skillId, values) => saveEntityMeta('skillMeta', skillId, values),
    saveProjectMeta: (projectId, values) => saveEntityMeta('projectMeta', projectId, values),
    savePostMeta: (postId, values) => saveEntityMeta('postMeta', postId, values),
    quickAddSkill,
    quickAddPost,
    markLearningDay,
    logWorkout,
    updateDailyStatus,
    uploadLuciferImage,
  }), [
    loadSharedData,
    loading,
    logWorkout,
    markLearningDay,
    privateState,
    quickAddPost,
    quickAddSkill,
    removeCollectionItem,
    saveCollectionItem,
    saveEntityMeta,
    sharedPosts,
    sharedProjects,
    sharedSkills,
    summary,
    uploadLuciferImage,
    updateDailyStatus,
  ])

  return (
    <LuciferContext.Provider value={value}>
      {children}
    </LuciferContext.Provider>
  )
}
