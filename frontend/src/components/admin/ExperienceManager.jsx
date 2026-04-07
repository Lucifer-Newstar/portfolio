import { useState, useEffect } from 'react'
import { fetchExperience, createExperience, updateExperience, deleteExperience } from '../../utils/api'

function ExperienceManager() {
  const [experiences, setExperiences] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({ title: '', organization: '', period: '', location: '', description: '', skills: '', order: 0 })
  const [newExp, setNewExp] = useState({ id: '', title: '', organization: '', period: '', location: '', description: '', skills: '', order: 0 })

  useEffect(() => {
    const loadExperiences = async () => {
      try {
        const data = await fetchExperience()
        setExperiences(Array.isArray(data) ? data : [])
      } finally {
        setLoading(false)
      }
    }

    loadExperiences()
  }, [])

  const refreshExperiences = async () => {
    const data = await fetchExperience()
    setExperiences(Array.isArray(data) ? data : [])
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    try {
      const toAdd = { ...newExp, description: newExp.description.split('\n').filter(l => l.trim()), skills: newExp.skills.split(',').map(s => s.trim()) }
      await createExperience(toAdd)
      setNewExp({ id: '', title: '', organization: '', period: '', location: '', description: '', skills: '', order: 0 })
      await refreshExperiences()
      alert('Experience added!')
    } catch (error) { alert('Error: ' + error.message) }
  }

  const handleEditClick = (exp) => {
    setEditingId(exp.id)
    setEditForm({
      title: exp.title || '',
      organization: exp.organization || '',
      period: exp.period || '',
      location: exp.location || '',
      description: Array.isArray(exp.description) ? exp.description.join('\n') : (exp.description || ''),
      skills: Array.isArray(exp.skills) ? exp.skills.join(', ') : (exp.skills || ''),
      order: exp.order || 0
    })
  }

  const handleUpdate = async (id) => {
    try {
      const updates = { ...editForm, description: editForm.description.split('\n').filter(l => l.trim()), skills: editForm.skills.split(',').map(s => s.trim()) }
      await updateExperience(id, updates)
      setEditingId(null)
      await refreshExperiences()
      alert('Experience updated!')
    } catch (error) { alert('Error: ' + error.message) }
  }

  const handleDelete = async (id) => {
    if (confirm('Delete this experience?')) {
      await deleteExperience(id)
      await refreshExperiences()
    }
  }

  if (loading) return <div>Loading experience...</div>

  return (
    <div>
      <h2>Experience Manager</h2>
      <form onSubmit={handleAdd}>
        <div><label>ID:</label><input type="text" value={newExp.id} onChange={(e) => setNewExp({...newExp, id: e.target.value})} required /></div>
        <div><label>Title:</label><input type="text" value={newExp.title} onChange={(e) => setNewExp({...newExp, title: e.target.value})} required /></div>
        <div><label>Organization:</label><input type="text" value={newExp.organization} onChange={(e) => setNewExp({...newExp, organization: e.target.value})} required /></div>
        <div><label>Period:</label><input type="text" value={newExp.period} onChange={(e) => setNewExp({...newExp, period: e.target.value})} required /></div>
        <div><label>Location:</label><input type="text" value={newExp.location} onChange={(e) => setNewExp({...newExp, location: e.target.value})} /></div>
        <div><label>Description (one per line):</label><textarea value={newExp.description} onChange={(e) => setNewExp({...newExp, description: e.target.value})} rows="4" /></div>
        <div><label>Skills (comma):</label><input type="text" value={newExp.skills} onChange={(e) => setNewExp({...newExp, skills: e.target.value})} /></div>
        <div><label>Order:</label><input type="number" value={newExp.order} onChange={(e) => setNewExp({...newExp, order: parseInt(e.target.value) || 0})} /></div>
        <button type="submit">Add Experience</button>
      </form>
      <hr />
      <h3>Existing Experience</h3>
      <table border="1" cellPadding="8">
        <thead><tr><th>ID</th><th>Title</th><th>Organization</th><th>Period</th><th>Actions</th></tr></thead>
        <tbody>
          {experiences.map(exp => (
            <tr key={exp.id}>
              {editingId === exp.id ? (
                <>
                  <td>{exp.id}</td>
                  <td><input value={editForm.title} onChange={(e) => setEditForm({...editForm, title: e.target.value})} /></td>
                  <td><input value={editForm.organization} onChange={(e) => setEditForm({...editForm, organization: e.target.value})} /></td>
                  <td><input value={editForm.period} onChange={(e) => setEditForm({...editForm, period: e.target.value})} /></td>
                  <td><button onClick={() => handleUpdate(exp.id)}>Save</button><button onClick={() => setEditingId(null)}>Cancel</button></td>
                </>
              ) : (
                <>
                  <td>{exp.id}</td><td>{exp.title}</td><td>{exp.organization}</td><td>{exp.period}</td>
                  <td><button onClick={() => handleEditClick(exp)}>Edit</button><button onClick={() => handleDelete(exp.id)}>Delete</button></td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ExperienceManager
