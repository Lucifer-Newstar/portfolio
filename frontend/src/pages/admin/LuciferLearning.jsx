import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import LuciferPageFrame from '../../components/admin/LuciferPageFrame'
import { useLuciferSubpage } from '../../components/admin/luciferSubpages'
import { useLucifer } from '../../context/useLucifer'
import { LUCIFER_COLLECTIONS } from '../../utils/luciferData'

function LuciferLearning() {
  const { privateState, saveCollectionItem, removeCollectionItem } = useLucifer()
  const [certForm, setCertForm] = useState({ name: '', provider: '', progress: 0, status: 'in-progress', targetDate: '' })
  const [noteForm, setNoteForm] = useState({ topic: '', content: '', tags: '' })
  const [resourceForm, setResourceForm] = useState({ title: '', url: '', type: 'course', status: 'active' })

  const sections = [
    { id: 'certification-lab', label: 'Certification lab', detail: 'Progress and targets' },
    { id: 'study-vault', label: 'Study vault', detail: 'Notes and resources' },
  ]
  const { activeSectionId, sections: subpageSections, shouldRedirect, redirectPath } = useLuciferSubpage(
    sections,
    '/lucifer-newstar_dashboard/lucifer/learning'
  )

  if (shouldRedirect) {
    return <Navigate to={redirectPath} replace />
  }

  const metrics = [
    { label: 'Certifications', value: privateState.certProgress.length },
    { label: 'Study notes', value: privateState.studyNotes.length },
    { label: 'Resources', value: privateState.resources.length },
  ]

  return (
    <LuciferPageFrame
      eyebrow="Learning tracker"
      title="Logs, certifications, notes, and resources in one private lane."
      lead="Use manual-first records now, with enough structure to plug future integrations in later without changing the UI shape."
      sections={subpageSections}
      metrics={metrics}
    >
      {activeSectionId === 'certification-lab' ? (
      <section id="certification-lab" className="private-three-column">
        <article className="private-card lucifer-section-panel">
          <h3>Certification progress</h3>
          <form className="private-inline-form" onSubmit={async (event) => {
            event.preventDefault()
            await saveCollectionItem(LUCIFER_COLLECTIONS.certProgress, certForm)
            setCertForm({ name: '', provider: '', progress: 0, status: 'in-progress', targetDate: '' })
          }}>
            <input value={certForm.name} onChange={(event) => setCertForm({ ...certForm, name: event.target.value })} placeholder="certification" required />
            <input value={certForm.provider} onChange={(event) => setCertForm({ ...certForm, provider: event.target.value })} placeholder="provider" />
            <input type="number" value={certForm.progress} onChange={(event) => setCertForm({ ...certForm, progress: Number(event.target.value) || 0 })} placeholder="progress %" />
            <input type="date" value={certForm.targetDate} onChange={(event) => setCertForm({ ...certForm, targetDate: event.target.value })} />
            <button type="submit" className="btn btn-primary">Save cert progress</button>
          </form>
          <div className="detail-list">
            {privateState.certProgress.map((item) => (
              <p key={item.id}>
                {item.name} - {item.progress || 0}%{' '}
                <button type="button" onClick={() => removeCollectionItem(LUCIFER_COLLECTIONS.certProgress, item.id)}>remove</button>
              </p>
            ))}
          </div>
        </article>

        <article className="private-card lucifer-section-panel">
          <h3>Study notes</h3>
          <form className="private-inline-form" onSubmit={async (event) => {
            event.preventDefault()
            await saveCollectionItem(LUCIFER_COLLECTIONS.studyNotes, {
              ...noteForm,
              tags: noteForm.tags.split(',').map((item) => item.trim()).filter(Boolean),
            })
            setNoteForm({ topic: '', content: '', tags: '' })
          }}>
            <input value={noteForm.topic} onChange={(event) => setNoteForm({ ...noteForm, topic: event.target.value })} placeholder="topic" required />
            <textarea value={noteForm.content} onChange={(event) => setNoteForm({ ...noteForm, content: event.target.value })} placeholder="note" rows="4" required />
            <input value={noteForm.tags} onChange={(event) => setNoteForm({ ...noteForm, tags: event.target.value })} placeholder="tags comma separated" />
            <button type="submit" className="btn btn-primary">Save note</button>
          </form>
          <div className="detail-list">
            {privateState.studyNotes.map((item) => (
              <p key={item.id}>
                {item.topic}
                <button type="button" onClick={() => removeCollectionItem(LUCIFER_COLLECTIONS.studyNotes, item.id)}>remove</button>
              </p>
            ))}
          </div>
        </article>

        <article className="private-card lucifer-section-panel">
          <h3>Resources</h3>
          <form className="private-inline-form" onSubmit={async (event) => {
            event.preventDefault()
            await saveCollectionItem(LUCIFER_COLLECTIONS.resources, resourceForm)
            setResourceForm({ title: '', url: '', type: 'course', status: 'active' })
          }}>
            <input value={resourceForm.title} onChange={(event) => setResourceForm({ ...resourceForm, title: event.target.value })} placeholder="resource title" required />
            <input value={resourceForm.url} onChange={(event) => setResourceForm({ ...resourceForm, url: event.target.value })} placeholder="url" />
            <select value={resourceForm.type} onChange={(event) => setResourceForm({ ...resourceForm, type: event.target.value })}>
              <option value="course">Course</option>
              <option value="docs">Docs</option>
              <option value="video">Video</option>
              <option value="book">Book</option>
            </select>
            <button type="submit" className="btn btn-primary">Save resource</button>
          </form>
          <div className="detail-list">
            {privateState.resources.map((item) => (
              <p key={item.id}>
                {item.title}
                <button type="button" onClick={() => removeCollectionItem(LUCIFER_COLLECTIONS.resources, item.id)}>remove</button>
              </p>
            ))}
          </div>
        </article>
      </section>
      ) : null}

      {activeSectionId === 'study-vault' ? (
      <section id="study-vault" className="private-card-grid">
        {privateState.studyNotes.slice(0, 4).map((item) => (
          <article key={`${item.id}-vault`} className="private-card lucifer-section-panel">
            <span className="eyebrow">{Array.isArray(item.tags) ? item.tags.join(', ') : 'study note'}</span>
            <h3>{item.topic}</h3>
            <p>{item.content}</p>
          </article>
        ))}
      </section>
      ) : null}
    </LuciferPageFrame>
  )
}

export default LuciferLearning
