import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import LuciferPageFrame from '../../components/admin/LuciferPageFrame'
import { useLuciferSubpage } from '../../components/admin/luciferSubpages'
import { useLucifer } from '../../context/useLucifer'

function LuciferProjects() {
  const { sharedProjects, privateState, saveProjectMeta } = useLucifer()
  const [editingId, setEditingId] = useState('')
  const [form, setForm] = useState({ stage: '', progress: 0, nextStep: '', privateNotes: '' })

  const startEdit = (project) => {
    const meta = privateState.projectMeta?.[project.id] || {}
    setEditingId(project.id)
    setForm({
      stage: meta.stage || '',
      progress: Number(meta.progress || project.progress || 0),
      nextStep: meta.nextStep || '',
      privateNotes: meta.privateNotes || '',
    })
  }

  const sections = [
    { id: 'project-portfolio', label: 'Project portfolio', detail: 'Shared projects with private execution data' },
    { id: 'delivery-lens', label: 'Delivery lens', detail: 'Stages, next steps, and momentum view' },
  ]
  const { activeSectionId, sections: subpageSections, shouldRedirect, redirectPath } = useLuciferSubpage(
    sections,
    '/lucifer-newstar_dashboard/lucifer/projects'
  )

  if (shouldRedirect) {
    return <Navigate to={redirectPath} replace />
  }

  const metrics = [
    { label: 'Shared projects', value: sharedProjects.length },
    { label: 'Private staged', value: Object.values(privateState.projectMeta || {}).filter((item) => item.stage).length },
    { label: 'Next steps', value: Object.values(privateState.projectMeta || {}).filter((item) => item.nextStep).length },
  ]

  return (
    <LuciferPageFrame
      eyebrow="Lucifer projects"
      title="Portfolio work with personal delivery context."
      lead="Track what is actually moving, what is blocked, and what comes next without changing public project presentation."
      sections={subpageSections}
      metrics={metrics}
    >
      {activeSectionId === 'project-portfolio' ? (
      <section id="project-portfolio" className="private-card-grid">
        {sharedProjects.map((project) => {
          const meta = privateState.projectMeta?.[project.id] || {}
          const isEditing = editingId === project.id

          return (
            <article key={project.id} className="private-card">
              <span className="eyebrow">{project.id}</span>
              <h3>{project.title}</h3>
              <p>{project.description || 'No public description yet.'}</p>
              <div className="detail-list">
                <p>Public visibility: {project.visible === false ? 'Hidden' : 'Visible'}</p>
                <p>Private stage: {meta.stage || 'not set'}</p>
                <p>Private progress: {meta.progress ?? 0}%</p>
                <p>Next step: {meta.nextStep || 'not set'}</p>
              </div>

              {isEditing ? (
                <form className="private-inline-form" onSubmit={async (event) => {
                  event.preventDefault()
                  await saveProjectMeta(project.id, form)
                  setEditingId('')
                }}>
                  <input value={form.stage} onChange={(event) => setForm({ ...form, stage: event.target.value })} placeholder="stage" />
                  <input type="number" value={form.progress} onChange={(event) => setForm({ ...form, progress: Number(event.target.value) || 0 })} placeholder="progress" />
                  <input value={form.nextStep} onChange={(event) => setForm({ ...form, nextStep: event.target.value })} placeholder="next step" />
                  <textarea value={form.privateNotes} onChange={(event) => setForm({ ...form, privateNotes: event.target.value })} rows="3" placeholder="private notes" />
                  <button type="submit" className="btn btn-primary">Save</button>
                  <button type="button" className="btn btn-secondary" onClick={() => setEditingId('')}>Cancel</button>
                </form>
              ) : (
                <button type="button" className="btn btn-secondary" onClick={() => startEdit(project)}>Edit private overlay</button>
              )}
            </article>
          )
        })}
      </section>
      ) : null}

      {activeSectionId === 'delivery-lens' ? (
      <section id="delivery-lens" className="private-card-grid">
        {sharedProjects.slice(0, 4).map((project) => {
          const meta = privateState.projectMeta?.[project.id] || {}
          return (
            <article key={`${project.id}-delivery`} className="private-card lucifer-section-panel">
              <span className="eyebrow">{project.id}</span>
              <h3>{project.title}</h3>
              <p>{meta.privateNotes || 'No private delivery note yet.'}</p>
              <div className="detail-list">
                <p>Stage: {meta.stage || 'not set'}</p>
                <p>Progress: {meta.progress ?? 0}%</p>
                <p>Next step: {meta.nextStep || 'not set'}</p>
              </div>
            </article>
          )
        })}
      </section>
      ) : null}
    </LuciferPageFrame>
  )
}

export default LuciferProjects
