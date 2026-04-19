import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import LuciferPageFrame from '../../components/admin/LuciferPageFrame'
import { useLuciferSubpage } from '../../components/admin/luciferSubpages'
import { useLucifer } from '../../context/useLucifer'

function LuciferSkills() {
  const { sharedSkills, privateState, saveSkillMeta } = useLucifer()
  const [editingId, setEditingId] = useState('')
  const [form, setForm] = useState({ progress: 0, focus: '', privateNotes: '', targetCertification: '' })

  const beginEdit = (skill) => {
    const meta = privateState.skillMeta?.[skill.id] || {}
    setEditingId(skill.id)
    setForm({
      progress: Number(meta.progress || skill.completion || 0),
      focus: meta.focus || '',
      privateNotes: meta.privateNotes || '',
      targetCertification: meta.targetCertification || '',
    })
  }

  const metrics = [
    { label: 'Shared skills', value: sharedSkills.length },
    { label: 'Active focus items', value: Object.values(privateState.skillMeta || {}).filter((item) => item.focus).length },
    { label: 'Target certifications', value: Object.values(privateState.skillMeta || {}).filter((item) => item.targetCertification).length },
  ]

  const sections = [
    { id: 'skill-matrix', label: 'Skill matrix', detail: 'Private overlay on shared skills' },
    { id: 'focus-clusters', label: 'Focus clusters', detail: 'Progress grouped by category' },
  ]
  const { activeSectionId, sections: subpageSections, shouldRedirect, redirectPath } = useLuciferSubpage(
    sections,
    '/lucifer-newstar_dashboard/lucifer/skills'
  )

  if (shouldRedirect) {
    return <Navigate to={redirectPath} replace />
  }

  const categories = sharedSkills.reduce((acc, skill) => {
    const key = skill.category || skill.group || 'Unsorted'
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {})

  return (
    <LuciferPageFrame
      eyebrow="Lucifer skills"
      title="Shared skills with private momentum overlays."
      lead="Keep the public skill record clean, then store focus, completion, and private notes separately inside Lucifer Mode."
      sections={subpageSections}
      metrics={metrics}
    >
      {activeSectionId === 'skill-matrix' ? (
      <section id="skill-matrix" className="private-table-shell lucifer-section-panel">
        <table className="private-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Public level</th>
              <th>Private progress</th>
              <th>Focus</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {sharedSkills.map((skill) => {
              const meta = privateState.skillMeta?.[skill.id] || {}
              const isEditing = editingId === skill.id
              return (
                <tr key={skill.id}>
                  <td>{skill.name}</td>
                  <td>{skill.category || skill.group || 'Unsorted'}</td>
                  <td>{skill.level || 'Learning'}</td>
                  <td>{meta.progress ?? skill.completion ?? 0}%</td>
                  <td>{meta.focus || 'idle'}</td>
                  <td>
                    {isEditing ? (
                      <form
                        className="private-inline-form"
                        onSubmit={async (event) => {
                          event.preventDefault()
                          await saveSkillMeta(skill.id, form)
                          setEditingId('')
                        }}
                      >
                        <input type="number" value={form.progress} onChange={(event) => setForm({ ...form, progress: Number(event.target.value) || 0 })} placeholder="progress" />
                        <input value={form.focus} onChange={(event) => setForm({ ...form, focus: event.target.value })} placeholder="focus" />
                        <input value={form.targetCertification} onChange={(event) => setForm({ ...form, targetCertification: event.target.value })} placeholder="target cert" />
                        <textarea value={form.privateNotes} onChange={(event) => setForm({ ...form, privateNotes: event.target.value })} placeholder="private notes" rows="2" />
                        <button type="submit" className="btn btn-primary">Save</button>
                        <button type="button" className="btn btn-secondary" onClick={() => setEditingId('')}>Cancel</button>
                      </form>
                    ) : (
                      <button type="button" className="btn btn-secondary" onClick={() => beginEdit(skill)}>Edit private layer</button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </section>
      ) : null}

      {activeSectionId === 'focus-clusters' ? (
      <section id="focus-clusters" className="private-card-grid">
        {Object.entries(categories).map(([category, count]) => (
          <article key={category} className="private-card lucifer-section-panel">
            <span className="eyebrow">{count} skills</span>
            <h3>{category}</h3>
            <div className="detail-list">
              {sharedSkills.filter((skill) => (skill.category || skill.group || 'Unsorted') === category).slice(0, 5).map((skill) => {
                const meta = privateState.skillMeta?.[skill.id] || {}
                return <p key={skill.id}>{skill.name}: {meta.progress ?? skill.completion ?? 0}% • {meta.focus || 'idle'}</p>
              })}
            </div>
          </article>
        ))}
      </section>
      ) : null}
    </LuciferPageFrame>
  )
}

export default LuciferSkills
