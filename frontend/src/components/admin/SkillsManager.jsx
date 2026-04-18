import { useState, useEffect } from 'react'
import { fetchSkills, createSkill, updateSkill, deleteSkill } from '../../utils/api'

const DEFAULT_FORM = {
  id: '',
  name: '',
  category: '',
  bucket: 'tools',
  level: 'Learning',
  order: 0,
  subItems: '',
}

function normalizeSubItems(rawValue) {
  if (Array.isArray(rawValue)) {
    return rawValue
      .map((item) => (typeof item === 'string' ? item : item?.name || item?.label || ''))
      .filter(Boolean)
  }

  if (rawValue && typeof rawValue === 'object') {
    return Object.keys(rawValue)
  }

  return []
}

function buildFormState(skill = {}) {
  const bucket = skill.bucket === 'concepts' ? 'concepts' : 'tools'
  const childItems = bucket === 'concepts'
    ? normalizeSubItems(skill.subConcepts ?? skill.subconcepts ?? skill.concepts)
    : normalizeSubItems(skill.subSkills ?? skill.subskills ?? skill.tools ?? skill.technologies)

  return {
    id: skill.id || '',
    name: skill.name || '',
    category: skill.category || skill.group || '',
    bucket,
    level: skill.level || 'Learning',
    order: skill.order || 0,
    subItems: childItems.join(', '),
  }
}

function buildSkillPayload(form) {
  const payload = {
    id: form.id.trim(),
    name: form.name.trim(),
    category: form.category.trim(),
    bucket: form.bucket,
    level: form.level,
    order: Number(form.order) || 0,
  }

  const childItems = form.subItems
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)

  if (form.bucket === 'concepts') {
    payload.subConcepts = childItems
  } else {
    payload.subSkills = childItems
  }

  return payload
}

function renderSubItemSummary(skill) {
  const bucket = skill.bucket === 'concepts' ? 'concepts' : 'tools'
  const items = bucket === 'concepts'
    ? normalizeSubItems(skill.subConcepts ?? skill.subconcepts ?? skill.concepts)
    : normalizeSubItems(skill.subSkills ?? skill.subskills ?? skill.tools ?? skill.technologies)

  return items.length > 0 ? items.join(', ') : 'None'
}

function SkillsManager() {
  const [skills, setSkills] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState(DEFAULT_FORM)
  const [newSkill, setNewSkill] = useState(DEFAULT_FORM)

  useEffect(() => {
    const loadSkills = async () => {
      try {
        const data = await fetchSkills()
        setSkills(Array.isArray(data) ? data : [])
      } catch {
        setSkills([])
      } finally {
        setLoading(false)
      }
    }

    loadSkills()
  }, [])

  const refreshSkills = async () => {
    const data = await fetchSkills()
    setSkills(Array.isArray(data) ? data : [])
  }

  const handleAddSkill = async (e) => {
    e.preventDefault()
    try {
      await createSkill(buildSkillPayload(newSkill))
      setNewSkill(DEFAULT_FORM)
      await refreshSkills()
      alert('Skill added!')
    } catch (error) {
      alert('Error: ' + error.message)
    }
  }

  const handleEditClick = (skill) => {
    setEditingId(skill.id)
    setEditForm(buildFormState(skill))
  }

  const handleUpdate = async (id) => {
    try {
      await updateSkill(id, buildSkillPayload(editForm))
      setEditingId(null)
      await refreshSkills()
      alert('Skill updated!')
    } catch (error) {
      alert('Error: ' + error.message)
    }
  }

  const handleDeleteSkill = async (id) => {
    if (confirm('Delete this skill?')) {
      try {
        await deleteSkill(id)
        await refreshSkills()
        alert('Skill deleted!')
      } catch (error) {
        alert('Error: ' + error.message)
      }
    }
  }

  if (loading) return <div>Loading skills...</div>

  return (
    <div>
      <h2>Skills Manager</h2>
      
      <h3>Add New Skill Item</h3>
      <form onSubmit={handleAddSkill}>
        <div><label>ID:</label><input type="text" value={newSkill.id} onChange={(e) => setNewSkill({ ...newSkill, id: e.target.value })} required /></div>
        <div><label>Name:</label><input type="text" value={newSkill.name} onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })} required /></div>
        <div><label>Group:</label><input type="text" value={newSkill.category} onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })} required /></div>
        <div><label>Category Type:</label>
          <select value={newSkill.bucket} onChange={(e) => setNewSkill({ ...newSkill, bucket: e.target.value })}>
            <option value="concepts">Concepts</option><option value="tools">Tools &amp; Technologies</option>
          </select>
        </div>
        <div><label>Level:</label>
          <select value={newSkill.level} onChange={(e) => setNewSkill({ ...newSkill, level: e.target.value })}>
            <option>Learning</option><option>Intermediate</option><option>Advanced</option>
          </select>
        </div>
        <div><label>Order:</label><input type="number" value={newSkill.order} onChange={(e) => setNewSkill({ ...newSkill, order: parseInt(e.target.value, 10) || 0 })} /></div>
        <div>
          <label>{newSkill.bucket === 'concepts' ? 'Sub Concepts:' : 'Sub Skills:'}</label>
          <textarea rows="3" value={newSkill.subItems} onChange={(e) => setNewSkill({ ...newSkill, subItems: e.target.value })} placeholder="Comma-separated values" />
        </div>
        <button type="submit">Add Skill Item</button>
      </form>
      
      <hr />
      
      <h3>Existing Skill Items</h3>
      <table border="1" cellPadding="8">
        <thead><tr><th>ID</th><th>Name</th><th>Group</th><th>Type</th><th>Level</th><th>Order</th><th>Sub Items</th><th>Actions</th></tr></thead>
        <tbody>
          {skills.map(skill => (
            <tr key={skill.id}>
              {editingId === skill.id ? (
                <>
                  <td>{skill.id}</td>
                  <td><input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} /></td>
                  <td><input value={editForm.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })} /></td>
                  <td><select value={editForm.bucket} onChange={(e) => setEditForm({ ...editForm, bucket: e.target.value })}><option value="concepts">Concepts</option><option value="tools">Tools &amp; Technologies</option></select></td>
                  <td><select value={editForm.level} onChange={(e) => setEditForm({ ...editForm, level: e.target.value })}><option>Learning</option><option>Intermediate</option><option>Advanced</option></select></td>
                  <td><input type="number" value={editForm.order} onChange={(e) => setEditForm({ ...editForm, order: parseInt(e.target.value, 10) || 0 })} /></td>
                  <td><textarea rows="3" value={editForm.subItems} onChange={(e) => setEditForm({ ...editForm, subItems: e.target.value })} /></td>
                  <td><button onClick={() => handleUpdate(skill.id)}>Save</button><button onClick={() => setEditingId(null)}>Cancel</button></td>
                </>
              ) : (
                <>
                  <td>{skill.id}</td>
                  <td>{skill.name}</td>
                  <td>{skill.category || skill.group}</td>
                  <td>{skill.bucket === 'concepts' ? 'Concepts' : 'Tools & Technologies'}</td>
                  <td>{skill.level}</td>
                  <td>{skill.order}</td>
                  <td>{renderSubItemSummary(skill)}</td>
                  <td><button onClick={() => handleEditClick(skill)}>Edit</button><button onClick={() => handleDeleteSkill(skill.id)}>Delete</button></td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default SkillsManager
