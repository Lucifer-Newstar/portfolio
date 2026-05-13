const STORAGE_KEY = 'portfolio-lucifer-private-state-v1'

export const LUCIFER_COLLECTIONS = {
  learningLog: 'learningLog',
  certProgress: 'certProgress',
  studyNotes: 'studyNotes',
  resources: 'resources',
  workoutLog: 'workoutLog',
  calisthenicsProgress: 'calisthenicsProgress',
  bodyStats: 'bodyStats',
  fitnessProfiles: 'fitnessProfiles',
  nutritionLog: 'nutritionLog',
  cardioLog: 'cardioLog',
  flexibilityLog: 'flexibilityLog',
  vitalsLog: 'vitalsLog',
  goals: 'goals',
  dailyStatus: 'dailyStatus',
  hobbyItems: 'hobbyItems',
  personalProjects: 'personalProjects',
}

export const WORKOUT_PR_METRICS = {
  weight: 'weight',
  reps: 'reps',
  time: 'time',
  distance: 'distance',
  volume: 'volume',
}

function isoNow() {
  return new Date().toISOString()
}

function toDateKey(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toISOString().slice(0, 10)
}

function createId(prefix) {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}-${crypto.randomUUID()}`
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 10)}`
}

export function createEmptyLuciferState() {
  return {
    version: 1,
    updatedAt: isoNow(),
    learningLog: [],
    certProgress: [],
    studyNotes: [],
    resources: [],
    workoutLog: [],
    calisthenicsProgress: [],
    bodyStats: [],
    fitnessProfiles: [],
    nutritionLog: [],
    cardioLog: [],
    flexibilityLog: [],
    vitalsLog: [],
    goals: [],
    dailyStatus: [],
    hobbyItems: [],
    personalProjects: [],
    skillMeta: {},
    projectMeta: {},
    postMeta: {},
  }
}

export function normalizeLuciferState(rawState) {
  const base = createEmptyLuciferState()
  if (!rawState || typeof rawState !== 'object' || Array.isArray(rawState)) return base

  return {
    ...base,
    ...rawState,
    learningLog: Array.isArray(rawState.learningLog) ? rawState.learningLog : base.learningLog,
    certProgress: Array.isArray(rawState.certProgress) ? rawState.certProgress : base.certProgress,
    studyNotes: Array.isArray(rawState.studyNotes) ? rawState.studyNotes : base.studyNotes,
    resources: Array.isArray(rawState.resources) ? rawState.resources : base.resources,
    workoutLog: Array.isArray(rawState.workoutLog) ? rawState.workoutLog : base.workoutLog,
    calisthenicsProgress: Array.isArray(rawState.calisthenicsProgress) ? rawState.calisthenicsProgress : base.calisthenicsProgress,
    bodyStats: Array.isArray(rawState.bodyStats) ? rawState.bodyStats : base.bodyStats,
    fitnessProfiles: Array.isArray(rawState.fitnessProfiles) ? rawState.fitnessProfiles : base.fitnessProfiles,
    nutritionLog: Array.isArray(rawState.nutritionLog) ? rawState.nutritionLog : base.nutritionLog,
    cardioLog: Array.isArray(rawState.cardioLog) ? rawState.cardioLog : base.cardioLog,
    flexibilityLog: Array.isArray(rawState.flexibilityLog) ? rawState.flexibilityLog : base.flexibilityLog,
    vitalsLog: Array.isArray(rawState.vitalsLog) ? rawState.vitalsLog : base.vitalsLog,
    goals: Array.isArray(rawState.goals) ? rawState.goals : base.goals,
    dailyStatus: Array.isArray(rawState.dailyStatus) ? rawState.dailyStatus : base.dailyStatus,
    hobbyItems: Array.isArray(rawState.hobbyItems) ? rawState.hobbyItems : base.hobbyItems,
    personalProjects: Array.isArray(rawState.personalProjects) ? rawState.personalProjects : base.personalProjects,
    skillMeta: rawState.skillMeta && typeof rawState.skillMeta === 'object' ? rawState.skillMeta : base.skillMeta,
    projectMeta: rawState.projectMeta && typeof rawState.projectMeta === 'object' ? rawState.projectMeta : base.projectMeta,
    postMeta: rawState.postMeta && typeof rawState.postMeta === 'object' ? rawState.postMeta : base.postMeta,
  }
}

export function loadLuciferStateLocal() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return normalizeLuciferState(raw ? JSON.parse(raw) : null)
  } catch {
    return createEmptyLuciferState()
  }
}

export function saveLuciferStateLocal(state) {
  const nextState = normalizeLuciferState({
    ...state,
    updatedAt: isoNow(),
  })
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState))
  return nextState
}

export function upsertCollectionItem(state, collectionName, item) {
  const nextState = normalizeLuciferState(state)
  const existing = Array.isArray(nextState[collectionName]) ? nextState[collectionName] : []
  const payload = {
    ...item,
    id: item?.id || createId(collectionName),
    updatedAt: isoNow(),
  }
  const index = existing.findIndex((entry) => entry.id === payload.id)
  const updatedCollection = index >= 0
    ? existing.map((entry) => (entry.id === payload.id ? payload : entry))
    : [payload, ...existing]

  return {
    ...nextState,
    updatedAt: isoNow(),
    [collectionName]: updatedCollection,
  }
}

export function mergeCollectionItems(state, collectionName, items = []) {
  return items.reduce(
    (nextState, item) => upsertCollectionItem(nextState, collectionName, item),
    normalizeLuciferState(state)
  )
}

export function deleteCollectionItem(state, collectionName, itemId) {
  const nextState = normalizeLuciferState(state)
  return {
    ...nextState,
    updatedAt: isoNow(),
    [collectionName]: (nextState[collectionName] || []).filter((entry) => entry.id !== itemId),
  }
}

export function upsertEntityMeta(state, entityName, entityId, values) {
  const nextState = normalizeLuciferState(state)
  const current = nextState[entityName]?.[entityId] || {}
  return {
    ...nextState,
    updatedAt: isoNow(),
    [entityName]: {
      ...(nextState[entityName] || {}),
      [entityId]: {
        ...current,
        ...values,
        updatedAt: isoNow(),
      },
    },
  }
}

export function computeLearningStreak(learningLog = []) {
  const uniqueDates = [...new Set(learningLog.map((entry) => toDateKey(entry.date)).filter(Boolean))]
    .sort()

  if (!uniqueDates.length) return 0

  let streak = 0
  let pointer = new Date()
  pointer.setUTCHours(0, 0, 0, 0)

  const todayKey = toDateKey(pointer.toISOString())
  const latestKey = uniqueDates[uniqueDates.length - 1]

  if (latestKey !== todayKey) {
    const yesterday = new Date(pointer)
    yesterday.setUTCDate(yesterday.getUTCDate() - 1)
    if (latestKey !== toDateKey(yesterday.toISOString())) {
      return 0
    }
  }

  const dateSet = new Set(uniqueDates)
  while (dateSet.has(toDateKey(pointer.toISOString()))) {
    streak += 1
    pointer.setUTCDate(pointer.getUTCDate() - 1)
  }

  return streak
}

export function buildWorkoutPrs(workoutLog = []) {
  const grouped = workoutLog.reduce((acc, entry) => {
    const exercise = (entry.exercise || '').trim()
    if (!exercise) return acc

    const weight = Number(entry.weight || 0)
    const reps = Number(entry.reps || 0)
    const sets = Number(entry.sets || 0)
    const durationSeconds = Number(entry.durationSeconds || 0)
    const distance = Number(entry.distance || 0)
    const estimatedOneRepMax = weight > 0 && reps > 0 ? weight * (1 + (reps / 30)) : 0
    const explicitMetric = entry.prMetric || (weight > 0 ? WORKOUT_PR_METRICS.weight : reps > 0 ? WORKOUT_PR_METRICS.reps : durationSeconds > 0 ? WORKOUT_PR_METRICS.time : distance > 0 ? WORKOUT_PR_METRICS.distance : WORKOUT_PR_METRICS.volume)
    const score = explicitMetric === WORKOUT_PR_METRICS.weight
      ? Math.max(weight, estimatedOneRepMax)
      : explicitMetric === WORKOUT_PR_METRICS.time
        ? durationSeconds
        : explicitMetric === WORKOUT_PR_METRICS.distance
          ? distance
          : explicitMetric === WORKOUT_PR_METRICS.reps
            ? reps
            : sets * reps * Math.max(weight, 1)

    const current = acc[exercise]
    if (!current || score > current.score) {
      acc[exercise] = {
        exercise,
        score,
        prMetric: explicitMetric,
        weight,
        reps,
        sets,
        durationSeconds,
        distance,
        estimatedOneRepMax,
        date: entry.date || entry.updatedAt || isoNow(),
      }
    }

    return acc
  }, {})

  return Object.values(grouped).sort((left, right) => right.score - left.score)
}

function sortByLoggedDate(entries = []) {
  return [...entries].sort((left, right) => String(right.date || right.updatedAt || '').localeCompare(String(left.date || left.updatedAt || '')))
}

function getLatestEntry(entries = []) {
  return sortByLoggedDate(entries)[0] || null
}

export function calculateBmi(weightKg, heightCm) {
  const weight = Number(weightKg || 0)
  const height = Number(heightCm || 0)
  if (weight <= 0 || height <= 0) return 0
  const heightMeters = height / 100
  return weight / (heightMeters * heightMeters)
}

export function getBmiCategory(bmi) {
  if (!bmi) return 'Not enough data'
  if (bmi < 18.5) return 'Underweight'
  if (bmi < 25) return 'Healthy'
  if (bmi < 30) return 'Overweight'
  return 'Obese'
}

const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  athlete: 1.9,
}

const GOAL_CALORIE_ADJUSTMENTS = {
  cut: -450,
  maintain: 0,
  lean_bulk: 250,
  bulk: 400,
  recomposition: -100,
}

export function calculateDailyCaloriesRequired(profile = {}, bodyEntry = {}) {
  const safeProfile = profile && typeof profile === 'object' ? profile : {}
  const safeBodyEntry = bodyEntry && typeof bodyEntry === 'object' ? bodyEntry : {}
  const weightKg = Number(safeBodyEntry.weight || 0)
  const heightCm = Number(safeProfile.heightCm || 0)
  const age = Number(safeProfile.age || 0)
  const sex = String(safeProfile.sex || 'male').toLowerCase()
  if (weightKg <= 0 || heightCm <= 0 || age <= 0) return 0

  const baseBmr = 10 * weightKg + 6.25 * heightCm - 5 * age
  const sexAdjustment = sex === 'female' ? -161 : 5
  const bmr = baseBmr + sexAdjustment
  const activityMultiplier = ACTIVITY_MULTIPLIERS[safeProfile.activityLevel] || ACTIVITY_MULTIPLIERS.moderate
  const goalAdjustment = GOAL_CALORIE_ADJUSTMENTS[safeProfile.goal] || 0
  return Math.max(1200, Math.round((bmr * activityMultiplier) + goalAdjustment))
}

function groupCountByDate(entries = [], field = 'date', valueSelector = () => 1, maxPoints = 7) {
  const grouped = entries.reduce((acc, entry) => {
    const key = toDateKey(entry[field] || entry.updatedAt)
    if (!key) return acc
    acc[key] = (acc[key] || 0) + valueSelector(entry)
    return acc
  }, {})

  return Object.entries(grouped)
    .sort(([left], [right]) => left.localeCompare(right))
    .slice(-maxPoints)
    .map(([date, value]) => ({ date, value }))
}

export function buildActivityHeatmap(state) {
  const activityMap = {}

  state.learningLog.forEach((entry) => {
    const key = toDateKey(entry.date)
    if (!key) return
    activityMap[key] = (activityMap[key] || 0) + 1
  })

  state.workoutLog.forEach((entry) => {
    const key = toDateKey(entry.date)
    if (!key) return
    activityMap[key] = (activityMap[key] || 0) + 1
  })

  return Object.entries(activityMap)
    .map(([date, count]) => ({ date, count }))
    .sort((left, right) => right.date.localeCompare(left.date))
    .slice(0, 90)
}

export function buildWeeklySummary(state, shared = {}) {
  const weekAgo = new Date()
  weekAgo.setUTCDate(weekAgo.getUTCDate() - 6)
  const threshold = toDateKey(weekAgo.toISOString())

  const learningDays = new Set(
    state.learningLog
      .map((entry) => toDateKey(entry.date))
      .filter((date) => date && date >= threshold)
  ).size

  const workouts = state.workoutLog.filter((entry) => toDateKey(entry.date) >= threshold)
  const books = state.hobbyItems.filter((item) => item.type === 'reading' && toDateKey(item.updatedAt || item.date) >= threshold)

  return {
    learningDays,
    workouts: workouts.length,
    booksCompleted: books.filter((item) => item.status === 'completed').length,
    skillsTracked: Array.isArray(shared.skills) ? shared.skills.length : 0,
  }
}

export function buildLuciferSummary(state, shared = {}) {
  const normalized = normalizeLuciferState(state)
  const weekly = buildWeeklySummary(normalized, shared)
  const workoutPrs = buildWorkoutPrs(normalized.workoutLog)
  const heatmap = buildActivityHeatmap(normalized)
  const latestBodyEntry = getLatestEntry(normalized.bodyStats)
  const latestFitnessProfile = getLatestEntry(normalized.fitnessProfiles)
  const latestVitals = getLatestEntry(normalized.vitalsLog)
  const latestNutrition = getLatestEntry(normalized.nutritionLog)
  const latestCardio = getLatestEntry(normalized.cardioLog)
  const latestFlexibility = getLatestEntry(normalized.flexibilityLog)
  const bmi = calculateBmi(latestBodyEntry?.weight, latestFitnessProfile?.heightCm)
  const caloriesRequired = calculateDailyCaloriesRequired(latestFitnessProfile, latestBodyEntry)
  const workoutVolume = normalized.workoutLog.reduce((sum, entry) => {
    const sets = Number(entry.sets || 0)
    const reps = Number(entry.reps || 0)
    const weight = Number(entry.weight || 0)
    return sum + (sets * reps * Math.max(weight, 1))
  }, 0)
  const caloriesConsumed = normalized.nutritionLog
    .filter((entry) => toDateKey(entry.date) === toDateKey(isoNow()))
    .reduce((sum, entry) => sum + Number(entry.calories || 0), 0)
  const weeklyCardioMinutes = normalized.cardioLog
    .filter((entry) => toDateKey(entry.date) >= toDateKey(new Date(Date.now() - (6 * 24 * 60 * 60 * 1000)).toISOString()))
    .reduce((sum, entry) => sum + Number(entry.durationMinutes || 0), 0)
  const weeklyMobilityMinutes = normalized.flexibilityLog
    .filter((entry) => toDateKey(entry.date) >= toDateKey(new Date(Date.now() - (6 * 24 * 60 * 60 * 1000)).toISOString()))
    .reduce((sum, entry) => sum + Number(entry.durationMinutes || 0), 0)

  return {
    generatedAt: isoNow(),
    currentStreak: computeLearningStreak(normalized.learningLog),
    weeklySummary: weekly,
    quickStats: {
      totalSkills: Array.isArray(shared.skills) ? shared.skills.length : 0,
      totalProjects: Array.isArray(shared.projects) ? shared.projects.length : 0,
      totalPosts: Array.isArray(shared.posts) ? shared.posts.length : 0,
      certificationsTracked: normalized.certProgress.length,
      workoutsLogged: normalized.workoutLog.length,
      cardioSessionsLogged: normalized.cardioLog.length,
      flexibilitySessionsLogged: normalized.flexibilityLog.length,
      nutritionEntriesLogged: normalized.nutritionLog.length,
      vitalsLogged: normalized.vitalsLog.length,
      hobbiesTracked: normalized.hobbyItems.length,
    },
    workout: {
      prs: workoutPrs.slice(0, 6),
      weeklyVolume: workoutVolume,
      workoutsThisWeek: weekly.workouts,
      latestBodyEntry,
      latestFitnessProfile,
      currentBmi: bmi ? Number(bmi.toFixed(1)) : 0,
      bmiCategory: getBmiCategory(bmi),
      dailyCaloriesRequired: caloriesRequired,
      dailyCaloriesConsumed: caloriesConsumed,
      weeklyCardioMinutes,
      weeklyMobilityMinutes,
      latestVitals,
      latestNutrition,
      latestCardio,
      latestFlexibility,
      charts: {
        weightTrend: sortByLoggedDate(normalized.bodyStats)
          .slice(0, 6)
          .reverse()
          .map((entry) => ({ date: toDateKey(entry.date || entry.updatedAt), value: Number(entry.weight || 0) }))
          .filter((entry) => entry.date && entry.value > 0),
        caloriesTrend: groupCountByDate(normalized.nutritionLog, 'date', (entry) => Number(entry.calories || 0), 7),
        cardioTrend: groupCountByDate(normalized.cardioLog, 'date', (entry) => Number(entry.durationMinutes || 0), 7),
        flexibilityTrend: groupCountByDate(normalized.flexibilityLog, 'date', (entry) => Number(entry.durationMinutes || 0), 7),
      },
    },
    heatmap,
    latestStatus: normalized.dailyStatus[0] || null,
  }
}

export function createLearningLogEntry(values = {}) {
  return {
    id: values.id || createId('learning'),
    date: values.date || isoNow(),
    title: values.title || '',
    skillId: values.skillId || '',
    minutes: Number(values.minutes || 0),
    notes: values.notes || '',
  }
}

export function createWorkoutLogEntry(values = {}) {
  return {
    id: values.id || createId('workout'),
    date: values.date || isoNow(),
    exerciseId: values.exerciseId || '',
    exercise: values.exercise || '',
    category: values.category || 'strength',
    sets: Number(values.sets || 0),
    reps: Number(values.reps || 0),
    weight: Number(values.weight || 0),
    unit: values.unit || 'kg',
    durationSeconds: Number(values.durationSeconds || 0),
    distance: Number(values.distance || 0),
    distanceUnit: values.distanceUnit || 'm',
    rpe: Number(values.rpe || 0),
    rir: Number(values.rir || 0),
    bodyPart: values.bodyPart || '',
    muscles: Array.isArray(values.muscles) ? values.muscles : [],
    prMetric: values.prMetric || '',
    notes: values.notes || '',
  }
}

export function createDailyStatusEntry(values = {}) {
  return {
    id: values.id || createId('status'),
    date: values.date || isoNow(),
    focus: values.focus || '',
    mood: values.mood || '',
    summary: values.summary || '',
  }
}
