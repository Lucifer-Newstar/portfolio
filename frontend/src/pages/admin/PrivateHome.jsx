import { Link } from 'react-router-dom'
import { useLucifer } from '../../context/useLucifer'

function PrivateHome() {
  const { summary } = useLucifer()

  return (
    <div className="private-page-shell">
      <section className="private-hero">
        <div>
          <span className="eyebrow">Private entry point</span>
          <h2>Two modes, one authenticated workspace.</h2>
          <p>
            Edit Mode preserves the full public editorial workflow. Lucifer Mode turns the private area into
            a personal operating system for learning, workouts, hobbies, and momentum tracking.
          </p>
        </div>
        <div className="private-hero-actions">
          <Link to="/lucifer-newstar_dashboard/edit" className="btn btn-secondary">Open Edit Mode</Link>
          <Link to="/lucifer-newstar_dashboard/lucifer" className="btn btn-primary">Open Lucifer Mode</Link>
        </div>
      </section>

      <section className="private-card-grid">
        <article className="private-card">
          <span className="eyebrow">Edit Mode</span>
          <h3>Public-site CMS stays intact</h3>
          <p>Use the existing content manager, preview tools, CRUD tabs, save flow, and deploy controls without regressions.</p>
        </article>
        <article className="private-card">
          <span className="eyebrow">Lucifer Mode</span>
          <h3>Private operating system</h3>
          <p>Track progress with faster daily actions, private metadata, and sections that never leak into the public portfolio.</p>
        </article>
        <article className="private-card">
          <span className="eyebrow">Weekly signal</span>
          <h3>{summary.currentStreak} day streak</h3>
          <p>
            {summary.weeklySummary.learningDays} learning days, {summary.weeklySummary.workouts} workouts, and{' '}
            {summary.quickStats.hobbiesTracked} hobby items are currently in motion.
          </p>
        </article>
      </section>
    </div>
  )
}

export default PrivateHome
