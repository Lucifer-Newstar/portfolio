import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import LuciferPageFrame from '../../components/admin/LuciferPageFrame'
import { useLuciferSubpage } from '../../components/admin/luciferSubpages'
import { useLucifer } from '../../context/useLucifer'

function LuciferPosts() {
  const { sharedPosts, privateState, savePostMeta } = useLucifer()
  const [editingId, setEditingId] = useState('')
  const [form, setForm] = useState({ mood: '', context: '', privateNotes: '' })

  const beginEdit = (post) => {
    const meta = privateState.postMeta?.[post.id] || {}
    setEditingId(post.id)
    setForm({
      mood: meta.mood || '',
      context: meta.context || '',
      privateNotes: meta.privateNotes || '',
    })
  }

  const sections = [
    { id: 'post-context', label: 'Post context', detail: 'Private narrative behind public writing' },
    { id: 'writing-signals', label: 'Writing signals', detail: 'Mood and follow-up patterns' },
  ]
  const { activeSectionId, sections: subpageSections, shouldRedirect, redirectPath } = useLuciferSubpage(
    sections,
    '/lucifer-newstar_dashboard/lucifer/posts'
  )

  if (shouldRedirect) {
    return <Navigate to={redirectPath} replace />
  }

  const metrics = [
    { label: 'Shared posts', value: sharedPosts.length },
    { label: 'Context tagged', value: Object.values(privateState.postMeta || {}).filter((item) => item.context).length },
    { label: 'Mood notes', value: Object.values(privateState.postMeta || {}).filter((item) => item.mood).length },
  ]

  return (
    <LuciferPageFrame
      eyebrow="Lucifer posts"
      title="Shared posts with a private context layer."
      lead="Keep public notes concise while storing why you wrote them, what triggered them, and what should follow next."
      sections={subpageSections}
      metrics={metrics}
    >
      {activeSectionId === 'post-context' ? (
      <section id="post-context" className="private-card-grid">
        {sharedPosts.map((post) => {
          const meta = privateState.postMeta?.[post.id] || {}
          const isEditing = editingId === post.id

          return (
            <article key={post.id} className="private-card">
              <span className="eyebrow">{post.type || 'note'}</span>
              <h3>{post.title || post.id}</h3>
              <p>{post.excerpt || post.content || 'No excerpt saved.'}</p>
              <div className="detail-list">
                <p>Public visibility: {post.visible === false ? 'Hidden' : 'Visible'}</p>
                <p>Private context: {meta.context || 'not set'}</p>
                <p>Mood tag: {meta.mood || 'not set'}</p>
              </div>

              {isEditing ? (
                <form className="private-inline-form" onSubmit={async (event) => {
                  event.preventDefault()
                  await savePostMeta(post.id, form)
                  setEditingId('')
                }}>
                  <input value={form.context} onChange={(event) => setForm({ ...form, context: event.target.value })} placeholder="context" />
                  <input value={form.mood} onChange={(event) => setForm({ ...form, mood: event.target.value })} placeholder="mood" />
                  <textarea value={form.privateNotes} onChange={(event) => setForm({ ...form, privateNotes: event.target.value })} placeholder="private notes" rows="3" />
                  <button type="submit" className="btn btn-primary">Save</button>
                  <button type="button" className="btn btn-secondary" onClick={() => setEditingId('')}>Cancel</button>
                </form>
              ) : (
                <button type="button" className="btn btn-secondary" onClick={() => beginEdit(post)}>Edit private layer</button>
              )}
            </article>
          )
        })}
      </section>
      ) : null}

      {activeSectionId === 'writing-signals' ? (
      <section id="writing-signals" className="private-card-grid">
        {sharedPosts.slice(0, 4).map((post) => {
          const meta = privateState.postMeta?.[post.id] || {}
          return (
            <article key={`${post.id}-signal`} className="private-card lucifer-section-panel">
              <span className="eyebrow">{meta.mood || 'mood not set'}</span>
              <h3>{post.title || post.id}</h3>
              <p>{meta.context || 'No private context saved yet.'}</p>
            </article>
          )
        })}
      </section>
      ) : null}
    </LuciferPageFrame>
  )
}

export default LuciferPosts
