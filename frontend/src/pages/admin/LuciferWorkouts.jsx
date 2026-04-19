import { useMemo, useState } from 'react'
import { Navigate } from 'react-router-dom'
import LuciferPageFrame from '../../components/admin/LuciferPageFrame'
import { useLuciferSubpage } from '../../components/admin/luciferSubpages'
import { BODY_MEASUREMENT_FIELDS, EXERCISE_GROUPS, EXERCISE_LIBRARY, getExercisesByMuscle } from '../../data/luciferExerciseData'
import { useLucifer } from '../../context/useLucifer'
import { LUCIFER_COLLECTIONS } from '../../utils/luciferData'

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
  const [calisthenicsForm, setCalisthenicsForm] = useState({ skill: '', status: 'learning', progress: 0, notes: '' })
  const [selectedExerciseId, setSelectedExerciseId] = useState(EXERCISE_LIBRARY[0]?.id || '')
  const [selectedMuscleId, setSelectedMuscleId] = useState('')
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

  const sections = [
    { id: 'strength-signal', label: 'Strength signal', detail: 'PRs, recent stats, and movement focus' },
    { id: 'body-lab', label: 'Body lab', detail: 'Measurements and progress photos' },
    { id: 'workout-logbook', label: 'Workout logbook', detail: 'Detailed sessions and PR data' },
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
    { label: 'Workouts this week', value: summary.workout.workoutsThisWeek },
    { label: 'Total logged volume', value: summary.workout.weeklyVolume },
    { label: 'Tracked PR movements', value: summary.workout.prs.length },
    { label: 'Body check-ins', value: privateState.bodyStats.length },
  ]

  const bodyEntries = [...privateState.bodyStats].sort((left, right) => String(right.date || right.updatedAt).localeCompare(String(left.date || left.updatedAt)))
  const recentWorkouts = [...privateState.workoutLog].sort((left, right) => String(right.date || right.updatedAt).localeCompare(String(left.date || left.updatedAt)))
  const selectedMuscleExercises = selectedMuscleId ? getExercisesByMuscle(selectedMuscleId) : []

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
      title="Training logs, measurements, and a visual muscle system."
      lead="Workout entries come from the dashboard too, but this page is the deeper Lucifer performance lab with measurements, progress photos, exercise mapping, and PR-aware logging."
      sections={subpageSections}
      metrics={metrics}
      heroVisual={(
        <div className="lucifer-workout-hero-visual">
          <div className="lucifer-hero-chip"><strong>{summary.workout.workoutsThisWeek}</strong><span>sessions this week</span></div>
          <div className="lucifer-hero-chip"><strong>{summary.workout.prs.length}</strong><span>PR signals tracked</span></div>
          <div className="lucifer-hero-chip"><strong>{bodyEntries[0]?.weight || '-'}</strong><span>latest bodyweight</span></div>
          <div className="lucifer-hero-chip"><strong>{selectedExercise?.name || 'Exercise'}</strong><span>selected movement</span></div>
        </div>
      )}
    >
      {activeSectionId === 'strength-signal' ? (
      <section id="strength-signal" className="private-two-column">
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

        <article className="private-card lucifer-section-panel">
          <h3>Recent workout entries</h3>
          <div className="detail-list">
            {recentWorkouts.slice(0, 8).map((entry) => (
              <p key={entry.id}>
                {entry.exercise} - {entry.sets} x {entry.reps} @ {entry.weight || 0}{entry.unit || 'kg'} | RPE {entry.rpe || '-'}
              </p>
            ))}
          </div>
        </article>
      </section>
      ) : null}

      {activeSectionId === 'body-lab' ? (
      <section id="body-lab" className="private-two-column">
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

        <article className="private-card lucifer-section-panel">
          <h3>Progress check-ins</h3>
          <div className="lucifer-photo-grid">
            {bodyEntries.slice(0, 4).map((item) => (
              <article key={item.id} className="lucifer-photo-card">
                <strong>{item.date || item.updatedAt}</strong>
                <span>Weight: {item.weight || '-'} kg | Waist: {item.waist || '-'} cm</span>
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

      {activeSectionId === 'workout-logbook' ? (
      <section id="workout-logbook" className="private-two-column">
        <article className="private-card lucifer-section-panel">
          <h3>Detailed workout log</h3>
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
        </article>
      </section>
      ) : null}

      {activeSectionId === 'exercise-lists' ? (
      <section id="exercise-lists" className="private-card lucifer-section-panel">
        <h3>Exercise Lists</h3>
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
                {group.exercises.map((exercise) => (
                  <button key={exercise.id} type="button" className={`exercise-tag ${selectedExerciseId === exercise.id ? 'is-active' : ''}`} onClick={() => syncExercise(exercise.id)}>
                    {exercise.name}
                  </button>
                ))}
              </div>
            </article>
          ))}
        </div>

        {selectedMuscleExercises.length ? (
          <div className="private-card lucifer-section-panel">
            <span className="eyebrow">Exercises for selected muscle</span>
            <div className="exercise-tag-row">
              {selectedMuscleExercises.map((exercise) => (
                <button key={exercise.id} type="button" className="exercise-tag" onClick={() => syncExercise(exercise.id)}>
                  {exercise.name}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </section>
      ) : null}
    </LuciferPageFrame>
  )
}

export default LuciferWorkouts
