import { useMemo, useState } from 'react'
import { Navigate } from 'react-router-dom'
import LuciferPageFrame from '../../components/admin/LuciferPageFrame'
import { useLuciferSubpage } from '../../components/admin/luciferSubpages'
import { BODY_MEASUREMENT_FIELDS, EXERCISE_GROUPS, EXERCISE_LIBRARY, getExercisesByMuscle } from '../../data/luciferExerciseData'
import { useLucifer } from '../../context/useLucifer'
import { LUCIFER_COLLECTIONS } from '../../utils/luciferData'

const ACTIVITY_OPTIONS = [
  { value: 'sedentary', label: 'Sedentary' },
  { value: 'light', label: 'Lightly active' },
  { value: 'moderate', label: 'Moderately active' },
  { value: 'active', label: 'Very active' },
  { value: 'athlete', label: 'Athlete' },
]

const GOAL_OPTIONS = [
  { value: 'cut', label: 'Fat loss' },
  { value: 'maintain', label: 'Maintain' },
  { value: 'recomposition', label: 'Recomp' },
  { value: 'lean_bulk', label: 'Lean bulk' },
  { value: 'bulk', label: 'Bulk' },
]

function formatNumber(value, suffix = '') {
  const numeric = Number(value || 0)
  if (!numeric) return '-'
  return `${numeric}${suffix}`
}

function formatDate(value) {
  if (!value) return 'No date'
  return String(value).slice(0, 10)
}

function formatWorkoutHeadline(entry) {
  if (!entry) return 'No sessions logged yet'
  if (Number(entry.weight || 0) > 0) return `${entry.sets} x ${entry.reps} @ ${entry.weight}${entry.unit || 'kg'}`
  if (Number(entry.durationSeconds || 0) > 0) return `${entry.durationSeconds}s effort`
  if (Number(entry.distance || 0) > 0) return `${entry.distance}${entry.distanceUnit || 'm'} tracked`
  return `${entry.sets} sets • ${entry.reps} reps`
}

function buildLinePath(points = []) {
  if (!points.length) return ''
  const values = points.map((point) => Number(point.value || 0))
  const max = Math.max(...values, 1)
  const min = Math.min(...values, 0)
  const range = Math.max(max - min, 1)
  return points.map((point, index) => {
    const x = points.length === 1 ? 50 : (index / (points.length - 1)) * 100
    const y = 100 - (((Number(point.value || 0) - min) / range) * 100)
    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
  }).join(' ')
}

function MiniTrendChart({ title, points = [], unit = '', accent = 'var(--primary)' }) {
  const path = buildLinePath(points)

  return (
    <article className="lucifer-chart-card">
      <div className="lucifer-chart-head">
        <strong>{title}</strong>
        <span>{points.length ? `${points[points.length - 1].value}${unit}` : 'No data yet'}</span>
      </div>
      <div className="lucifer-chart-shell">
        {points.length ? (
          <svg viewBox="0 0 100 100" className="lucifer-trend-chart" preserveAspectRatio="none" aria-hidden="true">
            <path d={path} fill="none" stroke={accent} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <div className="lucifer-chart-empty">Log a few entries to light this chart up.</div>
        )}
      </div>
      <div className="lucifer-chart-labels">
        {points.slice(-3).map((point) => (
          <span key={`${title}-${point.date}`}>{point.date?.slice(5) || '--'}: {point.value}{unit}</span>
        ))}
      </div>
    </article>
  )
}

function ProgressMeter({ label, value, target, tone = 'var(--primary)' }) {
  const numericValue = Number(value || 0)
  const numericTarget = Math.max(Number(target || 0), 1)
  const percentage = Math.max(0, Math.min(100, Math.round((numericValue / numericTarget) * 100)))

  return (
    <article className="lucifer-progress-card">
      <div className="lucifer-progress-head">
        <strong>{label}</strong>
        <span>{numericValue} / {numericTarget}</span>
      </div>
      <div className="lucifer-progress-track">
        <span className="lucifer-progress-fill" style={{ width: `${percentage}%`, '--progress-tone': tone }} />
      </div>
      <small>{percentage}% complete</small>
    </article>
  )
}

function LuciferWorkouts() {
  const { privateState, summary, saveCollectionItem, removeCollectionItem, uploadLuciferImage } = useLucifer()
  const [bodyStatsForm, setBodyStatsForm] = useState({
    date: '',
    weight: '',
    bodyFat: '',
    waist: '',
    chest: '',
    arms: '',
    thighs: '',
    calves: '',
    shoulders: '',
    neck: '',
    wrists: '',
    forearms: '',
    notes: '',
  })
  const [measurementPhotos, setMeasurementPhotos] = useState([])
  const [measurementState, setMeasurementState] = useState('idle')
  const [fitnessProfileForm, setFitnessProfileForm] = useState({
    date: '',
    heightCm: '',
    age: '',
    sex: 'male',
    activityLevel: 'moderate',
    goal: 'maintain',
    goalWeight: '',
    notes: '',
  })
  const [nutritionForm, setNutritionForm] = useState({
    date: '',
    meal: '',
    calories: '',
    protein: '',
    carbs: '',
    fats: '',
    fiber: '',
    vitamins: '',
    otherNutrients: '',
    waterLiters: '',
    notes: '',
  })
  const [cardioForm, setCardioForm] = useState({
    date: '',
    activity: '',
    durationMinutes: '',
    distance: '',
    distanceUnit: 'km',
    intensity: 'moderate',
    avgHeartRate: '',
    caloriesBurned: '',
    notes: '',
  })
  const [flexibilityForm, setFlexibilityForm] = useState({
    date: '',
    focusArea: '',
    routine: '',
    durationMinutes: '',
    mobilityScore: '',
    improvementPercent: '',
    notes: '',
  })
  const [vitalsForm, setVitalsForm] = useState({
    date: '',
    restingHeartRate: '',
    maxHeartRate: '',
    heartRateVariability: '',
    bloodPressureSystolic: '',
    bloodPressureDiastolic: '',
    spo2: '',
    restingRespiratoryRate: '',
    bodyTemp: '',
    sleepHours: '',
    hydrationLiters: '',
    notes: '',
  })
  const [calisthenicsForm, setCalisthenicsForm] = useState({ skill: '', status: 'learning', progress: 0, notes: '' })
  const [selectedExerciseId, setSelectedExerciseId] = useState(EXERCISE_LIBRARY[0]?.id || '')
  const [selectedMuscleId, setSelectedMuscleId] = useState('')
  const [exerciseSearch, setExerciseSearch] = useState('')
  const [exerciseBodyPartFilter, setExerciseBodyPartFilter] = useState('all')
  const [exerciseTypeFilter, setExerciseTypeFilter] = useState('all')
  const [workoutLogForm, setWorkoutLogForm] = useState({
    date: '',
    exerciseId: EXERCISE_LIBRARY[0]?.id || '',
    exercise: EXERCISE_LIBRARY[0]?.name || '',
    category: EXERCISE_LIBRARY[0]?.type || 'strength',
    sets: 3,
    reps: 8,
    weight: 0,
    durationSeconds: 0,
    distance: 0,
    distanceUnit: 'm',
    rpe: 8,
    rir: 2,
    prMetric: EXERCISE_LIBRARY[0]?.prFocus || 'weight',
    notes: '',
  })

  const selectedExercise = useMemo(
    () => EXERCISE_LIBRARY.find((entry) => entry.id === selectedExerciseId) || EXERCISE_LIBRARY[0],
    [selectedExerciseId]
  )
  const filteredExercises = useMemo(() => {
    const query = exerciseSearch.trim().toLowerCase()
    return EXERCISE_LIBRARY.filter((exercise) => {
      const matchesQuery = !query || exercise.name.toLowerCase().includes(query)
      const matchesBodyPart = exerciseBodyPartFilter === 'all' || exercise.bodyPart === exerciseBodyPartFilter
      const matchesType = exerciseTypeFilter === 'all' || exercise.type === exerciseTypeFilter
      const matchesMuscle = !selectedMuscleId || exercise.muscles.includes(selectedMuscleId)
      return matchesQuery && matchesBodyPart && matchesType && matchesMuscle
    })
  }, [exerciseBodyPartFilter, exerciseSearch, exerciseTypeFilter, selectedMuscleId])

  const sections = [
    { id: 'strength-signal', label: 'Strength signal', detail: 'PRs, BMI, calorie targets, and current status' },
    { id: 'body-lab', label: 'Body lab', detail: 'Body stats, profile setup, and progress photos' },
    { id: 'nutrition-vitals', label: 'Nutrition + vitals', detail: 'Calories, macros, nutrients, heart rate, and rates' },
    { id: 'cardio-mobility', label: 'Cardio + mobility', detail: 'Conditioning and flexibility tracking' },
    { id: 'charts-progress', label: 'Charts + progress', detail: 'Trend cards and weekly trackers' },
    { id: 'workout-logbook', label: 'Workout logbook', detail: 'Detailed sessions and skill progress' },
    { id: 'exercise-lists', label: 'Exercise lists', detail: 'Body-part libraries and muscle links' },
  ]
  const { activeSectionId, sections: subpageSections, shouldRedirect, redirectPath } = useLuciferSubpage(
    sections,
    '/lucifer-newstar_dashboard/lucifer/workouts'
  )

  if (shouldRedirect) {
    return <Navigate to={redirectPath} replace />
  }

  const metrics = [
    { label: 'Workout sessions', value: summary.workout.workoutsThisWeek },
    { label: 'BMI', value: summary.workout.currentBmi || '-' },
    { label: 'Calories target', value: summary.workout.dailyCaloriesRequired || '-' },
    { label: 'Weekly cardio min', value: summary.workout.weeklyCardioMinutes || 0 },
  ]

  const bodyEntries = [...privateState.bodyStats].sort((left, right) => String(right.date || right.updatedAt).localeCompare(String(left.date || left.updatedAt)))
  const recentWorkouts = [...privateState.workoutLog].sort((left, right) => String(right.date || right.updatedAt).localeCompare(String(left.date || left.updatedAt)))
  const nutritionEntries = [...privateState.nutritionLog].sort((left, right) => String(right.date || right.updatedAt).localeCompare(String(left.date || left.updatedAt)))
  const cardioEntries = [...privateState.cardioLog].sort((left, right) => String(right.date || right.updatedAt).localeCompare(String(left.date || left.updatedAt)))
  const flexibilityEntries = [...privateState.flexibilityLog].sort((left, right) => String(right.date || right.updatedAt).localeCompare(String(left.date || left.updatedAt)))
  const vitalEntries = [...privateState.vitalsLog].sort((left, right) => String(right.date || right.updatedAt).localeCompare(String(left.date || left.updatedAt)))
  const fitnessProfiles = [...privateState.fitnessProfiles].sort((left, right) => String(right.date || right.updatedAt).localeCompare(String(left.date || left.updatedAt)))
  const selectedMuscleExercises = selectedMuscleId ? getExercisesByMuscle(selectedMuscleId) : []
  const recentWorkoutVolume = recentWorkouts.slice(0, 8).reduce((sum, entry) => (
    sum + (Number(entry.sets || 0) * Number(entry.reps || 0) * Math.max(Number(entry.weight || 0), 1))
  ), 0)
  const recentAverageRpe = recentWorkouts.length
    ? (recentWorkouts.slice(0, 8).reduce((sum, entry) => sum + Number(entry.rpe || 0), 0) / Math.max(recentWorkouts.slice(0, 8).length, 1)).toFixed(1)
    : null
  const recentCategoryBreakdown = recentWorkouts.slice(0, 8).reduce((acc, entry) => {
    const key = entry.category || 'strength'
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {})
  const dominantCategory = Object.entries(recentCategoryBreakdown).sort((left, right) => right[1] - left[1])[0]?.[0] || 'strength'
  const selectedExerciseRecent = recentWorkouts.find((entry) => entry.exerciseId === selectedExerciseId || entry.exercise === selectedExercise?.name)
  const calisthenicsEntries = [...privateState.calisthenicsProgress].sort((left, right) => String(right.updatedAt || '').localeCompare(String(left.updatedAt || '')))

  const todayCaloriesDelta = (summary.workout.dailyCaloriesConsumed || 0) - (summary.workout.dailyCaloriesRequired || 0)
  const targetWeight = Number(summary.workout.latestFitnessProfile?.goalWeight || 0)
  const latestWeight = Number(summary.workout.latestBodyEntry?.weight || 0)
  const weightGap = targetWeight > 0 && latestWeight > 0 ? Math.abs(targetWeight - latestWeight) : 0
  const weightTargetProgress = targetWeight > 0 && latestWeight > 0
    ? Math.max(0, 100 - Math.min(100, Math.round((weightGap / Math.max(targetWeight, latestWeight)) * 100)))
    : 0
  const cardioMinutesTarget = 150
  const mobilityMinutesTarget = 90

  const syncExercise = (exerciseId) => {
    const exercise = EXERCISE_LIBRARY.find((entry) => entry.id === exerciseId)
    if (!exercise) return
    setSelectedExerciseId(exercise.id)
    setWorkoutLogForm((current) => ({
      ...current,
      exerciseId: exercise.id,
      exercise: exercise.name,
      category: exercise.type,
      prMetric: exercise.prFocus,
    }))
  }

  return (
    <LuciferPageFrame
      eyebrow="Workout tracker"
      title="Training, recovery, nutrition, and bio-signal tracking in one Lucifer lab."
      lead="This workout zone now handles BMI, calorie intake versus requirement, cardio, flexibility, heart rate and related vitals, plus progress visuals so you can log and review everything from the site."
      sections={subpageSections}
      metrics={metrics}
      heroVisual={(
        <div className="lucifer-workout-hero-visual">
          <div className="lucifer-hero-chip"><strong>{summary.workout.currentBmi || '-'}</strong><span>BMI • {summary.workout.bmiCategory}</span></div>
          <div className="lucifer-hero-chip"><strong>{summary.workout.dailyCaloriesRequired || '-'}</strong><span>calories required</span></div>
          <div className="lucifer-hero-chip"><strong>{summary.workout.dailyCaloriesConsumed || 0}</strong><span>calories consumed today</span></div>
          <div className="lucifer-hero-chip"><strong>{summary.workout.latestVitals?.restingHeartRate || '-'}</strong><span>resting heart rate</span></div>
        </div>
      )}
    >
      {activeSectionId === 'strength-signal' ? (
      <section id="strength-signal" className="private-two-column">
        <article className="private-card lucifer-section-panel">
          <h3>Core training signals</h3>
          <div className="lucifer-insight-grid">
            <div className="lucifer-insight-card">
              <span className="eyebrow">BMI</span>
              <strong>{summary.workout.currentBmi || '-'}</strong>
              <p>{summary.workout.bmiCategory}</p>
            </div>
            <div className="lucifer-insight-card">
              <span className="eyebrow">Goal</span>
              <strong>{summary.workout.latestFitnessProfile?.goal?.replace('_', ' ') || 'Not set'}</strong>
              <p>Target weight: {formatNumber(summary.workout.latestFitnessProfile?.goalWeight, ' kg')}</p>
            </div>
            <div className="lucifer-insight-card">
              <span className="eyebrow">Calories</span>
              <strong>{summary.workout.dailyCaloriesRequired || '-'}</strong>
              <p>Consumed today: {summary.workout.dailyCaloriesConsumed || 0}</p>
            </div>
            <div className="lucifer-insight-card">
              <span className="eyebrow">Rates</span>
              <strong>{summary.workout.latestVitals?.restingHeartRate || '-'}</strong>
              <p>SpO2 {formatNumber(summary.workout.latestVitals?.spo2, '%')} • BP {summary.workout.latestVitals?.bloodPressureSystolic || '-'} / {summary.workout.latestVitals?.bloodPressureDiastolic || '-'}</p>
            </div>
          </div>

          <div className="detail-list">
            <p>Calorie delta today: {todayCaloriesDelta > 0 ? `+${todayCaloriesDelta}` : todayCaloriesDelta} kcal.</p>
            <p>Weekly cardio minutes: {summary.workout.weeklyCardioMinutes || 0} / {cardioMinutesTarget}.</p>
            <p>Weekly flexibility minutes: {summary.workout.weeklyMobilityMinutes || 0} / {mobilityMinutesTarget}.</p>
          </div>
        </article>

        <article className="private-card lucifer-section-panel">
          <h3>Personal records</h3>
          <div className="detail-list">
            {summary.workout.prs.length ? summary.workout.prs.map((entry) => (
              <p key={entry.exercise}>
                {entry.exercise}: {entry.prMetric === 'time'
                  ? `${entry.durationSeconds}s`
                  : entry.prMetric === 'distance'
                    ? `${entry.distance}${entry.distanceUnit || 'm'}`
                    : entry.weight > 0
                      ? `${entry.weight} x ${entry.reps}`
                      : `${entry.reps} reps`}
              </p>
            )) : <p>No PR data yet.</p>}
          </div>
        </article>
      </section>
      ) : null}

      {activeSectionId === 'body-lab' ? (
      <section id="body-lab" className="private-two-column">
        <article className="private-card lucifer-section-panel">
          <h3>Fitness profile and BMI setup</h3>
          <form className="private-inline-form" onSubmit={async (event) => {
            event.preventDefault()
            await saveCollectionItem(LUCIFER_COLLECTIONS.fitnessProfiles, fitnessProfileForm)
            setFitnessProfileForm({
              date: '',
              heightCm: '',
              age: '',
              sex: 'male',
              activityLevel: 'moderate',
              goal: 'maintain',
              goalWeight: '',
              notes: '',
            })
          }}>
            <input type="date" value={fitnessProfileForm.date} onChange={(event) => setFitnessProfileForm({ ...fitnessProfileForm, date: event.target.value })} required />
            <div className="lucifer-measurement-grid">
              <label className="lucifer-field-stack">
                <span>Height (cm)</span>
                <input type="number" value={fitnessProfileForm.heightCm} onChange={(event) => setFitnessProfileForm({ ...fitnessProfileForm, heightCm: event.target.value })} required />
              </label>
              <label className="lucifer-field-stack">
                <span>Age</span>
                <input type="number" value={fitnessProfileForm.age} onChange={(event) => setFitnessProfileForm({ ...fitnessProfileForm, age: event.target.value })} required />
              </label>
              <label className="lucifer-field-stack">
                <span>Sex</span>
                <select value={fitnessProfileForm.sex} onChange={(event) => setFitnessProfileForm({ ...fitnessProfileForm, sex: event.target.value })}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </label>
              <label className="lucifer-field-stack">
                <span>Activity level</span>
                <select value={fitnessProfileForm.activityLevel} onChange={(event) => setFitnessProfileForm({ ...fitnessProfileForm, activityLevel: event.target.value })}>
                  {ACTIVITY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </label>
              <label className="lucifer-field-stack">
                <span>Goal</span>
                <select value={fitnessProfileForm.goal} onChange={(event) => setFitnessProfileForm({ ...fitnessProfileForm, goal: event.target.value })}>
                  {GOAL_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </label>
              <label className="lucifer-field-stack">
                <span>Goal weight (kg)</span>
                <input type="number" value={fitnessProfileForm.goalWeight} onChange={(event) => setFitnessProfileForm({ ...fitnessProfileForm, goalWeight: event.target.value })} />
              </label>
            </div>
            <textarea value={fitnessProfileForm.notes} onChange={(event) => setFitnessProfileForm({ ...fitnessProfileForm, notes: event.target.value })} placeholder="goal notes, timeline, or physique target" rows="3" />
            <button type="submit" className="btn btn-primary">Save profile</button>
          </form>

          <div className="detail-list">
            <p>Latest profile: {fitnessProfiles[0] ? `${fitnessProfiles[0].heightCm} cm • ${fitnessProfiles[0].activityLevel} • ${fitnessProfiles[0].goal}` : 'Not set yet.'}</p>
            <p>Calories required are generated from latest profile + latest bodyweight.</p>
          </div>
        </article>

        <article className="private-card lucifer-section-panel">
          <h3>Body measurements</h3>
          <form className="private-inline-form" onSubmit={async (event) => {
            event.preventDefault()
            setMeasurementState('uploading')
            const uploadedPhotos = []
            for (const file of measurementPhotos) {
              const uploaded = await uploadLuciferImage(file)
              uploadedPhotos.push(uploaded)
            }
            await saveCollectionItem(LUCIFER_COLLECTIONS.bodyStats, {
              ...bodyStatsForm,
              photos: uploadedPhotos,
            })
            setBodyStatsForm({
              date: '',
              weight: '',
              bodyFat: '',
              waist: '',
              chest: '',
              arms: '',
              thighs: '',
              calves: '',
              shoulders: '',
              neck: '',
              wrists: '',
              forearms: '',
              notes: '',
            })
            setMeasurementPhotos([])
            setMeasurementState('saved')
          }}>
            <input type="date" value={bodyStatsForm.date} onChange={(event) => setBodyStatsForm({ ...bodyStatsForm, date: event.target.value })} required />
            <div className="lucifer-measurement-grid">
              {BODY_MEASUREMENT_FIELDS.map((field) => (
                <label key={field.id} className="lucifer-field-stack">
                  <span>{field.label}</span>
                  <input value={bodyStatsForm[field.id]} onChange={(event) => setBodyStatsForm({ ...bodyStatsForm, [field.id]: event.target.value })} placeholder={field.unit ? `${field.label} (${field.unit})` : field.label} />
                </label>
              ))}
            </div>
            <label className="lucifer-field-stack">
              <span>Progress photos</span>
              <input type="file" accept="image/*" multiple onChange={(event) => setMeasurementPhotos(Array.from(event.target.files || []))} />
            </label>
            <textarea value={bodyStatsForm.notes} onChange={(event) => setBodyStatsForm({ ...bodyStatsForm, notes: event.target.value })} placeholder="notes" rows="3" />
            <button type="submit" className="btn btn-primary">{measurementState === 'uploading' ? 'Uploading photos...' : 'Save body stats'}</button>
          </form>
        </article>

        <article className="private-card lucifer-section-panel lucifer-span-2">
          <h3>Progress check-ins</h3>
          <div className="lucifer-photo-grid">
            {bodyEntries.slice(0, 4).map((item) => (
              <article key={item.id} className="lucifer-photo-card">
                <strong>{item.date || item.updatedAt}</strong>
                <span>Weight: {item.weight || '-'} kg | Waist: {item.waist || '-'} cm | Body fat: {item.bodyFat || '-'}%</span>
                <div className="lucifer-photo-strip">
                  {(item.photos || []).map((photo) => (
                    <img key={photo.url} src={photo.url} alt="Progress check-in" className="lucifer-progress-photo" />
                  ))}
                </div>
                <button type="button" className="btn btn-secondary" onClick={() => removeCollectionItem(LUCIFER_COLLECTIONS.bodyStats, item.id)}>Remove</button>
              </article>
            ))}
          </div>
        </article>
      </section>
      ) : null}

      {activeSectionId === 'nutrition-vitals' ? (
      <section id="nutrition-vitals" className="private-two-column">
        <article className="private-card lucifer-section-panel">
          <h3>Calories intake and nutrients</h3>
          <form className="private-inline-form" onSubmit={async (event) => {
            event.preventDefault()
            await saveCollectionItem(LUCIFER_COLLECTIONS.nutritionLog, nutritionForm)
            setNutritionForm({
              date: '',
              meal: '',
              calories: '',
              protein: '',
              carbs: '',
              fats: '',
              fiber: '',
              vitamins: '',
              otherNutrients: '',
              waterLiters: '',
              notes: '',
            })
          }}>
            <input type="date" value={nutritionForm.date} onChange={(event) => setNutritionForm({ ...nutritionForm, date: event.target.value })} required />
            <input value={nutritionForm.meal} onChange={(event) => setNutritionForm({ ...nutritionForm, meal: event.target.value })} placeholder="meal or intake block" required />
            <div className="lucifer-measurement-grid">
              <label className="lucifer-field-stack">
                <span>Calories</span>
                <input type="number" value={nutritionForm.calories} onChange={(event) => setNutritionForm({ ...nutritionForm, calories: event.target.value })} required />
              </label>
              <label className="lucifer-field-stack">
                <span>Protein (g)</span>
                <input type="number" value={nutritionForm.protein} onChange={(event) => setNutritionForm({ ...nutritionForm, protein: event.target.value })} />
              </label>
              <label className="lucifer-field-stack">
                <span>Carbs (g)</span>
                <input type="number" value={nutritionForm.carbs} onChange={(event) => setNutritionForm({ ...nutritionForm, carbs: event.target.value })} />
              </label>
              <label className="lucifer-field-stack">
                <span>Fats (g)</span>
                <input type="number" value={nutritionForm.fats} onChange={(event) => setNutritionForm({ ...nutritionForm, fats: event.target.value })} />
              </label>
              <label className="lucifer-field-stack">
                <span>Fiber (g)</span>
                <input type="number" value={nutritionForm.fiber} onChange={(event) => setNutritionForm({ ...nutritionForm, fiber: event.target.value })} />
              </label>
              <label className="lucifer-field-stack">
                <span>Water (L)</span>
                <input type="number" step="0.1" value={nutritionForm.waterLiters} onChange={(event) => setNutritionForm({ ...nutritionForm, waterLiters: event.target.value })} />
              </label>
            </div>
            <input value={nutritionForm.vitamins} onChange={(event) => setNutritionForm({ ...nutritionForm, vitamins: event.target.value })} placeholder="vitamins: D3, B12, C..." />
            <input value={nutritionForm.otherNutrients} onChange={(event) => setNutritionForm({ ...nutritionForm, otherNutrients: event.target.value })} placeholder="other nutrients: sodium, potassium, omega-3..." />
            <textarea value={nutritionForm.notes} onChange={(event) => setNutritionForm({ ...nutritionForm, notes: event.target.value })} placeholder="meal notes, digestion, or timing" rows="3" />
            <button type="submit" className="btn btn-primary">Save nutrition entry</button>
          </form>
        </article>

        <article className="private-card lucifer-section-panel">
          <h3>Heart rate and vital rates</h3>
          <form className="private-inline-form" onSubmit={async (event) => {
            event.preventDefault()
            await saveCollectionItem(LUCIFER_COLLECTIONS.vitalsLog, vitalsForm)
            setVitalsForm({
              date: '',
              restingHeartRate: '',
              maxHeartRate: '',
              heartRateVariability: '',
              bloodPressureSystolic: '',
              bloodPressureDiastolic: '',
              spo2: '',
              restingRespiratoryRate: '',
              bodyTemp: '',
              sleepHours: '',
              hydrationLiters: '',
              notes: '',
            })
          }}>
            <input type="date" value={vitalsForm.date} onChange={(event) => setVitalsForm({ ...vitalsForm, date: event.target.value })} required />
            <div className="lucifer-measurement-grid">
              <label className="lucifer-field-stack">
                <span>Resting HR</span>
                <input type="number" value={vitalsForm.restingHeartRate} onChange={(event) => setVitalsForm({ ...vitalsForm, restingHeartRate: event.target.value })} />
              </label>
              <label className="lucifer-field-stack">
                <span>Max HR</span>
                <input type="number" value={vitalsForm.maxHeartRate} onChange={(event) => setVitalsForm({ ...vitalsForm, maxHeartRate: event.target.value })} />
              </label>
              <label className="lucifer-field-stack">
                <span>HRV</span>
                <input type="number" value={vitalsForm.heartRateVariability} onChange={(event) => setVitalsForm({ ...vitalsForm, heartRateVariability: event.target.value })} />
              </label>
              <label className="lucifer-field-stack">
                <span>BP systolic</span>
                <input type="number" value={vitalsForm.bloodPressureSystolic} onChange={(event) => setVitalsForm({ ...vitalsForm, bloodPressureSystolic: event.target.value })} />
              </label>
              <label className="lucifer-field-stack">
                <span>BP diastolic</span>
                <input type="number" value={vitalsForm.bloodPressureDiastolic} onChange={(event) => setVitalsForm({ ...vitalsForm, bloodPressureDiastolic: event.target.value })} />
              </label>
              <label className="lucifer-field-stack">
                <span>SpO2 %</span>
                <input type="number" value={vitalsForm.spo2} onChange={(event) => setVitalsForm({ ...vitalsForm, spo2: event.target.value })} />
              </label>
              <label className="lucifer-field-stack">
                <span>Respiratory rate</span>
                <input type="number" value={vitalsForm.restingRespiratoryRate} onChange={(event) => setVitalsForm({ ...vitalsForm, restingRespiratoryRate: event.target.value })} />
              </label>
              <label className="lucifer-field-stack">
                <span>Body temp C</span>
                <input type="number" step="0.1" value={vitalsForm.bodyTemp} onChange={(event) => setVitalsForm({ ...vitalsForm, bodyTemp: event.target.value })} />
              </label>
              <label className="lucifer-field-stack">
                <span>Sleep hours</span>
                <input type="number" step="0.1" value={vitalsForm.sleepHours} onChange={(event) => setVitalsForm({ ...vitalsForm, sleepHours: event.target.value })} />
              </label>
            </div>
            <textarea value={vitalsForm.notes} onChange={(event) => setVitalsForm({ ...vitalsForm, notes: event.target.value })} placeholder="recovery notes, stress, caffeine, symptoms" rows="3" />
            <button type="submit" className="btn btn-primary">Save vitals</button>
          </form>
        </article>

        <article className="private-card lucifer-section-panel lucifer-span-2">
          <h3>Latest intake and vitals log</h3>
          <div className="private-two-column">
            <div className="detail-list">
              {nutritionEntries.slice(0, 5).map((entry) => (
                <p key={entry.id}>
                  {formatDate(entry.date)} • {entry.meal}: {entry.calories || 0} kcal | P {entry.protein || 0} | C {entry.carbs || 0} | F {entry.fats || 0}
                  <button type="button" className="btn btn-secondary lucifer-inline-button" onClick={() => removeCollectionItem(LUCIFER_COLLECTIONS.nutritionLog, entry.id)}>Remove</button>
                </p>
              ))}
              {!nutritionEntries.length ? <p>No nutrition entries yet.</p> : null}
            </div>
            <div className="detail-list">
              {vitalEntries.slice(0, 5).map((entry) => (
                <p key={entry.id}>
                  {formatDate(entry.date)} • RHR {entry.restingHeartRate || '-'} | BP {entry.bloodPressureSystolic || '-'} / {entry.bloodPressureDiastolic || '-'} | SpO2 {entry.spo2 || '-'}%
                  <button type="button" className="btn btn-secondary lucifer-inline-button" onClick={() => removeCollectionItem(LUCIFER_COLLECTIONS.vitalsLog, entry.id)}>Remove</button>
                </p>
              ))}
              {!vitalEntries.length ? <p>No vitals logged yet.</p> : null}
            </div>
          </div>
        </article>
      </section>
      ) : null}

      {activeSectionId === 'cardio-mobility' ? (
      <section id="cardio-mobility" className="private-two-column">
        <article className="private-card lucifer-section-panel">
          <h3>Cardio section</h3>
          <form className="private-inline-form" onSubmit={async (event) => {
            event.preventDefault()
            await saveCollectionItem(LUCIFER_COLLECTIONS.cardioLog, cardioForm)
            setCardioForm({
              date: '',
              activity: '',
              durationMinutes: '',
              distance: '',
              distanceUnit: 'km',
              intensity: 'moderate',
              avgHeartRate: '',
              caloriesBurned: '',
              notes: '',
            })
          }}>
            <input type="date" value={cardioForm.date} onChange={(event) => setCardioForm({ ...cardioForm, date: event.target.value })} required />
            <input value={cardioForm.activity} onChange={(event) => setCardioForm({ ...cardioForm, activity: event.target.value })} placeholder="run, cycle, walk..." required />
            <div className="lucifer-measurement-grid">
              <label className="lucifer-field-stack">
                <span>Duration (min)</span>
                <input type="number" value={cardioForm.durationMinutes} onChange={(event) => setCardioForm({ ...cardioForm, durationMinutes: event.target.value })} required />
              </label>
              <label className="lucifer-field-stack">
                <span>Distance</span>
                <input type="number" value={cardioForm.distance} onChange={(event) => setCardioForm({ ...cardioForm, distance: event.target.value })} />
              </label>
              <label className="lucifer-field-stack">
                <span>Unit</span>
                <select value={cardioForm.distanceUnit} onChange={(event) => setCardioForm({ ...cardioForm, distanceUnit: event.target.value })}>
                  <option value="km">km</option>
                  <option value="m">m</option>
                  <option value="mi">mi</option>
                </select>
              </label>
              <label className="lucifer-field-stack">
                <span>Intensity</span>
                <select value={cardioForm.intensity} onChange={(event) => setCardioForm({ ...cardioForm, intensity: event.target.value })}>
                  <option value="low">Low</option>
                  <option value="moderate">Moderate</option>
                  <option value="high">High</option>
                </select>
              </label>
              <label className="lucifer-field-stack">
                <span>Avg heart rate</span>
                <input type="number" value={cardioForm.avgHeartRate} onChange={(event) => setCardioForm({ ...cardioForm, avgHeartRate: event.target.value })} />
              </label>
              <label className="lucifer-field-stack">
                <span>Calories burned</span>
                <input type="number" value={cardioForm.caloriesBurned} onChange={(event) => setCardioForm({ ...cardioForm, caloriesBurned: event.target.value })} />
              </label>
            </div>
            <textarea value={cardioForm.notes} onChange={(event) => setCardioForm({ ...cardioForm, notes: event.target.value })} placeholder="zone, pace, breathing, or machine notes" rows="3" />
            <button type="submit" className="btn btn-primary">Save cardio session</button>
          </form>
        </article>

        <article className="private-card lucifer-section-panel">
          <h3>Flexibility section</h3>
          <form className="private-inline-form" onSubmit={async (event) => {
            event.preventDefault()
            await saveCollectionItem(LUCIFER_COLLECTIONS.flexibilityLog, flexibilityForm)
            setFlexibilityForm({
              date: '',
              focusArea: '',
              routine: '',
              durationMinutes: '',
              mobilityScore: '',
              improvementPercent: '',
              notes: '',
            })
          }}>
            <input type="date" value={flexibilityForm.date} onChange={(event) => setFlexibilityForm({ ...flexibilityForm, date: event.target.value })} required />
            <input value={flexibilityForm.focusArea} onChange={(event) => setFlexibilityForm({ ...flexibilityForm, focusArea: event.target.value })} placeholder="hips, hamstrings, shoulders..." required />
            <input value={flexibilityForm.routine} onChange={(event) => setFlexibilityForm({ ...flexibilityForm, routine: event.target.value })} placeholder="routine or drill" />
            <div className="lucifer-measurement-grid">
              <label className="lucifer-field-stack">
                <span>Duration (min)</span>
                <input type="number" value={flexibilityForm.durationMinutes} onChange={(event) => setFlexibilityForm({ ...flexibilityForm, durationMinutes: event.target.value })} required />
              </label>
              <label className="lucifer-field-stack">
                <span>Mobility score / 10</span>
                <input type="number" value={flexibilityForm.mobilityScore} onChange={(event) => setFlexibilityForm({ ...flexibilityForm, mobilityScore: event.target.value })} />
              </label>
              <label className="lucifer-field-stack">
                <span>Improvement %</span>
                <input type="number" value={flexibilityForm.improvementPercent} onChange={(event) => setFlexibilityForm({ ...flexibilityForm, improvementPercent: event.target.value })} />
              </label>
            </div>
            <textarea value={flexibilityForm.notes} onChange={(event) => setFlexibilityForm({ ...flexibilityForm, notes: event.target.value })} placeholder="ROM notes, stiffness, warmup effect" rows="3" />
            <button type="submit" className="btn btn-primary">Save flexibility session</button>
          </form>
        </article>

        <article className="private-card lucifer-section-panel lucifer-span-2">
          <h3>Conditioning and mobility history</h3>
          <div className="private-two-column">
            <div className="detail-list">
              {cardioEntries.slice(0, 5).map((entry) => (
                <p key={entry.id}>
                  {formatDate(entry.date)} • {entry.activity} • {entry.durationMinutes || 0} min • HR {entry.avgHeartRate || '-'}
                  <button type="button" className="btn btn-secondary lucifer-inline-button" onClick={() => removeCollectionItem(LUCIFER_COLLECTIONS.cardioLog, entry.id)}>Remove</button>
                </p>
              ))}
              {!cardioEntries.length ? <p>No cardio sessions yet.</p> : null}
            </div>
            <div className="detail-list">
              {flexibilityEntries.slice(0, 5).map((entry) => (
                <p key={entry.id}>
                  {formatDate(entry.date)} • {entry.focusArea} • {entry.durationMinutes || 0} min • score {entry.mobilityScore || '-'} / 10
                  <button type="button" className="btn btn-secondary lucifer-inline-button" onClick={() => removeCollectionItem(LUCIFER_COLLECTIONS.flexibilityLog, entry.id)}>Remove</button>
                </p>
              ))}
              {!flexibilityEntries.length ? <p>No flexibility sessions yet.</p> : null}
            </div>
          </div>
        </article>
      </section>
      ) : null}

      {activeSectionId === 'charts-progress' ? (
      <section id="charts-progress" className="lucifer-progress-layout">
        <article className="private-card lucifer-section-panel">
          <h3>Progress tracker</h3>
          <div className="lucifer-progress-grid">
            <ProgressMeter label="Cardio target" value={summary.workout.weeklyCardioMinutes} target={cardioMinutesTarget} tone="var(--primary)" />
            <ProgressMeter label="Flexibility target" value={summary.workout.weeklyMobilityMinutes} target={mobilityMinutesTarget} tone="var(--secondary)" />
            <ProgressMeter label="Calorie target" value={summary.workout.dailyCaloriesConsumed} target={summary.workout.dailyCaloriesRequired || 1} tone="var(--accent)" />
            <article className="lucifer-progress-card">
              <div className="lucifer-progress-head">
                <strong>Weight goal progress</strong>
                <span>{targetWeight > 0 ? `${latestWeight || '-'} / ${targetWeight} kg` : 'No target weight yet'}</span>
              </div>
              <div className="lucifer-progress-track">
                <span className="lucifer-progress-fill" style={{ width: `${weightTargetProgress}%`, '--progress-tone': 'var(--primary)' }} />
              </div>
              <small>{targetWeight > 0 ? `${weightGap.toFixed(1)} kg gap to target` : 'Add a target weight in fitness profile.'}</small>
            </article>
          </div>
        </article>

        <section className="lucifer-chart-grid">
          <MiniTrendChart title="Weight trend" points={summary.workout.charts.weightTrend} unit="kg" accent="var(--primary)" />
          <MiniTrendChart title="Calories trend" points={summary.workout.charts.caloriesTrend} unit="" accent="var(--secondary)" />
          <MiniTrendChart title="Cardio minutes" points={summary.workout.charts.cardioTrend} unit="m" accent="var(--accent)" />
          <MiniTrendChart title="Flexibility minutes" points={summary.workout.charts.flexibilityTrend} unit="m" accent="var(--primary-strong)" />
        </section>
      </section>
      ) : null}

      {activeSectionId === 'workout-logbook' ? (
      <section id="workout-logbook" className="private-two-column">
        <article className="private-card lucifer-section-panel">
          <span className="eyebrow">Session composer</span>
          <h3>Detailed workout log</h3>
          <div className="lucifer-insight-grid lucifer-logbook-summary">
            <div className="lucifer-insight-card">
              <span className="eyebrow">Selected exercise</span>
              <strong>{selectedExercise?.name || 'Movement not selected'}</strong>
              <p>{selectedExercise?.bodyPart || 'Body part not mapped'} • {selectedExercise?.type || workoutLogForm.category}</p>
            </div>
            <div className="lucifer-insight-card">
              <span className="eyebrow">Last logged</span>
              <strong>{formatWorkoutHeadline(selectedExerciseRecent)}</strong>
              <p>{selectedExerciseRecent ? formatDate(selectedExerciseRecent.date) : 'No previous entry for this movement yet.'}</p>
            </div>
          </div>
          <form className="private-inline-form" onSubmit={async (event) => {
            event.preventDefault()
            await saveCollectionItem(LUCIFER_COLLECTIONS.workoutLog, {
              ...workoutLogForm,
              bodyPart: selectedExercise?.bodyPart || '',
              muscles: selectedExercise?.muscles || [],
            })
            setWorkoutLogForm((current) => ({
              ...current,
              date: '',
              sets: 3,
              reps: 8,
              weight: 0,
              durationSeconds: 0,
              distance: 0,
              rpe: 8,
              rir: 2,
              notes: '',
            }))
          }}>
            <input type="date" value={workoutLogForm.date} onChange={(event) => setWorkoutLogForm({ ...workoutLogForm, date: event.target.value })} />
            <select value={workoutLogForm.exerciseId} onChange={(event) => syncExercise(event.target.value)}>
              {EXERCISE_LIBRARY.map((exercise) => (
                <option key={exercise.id} value={exercise.id}>{exercise.name}</option>
              ))}
            </select>
            <div className="lucifer-measurement-grid">
              <label className="lucifer-field-stack">
                <span>Type</span>
                <select value={workoutLogForm.category} onChange={(event) => setWorkoutLogForm({ ...workoutLogForm, category: event.target.value })}>
                  <option value="strength">Strength</option>
                  <option value="conditioning">Conditioning</option>
                  <option value="mobility">Mobility</option>
                </select>
              </label>
              <label className="lucifer-field-stack">
                <span>Sets</span>
                <input type="number" value={workoutLogForm.sets} onChange={(event) => setWorkoutLogForm({ ...workoutLogForm, sets: Number(event.target.value) || 0 })} />
              </label>
              <label className="lucifer-field-stack">
                <span>Reps</span>
                <input type="number" value={workoutLogForm.reps} onChange={(event) => setWorkoutLogForm({ ...workoutLogForm, reps: Number(event.target.value) || 0 })} />
              </label>
              <label className="lucifer-field-stack">
                <span>Weight</span>
                <input type="number" value={workoutLogForm.weight} onChange={(event) => setWorkoutLogForm({ ...workoutLogForm, weight: Number(event.target.value) || 0 })} />
              </label>
              <label className="lucifer-field-stack">
                <span>RPE</span>
                <input type="number" value={workoutLogForm.rpe} onChange={(event) => setWorkoutLogForm({ ...workoutLogForm, rpe: Number(event.target.value) || 0 })} />
              </label>
              <label className="lucifer-field-stack">
                <span>RIR</span>
                <input type="number" value={workoutLogForm.rir} onChange={(event) => setWorkoutLogForm({ ...workoutLogForm, rir: Number(event.target.value) || 0 })} />
              </label>
              <label className="lucifer-field-stack">
                <span>Duration (sec)</span>
                <input type="number" value={workoutLogForm.durationSeconds} onChange={(event) => setWorkoutLogForm({ ...workoutLogForm, durationSeconds: Number(event.target.value) || 0 })} />
              </label>
              <label className="lucifer-field-stack">
                <span>Distance</span>
                <input type="number" value={workoutLogForm.distance} onChange={(event) => setWorkoutLogForm({ ...workoutLogForm, distance: Number(event.target.value) || 0 })} />
              </label>
              <label className="lucifer-field-stack">
                <span>PR metric</span>
                <select value={workoutLogForm.prMetric} onChange={(event) => setWorkoutLogForm({ ...workoutLogForm, prMetric: event.target.value })}>
                  <option value="weight">Weight / e1RM</option>
                  <option value="reps">Reps</option>
                  <option value="time">Time</option>
                  <option value="distance">Distance</option>
                  <option value="volume">Volume</option>
                </select>
              </label>
            </div>
            <textarea value={workoutLogForm.notes} onChange={(event) => setWorkoutLogForm({ ...workoutLogForm, notes: event.target.value })} placeholder="session notes, cues, tempo, or PR context" rows="3" />
            <button type="submit" className="btn btn-primary">Save workout entry</button>
          </form>
        </article>

        <article className="private-card lucifer-section-panel">
          <span className="eyebrow">Skill lane</span>
          <h3>Calisthenics progress</h3>
          <form className="private-inline-form" onSubmit={async (event) => {
            event.preventDefault()
            await saveCollectionItem(LUCIFER_COLLECTIONS.calisthenicsProgress, calisthenicsForm)
            setCalisthenicsForm({ skill: '', status: 'learning', progress: 0, notes: '' })
          }}>
            <input value={calisthenicsForm.skill} onChange={(event) => setCalisthenicsForm({ ...calisthenicsForm, skill: event.target.value })} placeholder="skill" required />
            <select value={calisthenicsForm.status} onChange={(event) => setCalisthenicsForm({ ...calisthenicsForm, status: event.target.value })}>
              <option value="learning">Learning</option>
              <option value="close">Close</option>
              <option value="achieved">Achieved</option>
            </select>
            <input type="number" value={calisthenicsForm.progress} onChange={(event) => setCalisthenicsForm({ ...calisthenicsForm, progress: Number(event.target.value) || 0 })} placeholder="progress" />
            <textarea value={calisthenicsForm.notes} onChange={(event) => setCalisthenicsForm({ ...calisthenicsForm, notes: event.target.value })} placeholder="notes" rows="3" />
            <button type="submit" className="btn btn-primary">Save calisthenics skill</button>
          </form>

          <div className="lucifer-progress-stack">
            {calisthenicsEntries.slice(0, 4).map((entry) => (
              <article key={entry.id} className="lucifer-progress-card">
                <div className="lucifer-progress-head">
                  <strong>{entry.skill}</strong>
                  <span>{entry.status}</span>
                </div>
                <div className="lucifer-progress-track">
                  <span className="lucifer-progress-fill" style={{ width: `${Math.max(0, Math.min(100, Number(entry.progress || 0)))}%`, '--progress-tone': 'var(--secondary)' }} />
                </div>
                <small>{Number(entry.progress || 0)}% progress{entry.notes ? ` • ${entry.notes}` : ''}</small>
              </article>
            ))}
          </div>
        </article>

        <article className="private-card lucifer-section-panel lucifer-span-2">
          <span className="eyebrow">Logbook review</span>
          <h3>Recent workout entries</h3>
          <div className="lucifer-insight-grid lucifer-logbook-summary">
            <div className="lucifer-insight-card">
              <span className="eyebrow">Recent sessions</span>
              <strong>{recentWorkouts.slice(0, 8).length}</strong>
              <p>Dominant lane: {dominantCategory}</p>
            </div>
            <div className="lucifer-insight-card">
              <span className="eyebrow">Recent volume</span>
              <strong>{Math.round(recentWorkoutVolume)}</strong>
              <p>Across the last 8 logged sessions.</p>
            </div>
            <div className="lucifer-insight-card">
              <span className="eyebrow">Average RPE</span>
              <strong>{recentAverageRpe || '-'}</strong>
              <p>Intensity trend across recent entries.</p>
            </div>
            <div className="lucifer-insight-card">
              <span className="eyebrow">Movement focus</span>
              <strong>{selectedExercise?.name || 'Exercise'}</strong>
              <p>{selectedExercise?.muscles?.join(', ') || 'Muscle mapping appears here.'}</p>
            </div>
          </div>
          <div className="lucifer-logbook-list">
            {recentWorkouts.slice(0, 8).map((entry) => (
              <article key={entry.id} className="lucifer-log-entry-card">
                <div className="lucifer-log-entry-head">
                  <div>
                    <strong>{entry.exercise}</strong>
                    <span>{formatDate(entry.date)} • {entry.category || 'strength'}</span>
                  </div>
                  <button type="button" className="btn btn-secondary lucifer-inline-button" onClick={() => removeCollectionItem(LUCIFER_COLLECTIONS.workoutLog, entry.id)}>Remove</button>
                </div>
                <div className="lucifer-log-entry-metrics">
                  <span>{formatWorkoutHeadline(entry)}</span>
                  <span>RPE {entry.rpe || '-'} / RIR {entry.rir || '-'}</span>
                  <span>{entry.bodyPart || 'Body part n/a'}</span>
                  <span>{entry.prMetric || 'volume'} PR tracking</span>
                </div>
                {entry.notes ? <p>{entry.notes}</p> : null}
              </article>
            ))}
            {!recentWorkouts.length ? <p>No workout entries yet.</p> : null}
          </div>
        </article>
      </section>
      ) : null}

      {activeSectionId === 'exercise-lists' ? (
      <section id="exercise-lists" className="private-card lucifer-section-panel">
        <h3>Exercise lists</h3>
        <div className="lucifer-filter-bar">
          <input
            value={exerciseSearch}
            onChange={(event) => setExerciseSearch(event.target.value)}
            placeholder="Search exercise name"
          />
          <select value={exerciseBodyPartFilter} onChange={(event) => setExerciseBodyPartFilter(event.target.value)}>
            <option value="all">All body parts</option>
            {EXERCISE_GROUPS.map((group) => (
              <option key={group.id} value={group.id}>{group.label}</option>
            ))}
          </select>
          <select value={exerciseTypeFilter} onChange={(event) => setExerciseTypeFilter(event.target.value)}>
            <option value="all">All types</option>
            <option value="strength">Strength</option>
            <option value="conditioning">Conditioning</option>
            <option value="mobility">Mobility</option>
          </select>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              setExerciseSearch('')
              setExerciseBodyPartFilter('all')
              setExerciseTypeFilter('all')
              setSelectedMuscleId('')
            }}
          >
            Clear filters
          </button>
        </div>

        <div className="lucifer-insight-grid lucifer-logbook-summary">
          <div className="lucifer-insight-card">
            <span className="eyebrow">Interlinked map</span>
            <strong>{selectedMuscleId ? 'Muscle-linked' : 'Full library'}</strong>
            <p>Exercises are linked by muscle, body part, and movement type.</p>
          </div>
          <div className="lucifer-insight-card">
            <span className="eyebrow">Filtered results</span>
            <strong>{filteredExercises.length}</strong>
            <p>{selectedMuscleId ? 'Current muscle filter is active.' : 'No muscle filter applied.'}</p>
          </div>
        </div>

        <div className="exercise-library-groups">
          {EXERCISE_GROUPS.map((group) => (
            <article key={group.id} className="exercise-group-card">
              <div className="exercise-group-header">
                <div>
                  <span className="eyebrow">{group.shortLabel}</span>
                  <strong>{group.label}</strong>
                </div>
                <span>{group.exercises.length} exercises</span>
              </div>
              <div className="detail-list">
                {group.muscles.map((muscle) => (
                  <button key={muscle.id} type="button" className={`exercise-link-card ${selectedMuscleId === muscle.id ? 'is-active' : ''}`} onClick={() => setSelectedMuscleId(muscle.id)}>
                    <strong>{muscle.label}</strong>
                    <span>{getExercisesByMuscle(muscle.id).length} linked exercises</span>
                  </button>
                ))}
              </div>
              <div className="exercise-tag-row">
                {group.exercises
                  .filter((exercise) => filteredExercises.some((entry) => entry.id === exercise.id))
                  .map((exercise) => (
                  <button key={exercise.id} type="button" className={`exercise-tag ${selectedExerciseId === exercise.id ? 'is-active' : ''}`} onClick={() => syncExercise(exercise.id)}>
                    {exercise.name}
                  </button>
                  ))}
              </div>
            </article>
          ))}
        </div>

        {filteredExercises.length ? (
          <div className="private-card lucifer-section-panel">
            <span className="eyebrow">{selectedMuscleId ? 'Exercises for selected muscle' : 'Filtered exercises'}</span>
            <div className="exercise-tag-row">
              {filteredExercises.map((exercise) => (
                <button key={exercise.id} type="button" className="exercise-tag" onClick={() => syncExercise(exercise.id)}>
                  {exercise.name}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {selectedMuscleId && selectedMuscleExercises.length ? (
          <div className="private-card lucifer-section-panel">
            <span className="eyebrow">Muscle linkage detail</span>
            <p>
              The selected muscle currently links to {selectedMuscleExercises.length} exercise{selectedMuscleExercises.length === 1 ? '' : 's'} in the library.
            </p>
          </div>
        ) : null}
      </section>
      ) : null}
    </LuciferPageFrame>
  )
}

export default LuciferWorkouts
