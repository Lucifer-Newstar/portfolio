import { useState, useEffect } from 'react'
import { fetchSkills, createSkill, updateSkill, deleteSkill } from '../../utils/api'

function SkillsManager() {
  const [skills, setSkills] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({ name: '', category: '', level: '', order: 0 })
  const [newSkill, setNewSkill] = useState({
    id: '',
    name: '',
    category: '',
    level: 'Learning',
    order: 0
  })

  useEffect(() => {
    loadSkills()
  }, [])

  const loadSkills = async () => {
    const data = await fetchSkills()
    setSkills(data)
    setLoading(false)
  }

  const handleAddSkill = async (e) => {
    e.preventDefault()
    try {
      await createSkill(newSkill)
      setNewSkill({ id: '', name: '', category: '', level: 'Learning', order: 0 })
      loadSkills()
      alert('Skill added!')
    } catch (error) {
      alert('Error: ' + error.message)
    }
  }

  const handleEditClick = (skill) => {
    setEditingId(skill.id)
    setEditForm({
      name: skill.name,
      category: skill.category,
      level: skill.level,
      order: skill.order
    })
  }

  const handleUpdate = async (id) => {
    try {
      await updateSkill(id, editForm)
      setEditingId(null)
      loadSkills()
      alert('Skill updated!')
    } catch (error) {
      alert('Error: ' + error.message)
    }
  }

  const handleDeleteSkill = async (id) => {
    if (confirm('Delete this skill?')) {
      await deleteSkill(id)
      loadSkills()
    }
  }

  if (loading) return <div>Loading skills...</div>

  return (
    <div>
      <h2>Skills Manager</h2>
      
      <h3>Add New Skill</h3>
      <form onSubmit={handleAddSkill}>
        <div>
          <label>ID (e.g., skill-aws):</label>
          <input
            type="text"
            value={newSkill.id}
            onChange={(e) => setNewSkill({...newSkill, id: e.target.value})}
            required
          />
        </div>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={newSkill.name}
            onChange={(e) => setNewSkill({...newSkill, name: e.target.value})}
            required
          />
        </div>
        <div>
          <label>Category:</label>
          <input
            type="text"
            value={newSkill.category}
            onChange={(e) => setNewSkill({...newSkill, category: e.target.value})}
            required
          />
        </div>
        <div>
          <label>Level:</label>
          <select
            value={newSkill.level}
            onChange={(e) => setNewSkill({...newSkill, level: e.target.value})}
          >
            <option>Learning</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
        </div>
        <div>
          <label>Order:</label>
          <input
            type="number"
            value={newSkill.order}
            onChange={(e) => setNewSkill({...newSkill, order: parseInt(e.target.value)})}
          />
        </div>
        <button type="submit">Add Skill</button>
      </form>
      
      <hr />
      
      <h3>Existing Skills</h3>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Category</th>
            <th>Level</th>
            <th>Order</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {skills.map(skill => (
            <tr key={skill.id}>
              {editingId === skill.id ? (
                <>
                  <td>{skill.id}</td>
                  <td>
                    <input
                      value={editForm.name}
                      onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    />
                  </td>
                  <td>
                    <input
                      value={editForm.category}
                      onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                    />
                  </td>
                  <td>
                    <select
                      value={editForm.level}
                      onChange={(e) => setEditForm({...editForm, level: e.target.value})}
                    >
                      <option>Learning</option>
                      <option>Intermediate</option>
                      <option>Advanced</option>
                    </select>
                  </td>
                  <td>
                    <input
                      type="number"
                      value={editForm.order}
                      onChange={(e) => setEditForm({...editForm, order: parseInt(e.target.value)})}
                    />
                  </td>
                  <td>
                    <button onClick={() => handleUpdate(skill.id)}>Save</button>
                    <button onClick={() => setEditingId(null)}>Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{skill.id}</td>
                  <td>{skill.name}</td>
                  <td>{skill.category}</td>
                  <td>{skill.level}</td>
                  <td>{skill.order}</td>
                  <td>
                    <button onClick={() => handleEditClick(skill)}>Edit</button>
                    <button onClick={() => handleDeleteSkill(skill.id)}>Delete</button>
                  </td>
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