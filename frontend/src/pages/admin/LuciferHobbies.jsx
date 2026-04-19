import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import LuciferPageFrame from '../../components/admin/LuciferPageFrame'
import { useLuciferSubpage } from '../../components/admin/luciferSubpages'
import { useLucifer } from '../../context/useLucifer'
import { LUCIFER_COLLECTIONS } from '../../utils/luciferData'

function LuciferHobbies() {
  const { privateState, saveCollectionItem, removeCollectionItem } = useLucifer()
  const [hobbyForm, setHobbyForm] = useState({ type: 'reading', title: '', status: 'active', rating: '', notes: '' })
  const [goalForm, setGoalForm] = useState({ title: '', domain: '', progress: 0, status: 'active', targetDate: '' })
  const [projectForm, setProjectForm] = useState({ title: '', description: '', status: 'idea', tech: '' })

  const sections = [
    { id: 'collections', label: 'Collections', detail: 'Reading, shows, and interests' },
    { id: 'goals-projects', label: 'Goals and projects', detail: 'Progress outside the public site' },
  ]
  const { activeSectionId, sections: subpageSections, shouldRedirect, redirectPath } = useLuciferSubpage(
    sections,
    '/lucifer-newstar_dashboard/lucifer/hobbies'
  )

  if (shouldRedirect) {
    return <Navigate to={redirectPath} replace />
  }

  const metrics = [
    { label: 'Hobby items', value: privateState.hobbyItems.length },
    { label: 'Goals', value: privateState.goals.length },
    { label: 'Personal projects', value: privateState.personalProjects.length },
  ]

  return (
    <LuciferPageFrame
      eyebrow="Hobbies and interests"
      title="Manual-first private collections for life outside the public portfolio."
      lead="Reading, anime, movies, TV, goals, and personal side projects live here without any external account integrations yet."
      sections={subpageSections}
      metrics={metrics}
    >
      {activeSectionId === 'collections' ? (
      <section id="collections" className="private-three-column">
        <article className="private-card lucifer-section-panel">
          <h3>Hobby item</h3>
          <form className="private-inline-form" onSubmit={async (event) => {
            event.preventDefault()
            await saveCollectionItem(LUCIFER_COLLECTIONS.hobbyItems, hobbyForm)
            setHobbyForm({ type: 'reading', title: '', status: 'active', rating: '', notes: '' })
          }}>
            <select value={hobbyForm.type} onChange={(event) => setHobbyForm({ ...hobbyForm, type: event.target.value })}>
              <option value="reading">Reading</option>
              <option value="anime">Anime</option>
              <option value="movies">Movies</option>
              <option value="tv">TV Shows</option>
              <option value="interest">Interest</option>
            </select>
            <input value={hobbyForm.title} onChange={(event) => setHobbyForm({ ...hobbyForm, title: event.target.value })} placeholder="title" required />
            <input value={hobbyForm.status} onChange={(event) => setHobbyForm({ ...hobbyForm, status: event.target.value })} placeholder="status" />
            <input value={hobbyForm.rating} onChange={(event) => setHobbyForm({ ...hobbyForm, rating: event.target.value })} placeholder="rating" />
            <textarea value={hobbyForm.notes} onChange={(event) => setHobbyForm({ ...hobbyForm, notes: event.target.value })} rows="3" placeholder="notes" />
            <button type="submit" className="btn btn-primary">Save hobby item</button>
          </form>
        </article>

        <article className="private-card lucifer-section-panel">
          <h3>Goal</h3>
          <form className="private-inline-form" onSubmit={async (event) => {
            event.preventDefault()
            await saveCollectionItem(LUCIFER_COLLECTIONS.goals, goalForm)
            setGoalForm({ title: '', domain: '', progress: 0, status: 'active', targetDate: '' })
          }}>
            <input value={goalForm.title} onChange={(event) => setGoalForm({ ...goalForm, title: event.target.value })} placeholder="goal title" required />
            <input value={goalForm.domain} onChange={(event) => setGoalForm({ ...goalForm, domain: event.target.value })} placeholder="domain" />
            <input type="number" value={goalForm.progress} onChange={(event) => setGoalForm({ ...goalForm, progress: Number(event.target.value) || 0 })} placeholder="progress" />
            <input type="date" value={goalForm.targetDate} onChange={(event) => setGoalForm({ ...goalForm, targetDate: event.target.value })} />
            <button type="submit" className="btn btn-primary">Save goal</button>
          </form>
        </article>

        <article className="private-card lucifer-section-panel">
          <h3>Personal project</h3>
          <form className="private-inline-form" onSubmit={async (event) => {
            event.preventDefault()
            await saveCollectionItem(LUCIFER_COLLECTIONS.personalProjects, {
              ...projectForm,
              tech: projectForm.tech.split(',').map((item) => item.trim()).filter(Boolean),
            })
            setProjectForm({ title: '', description: '', status: 'idea', tech: '' })
          }}>
            <input value={projectForm.title} onChange={(event) => setProjectForm({ ...projectForm, title: event.target.value })} placeholder="project title" required />
            <textarea value={projectForm.description} onChange={(event) => setProjectForm({ ...projectForm, description: event.target.value })} rows="3" placeholder="description" />
            <input value={projectForm.tech} onChange={(event) => setProjectForm({ ...projectForm, tech: event.target.value })} placeholder="tech comma separated" />
            <button type="submit" className="btn btn-primary">Save personal project</button>
          </form>
        </article>
      </section>
      ) : null}

      {activeSectionId === 'goals-projects' ? (
      <section id="goals-projects" className="private-card-grid">
        {[...privateState.hobbyItems, ...privateState.goals, ...privateState.personalProjects].map((item) => (
          <article key={item.id} className="private-card lucifer-section-panel">
            <span className="eyebrow">{item.type || item.domain || item.status || 'private item'}</span>
            <h3>{item.title || item.skill}</h3>
            <p>{item.description || item.notes || 'Private entry.'}</p>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                const collectionName = privateState.hobbyItems.some((entry) => entry.id === item.id)
                  ? LUCIFER_COLLECTIONS.hobbyItems
                  : privateState.goals.some((entry) => entry.id === item.id)
                    ? LUCIFER_COLLECTIONS.goals
                    : LUCIFER_COLLECTIONS.personalProjects
                removeCollectionItem(collectionName, item.id)
              }}
            >
              Remove
            </button>
          </article>
        ))}
      </section>
      ) : null}
    </LuciferPageFrame>
  )
}

export default LuciferHobbies
