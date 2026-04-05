import { useState, useEffect } from 'react'
import { fetchProjects, createProject, updateProject, deleteProject } from '../../utils/api'

function ProjectsManager() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({ title: '', description: '', tech_stack: '', github_link: '', visible: true, order: 0 })
  const [newProject, setNewProject] = useState({ id: '', title: '', description: '', tech_stack: '', github_link: '', visible: true, order: 0 })

  useEffect(() => { loadProjects() }, [])

  const loadProjects = async () => {
    try {
      const data = await fetchProjects()
      setProjects(Array.isArray(data) ? data : [])
      setLoading(false)
    } catch (error) { setLoading(false) }
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    try {
      const toAdd = { ...newProject, tech_stack: newProject.tech_stack.split(',').map(s => s.trim()) }
      await createProject(toAdd)
      setNewProject({ id: '', title: '', description: '', tech_stack: '', github_link: '', visible: true, order: 0 })
      await loadProjects()
      alert('Project added!')
    } catch (error) { alert('Error: ' + error.message) }
  }

  const handleEditClick = (project) => {
    setEditingId(project.id)
    setEditForm({
      title: project.title || '',
      description: project.description || '',
      tech_stack: project.tech_stack?.join(', ') || '',
      github_link: project.github_link || '',
      visible: project.visible !== false,
      order: project.order || 0
    })
  }

  const handleUpdate = async (id) => {
    try {
      const updates = { ...editForm, tech_stack: editForm.tech_stack.split(',').map(s => s.trim()) }
      await updateProject(id, updates)
      setEditingId(null)
      await loadProjects()
      alert('Project updated!')
    } catch (error) { alert('Error: ' + error.message) }
  }

  const handleDelete = async (id) => {
    if (confirm('Delete this project?')) {
      await deleteProject(id)
      await loadProjects()
    }
  }

  if (loading) return <div>Loading projects...</div>

  return (
    <div>
      <h2>Projects Manager</h2>
      <form onSubmit={handleAdd}>
        <div><label>ID:</label><input type="text" value={newProject.id} onChange={(e) => setNewProject({...newProject, id: e.target.value})} required /></div>
        <div><label>Title:</label><input type="text" value={newProject.title} onChange={(e) => setNewProject({...newProject, title: e.target.value})} required /></div>
        <div><label>Description:</label><textarea value={newProject.description} onChange={(e) => setNewProject({...newProject, description: e.target.value})} /></div>
        <div><label>Tech Stack (comma):</label><input type="text" value={newProject.tech_stack} onChange={(e) => setNewProject({...newProject, tech_stack: e.target.value})} /></div>
        <div><label>GitHub Link:</label><input type="url" value={newProject.github_link} onChange={(e) => setNewProject({...newProject, github_link: e.target.value})} /></div>
        <div><label>Visible:</label><input type="checkbox" checked={newProject.visible} onChange={(e) => setNewProject({...newProject, visible: e.target.checked})} /></div>
        <div><label>Order:</label><input type="number" value={newProject.order} onChange={(e) => setNewProject({...newProject, order: parseInt(e.target.value) || 0})} /></div>
        <button type="submit">Add Project</button>
      </form>
      <hr />
      <h3>Existing Projects</h3>
      <table border="1" cellPadding="8">
        <thead><tr><th>ID</th><th>Title</th><th>Tech Stack</th><th>Visible</th><th>Actions</th></tr></thead>
        <tbody>
          {projects.map(project => (
            <tr key={project.id}>
              {editingId === project.id ? (
                <>
                  <td>{project.id}</td>
                  <td><input value={editForm.title} onChange={(e) => setEditForm({...editForm, title: e.target.value})} /></td>
                  <td><input value={editForm.tech_stack} onChange={(e) => setEditForm({...editForm, tech_stack: e.target.value})} /></td>
                  <td><input type="checkbox" checked={editForm.visible} onChange={(e) => setEditForm({...editForm, visible: e.target.checked})} /></td>
                  <td><button onClick={() => handleUpdate(project.id)}>Save</button><button onClick={() => setEditingId(null)}>Cancel</button></td>
                </>
              ) : (
                <>
                  <td>{project.id}</td><td>{project.title}</td><td>{project.tech_stack?.join(', ')}</td><td>{project.visible ? '✅' : '❌'}</td>
                  <td><button onClick={() => handleEditClick(project)}>Edit</button><button onClick={() => handleDelete(project.id)}>Delete</button></td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ProjectsManager