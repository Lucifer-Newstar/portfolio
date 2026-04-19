import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import LuciferPageFrame from '../../components/admin/LuciferPageFrame'
import { useLuciferSubpage } from '../../components/admin/luciferSubpages'
import { useLucifer } from '../../context/useLucifer'

function LuciferDashboard() {
  const { summary, quickAddSkill, quickAddPost, markLearningDay, logWorkout, updateDailyStatus } = useLucifer()
  const [skillForm, setSkillForm] = useState({ id: '', name: '', category: '', level: 'Learning', notes: '' })
  const [postForm, setPostForm] = useState({ title: '', excerpt: '' })
  const [learningForm, setLearningForm] = useState({ title: '', skillId: '', minutes: 30, notes: '' })
  const [workoutForm, setWorkoutForm] = useState({ exercise: '', sets: 3, reps: 8, weight: 0, category: 'strength', prMetric: 'weight' })
  const [statusForm, setStatusForm] = useState({ focus: '', mood: '', summary: '' })

  const highlightMetrics = [
    { label: 'Learning streak', value: summary.currentStreak, note: 'Days of active momentum' },
    { label: 'Learning days', value: summary.weeklySummary.learningDays, note: 'Logged in the last 7 days' },
    { label: 'Workouts', value: summary.weeklySummary.workouts, note: 'Sessions completed this week' },
    { label: 'Shared projects', value: summary.quickStats.totalProjects, note: 'Connected to public portfolio' },
  ]

  const sections = [
    { id: 'signal-center', label: 'Signal center', detail: 'Core metrics and live state' },
    { id: 'quick-actions', label: 'Quick actions', detail: 'Fast entries without leaving dashboard' },
    { id: 'weekly-review', label: 'Weekly review', detail: 'Recent PRs and current summary' },
  ]
  const { activeSectionId, sections: subpageSections, shouldRedirect, redirectPath } = useLuciferSubpage(
    sections,
    '/lucifer-newstar_dashboard/lucifer'
  )

  if (shouldRedirect) {
    return <Navigate to={redirectPath} replace />
  }

  return (
    <LuciferPageFrame
      eyebrow="Lucifer dashboard"
      title="Private momentum at a glance."
      lead="Track weekly progress, trigger lightweight updates, and keep the personal side fast without opening the full CMS."
      sections={subpageSections}
      metrics={highlightMetrics}
      className="lucifer-dashboard-shell"
      heroVisual={(
        <div className="lucifer-hero-visual" aria-hidden="true">
          <div className="lucifer-core-orb" />
          <div className="lucifer-signal lucifer-signal-a" />
          <div className="lucifer-signal lucifer-signal-b" />
          <div className="lucifer-signal lucifer-signal-c" />
          <div className="lucifer-hero-grid">
            {highlightMetrics.map((metric) => (
              <article key={metric.label} className="lucifer-hero-chip">
                <strong>{metric.value}</strong>
                <span>{metric.label}</span>
              </article>
            ))}
          </div>
        </div>
      )}
    >
      {activeSectionId === 'signal-center' ? (
      <section id="signal-center" className="lucifer-command-grid">
        <article className="private-card lucifer-command-card lucifer-section-panel">
          <span className="eyebrow">Signal board</span>
          <h3>Private systems are online.</h3>
          <div className="lucifer-signal-board">
            {highlightMetrics.map((metric, index) => (
              <div key={metric.label} className="lucifer-signal-row" style={{ '--signal-index': index }}>
                <span>{metric.label}</span>
                <strong>{metric.value}</strong>
                <small>{metric.note}</small>
              </div>
            ))}
          </div>
        </article>

        <article className="private-card lucifer-command-card lucifer-command-card-accent lucifer-section-panel">
          <span className="eyebrow">Live status</span>
          <h3>{summary.latestStatus?.focus || 'No status update logged yet.'}</h3>
          <p>
            {summary.latestStatus?.summary
              || 'Log a short daily status to pin your focus, mood, and operating note into the Lucifer stream.'}
          </p>
          <div className="lucifer-status-pills">
            <span className="metric-pill">Mood: {summary.latestStatus?.mood || 'steady'}</span>
            <span className="metric-pill">Skills: {summary.quickStats.totalSkills}</span>
            <span className="metric-pill">Posts: {summary.quickStats.totalPosts}</span>
          </div>
        </article>
      </section>
      ) : null}

      {activeSectionId === 'quick-actions' ? (
      <section id="quick-actions" className="private-two-column">
        <article className="private-card lucifer-section-panel">
          <span className="eyebrow">Quick actions</span>
          <div className="private-form-grid">
            <form onSubmit={async (event) => {
              event.preventDefault()
              await quickAddSkill(skillForm)
              setSkillForm({ id: '', name: '', category: '', level: 'Learning', notes: '' })
            }}>
              <h3>Quick skill add</h3>
              <input value={skillForm.id} onChange={(event) => setSkillForm({ ...skillForm, id: event.target.value })} placeholder="skill id" required />
              <input value={skillForm.name} onChange={(event) => setSkillForm({ ...skillForm, name: event.target.value })} placeholder="skill name" required />
              <input value={skillForm.category} onChange={(event) => setSkillForm({ ...skillForm, category: event.target.value })} placeholder="category" required />
              <select value={skillForm.level} onChange={(event) => setSkillForm({ ...skillForm, level: event.target.value })}>
                <option>Learning</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
              <textarea value={skillForm.notes} onChange={(event) => setSkillForm({ ...skillForm, notes: event.target.value })} placeholder="private notes" rows="3" />
              <button type="submit" className="btn btn-primary">Add skill</button>
            </form>

            <form onSubmit={async (event) => {
              event.preventDefault()
              await quickAddPost(postForm)
              setPostForm({ title: '', excerpt: '' })
            }}>
              <h3>Quick post log</h3>
              <input value={postForm.title} onChange={(event) => setPostForm({ ...postForm, title: event.target.value })} placeholder="post title" required />
              <textarea value={postForm.excerpt} onChange={(event) => setPostForm({ ...postForm, excerpt: event.target.value })} placeholder="short thought or update" rows="4" required />
              <button type="submit" className="btn btn-primary">Save post log</button>
            </form>

            <form onSubmit={async (event) => {
              event.preventDefault()
              await markLearningDay(learningForm)
              setLearningForm({ title: '', skillId: '', minutes: 30, notes: '' })
            }}>
              <h3>Mark learning day</h3>
              <input value={learningForm.title} onChange={(event) => setLearningForm({ ...learningForm, title: event.target.value })} placeholder="session title" required />
              <input value={learningForm.skillId} onChange={(event) => setLearningForm({ ...learningForm, skillId: event.target.value })} placeholder="skill id" />
              <input type="number" value={learningForm.minutes} onChange={(event) => setLearningForm({ ...learningForm, minutes: Number(event.target.value) || 0 })} placeholder="minutes" />
              <textarea value={learningForm.notes} onChange={(event) => setLearningForm({ ...learningForm, notes: event.target.value })} placeholder="notes" rows="3" />
              <button type="submit" className="btn btn-primary">Log learning</button>
            </form>

            <form onSubmit={async (event) => {
              event.preventDefault()
              await logWorkout(workoutForm)
              setWorkoutForm({ exercise: '', sets: 3, reps: 8, weight: 0, category: 'strength', prMetric: 'weight' })
            }}>
              <h3>Log workout</h3>
              <input value={workoutForm.exercise} onChange={(event) => setWorkoutForm({ ...workoutForm, exercise: event.target.value })} placeholder="exercise" required />
              <select value={workoutForm.category} onChange={(event) => setWorkoutForm({ ...workoutForm, category: event.target.value })}>
                <option value="strength">Strength</option>
                <option value="conditioning">Conditioning</option>
                <option value="mobility">Mobility</option>
              </select>
              <select value={workoutForm.prMetric} onChange={(event) => setWorkoutForm({ ...workoutForm, prMetric: event.target.value })}>
                <option value="weight">PR by weight / e1RM</option>
                <option value="reps">PR by reps</option>
                <option value="volume">PR by volume</option>
              </select>
              <div className="private-inline-grid">
                <input type="number" value={workoutForm.sets} onChange={(event) => setWorkoutForm({ ...workoutForm, sets: Number(event.target.value) || 0 })} placeholder="sets" />
                <input type="number" value={workoutForm.reps} onChange={(event) => setWorkoutForm({ ...workoutForm, reps: Number(event.target.value) || 0 })} placeholder="reps" />
                <input type="number" value={workoutForm.weight} onChange={(event) => setWorkoutForm({ ...workoutForm, weight: Number(event.target.value) || 0 })} placeholder="weight" />
              </div>
              <button type="submit" className="btn btn-primary">Save workout</button>
            </form>

            <form onSubmit={async (event) => {
              event.preventDefault()
              await updateDailyStatus(statusForm)
              setStatusForm({ focus: '', mood: '', summary: '' })
            }}>
              <h3>Update status</h3>
              <input value={statusForm.focus} onChange={(event) => setStatusForm({ ...statusForm, focus: event.target.value })} placeholder="today's focus" required />
              <input value={statusForm.mood} onChange={(event) => setStatusForm({ ...statusForm, mood: event.target.value })} placeholder="mood" />
              <textarea value={statusForm.summary} onChange={(event) => setStatusForm({ ...statusForm, summary: event.target.value })} placeholder="short daily note" rows="3" />
              <button type="submit" className="btn btn-primary">Save status</button>
            </form>
          </div>
        </article>

      </section>
      ) : null}

      {activeSectionId === 'weekly-review' ? (
      <section id="weekly-review" className="private-two-column">
        <article className="private-card lucifer-section-panel">
          <span className="eyebrow">Weekly summary</span>
          <h3>Shared stats plus private momentum</h3>
          <div className="detail-list">
            <p>{summary.weeklySummary.learningDays} learning days logged in the last week.</p>
            <p>{summary.weeklySummary.workouts} workouts recorded this week.</p>
            <p>{summary.quickStats.totalSkills} shared skills, {summary.quickStats.totalProjects} shared projects, and {summary.quickStats.totalPosts} shared posts currently connect into Lucifer Mode.</p>
            <p>{summary.latestStatus ? `Latest status: ${summary.latestStatus.focus}` : 'No daily status update yet.'}</p>
            {summary.workout.prs.slice(0, 4).map((entry) => (
              <p key={entry.exercise}>{entry.exercise}: {entry.weight > 0 ? `${entry.weight} x ${entry.reps}` : `${entry.reps} reps`}</p>
            ))}
          </div>
        </article>
      </section>
      ) : null}
    </LuciferPageFrame>
  )
}

export default LuciferDashboard
