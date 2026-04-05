import { useState, useEffect } from 'react'
import { fetchCertifications, createCertification, updateCertification, deleteCertification } from '../../utils/api'

function CertificationsManager() {
  const [certifications, setCertifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({ name: '', issuer: '', date: '', link: '', skills: '', order: 0 })
  const [newCert, setNewCert] = useState({ id: '', name: '', issuer: '', date: '', link: '', skills: '', order: 0 })

  useEffect(() => { loadCertifications() }, [])

  const loadCertifications = async () => {
    try {
      const data = await fetchCertifications()
      setCertifications(Array.isArray(data) ? data : [])
      setLoading(false)
    } catch (error) { setLoading(false) }
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    try {
      const toAdd = { ...newCert, skills: newCert.skills.split(',').map(s => s.trim()) }
      await createCertification(toAdd)
      setNewCert({ id: '', name: '', issuer: '', date: '', link: '', skills: '', order: 0 })
      await loadCertifications()
      alert('Certification added!')
    } catch (error) { alert('Error: ' + error.message) }
  }

  const handleEditClick = (cert) => {
    setEditingId(cert.id)
    setEditForm({
      name: cert.name || '',
      issuer: cert.issuer || '',
      date: cert.date || '',
      link: cert.link || '',
      skills: Array.isArray(cert.skills) ? cert.skills.join(', ') : (cert.skills || ''),
      order: cert.order || 0
    })
  }

  const handleUpdate = async (id) => {
    try {
      const updates = { ...editForm, skills: editForm.skills.split(',').map(s => s.trim()) }
      await updateCertification(id, updates)
      setEditingId(null)
      await loadCertifications()
      alert('Certification updated!')
    } catch (error) { alert('Error: ' + error.message) }
  }

  const handleDelete = async (id) => {
    if (confirm('Delete this certification?')) {
      await deleteCertification(id)
      await loadCertifications()
    }
  }

  if (loading) return <div>Loading certifications...</div>

  return (
    <div>
      <h2>Certifications Manager</h2>
      <form onSubmit={handleAdd}>
        <div><label>ID:</label><input type="text" value={newCert.id} onChange={(e) => setNewCert({...newCert, id: e.target.value})} required /></div>
        <div><label>Name:</label><input type="text" value={newCert.name} onChange={(e) => setNewCert({...newCert, name: e.target.value})} required /></div>
        <div><label>Issuer:</label><input type="text" value={newCert.issuer} onChange={(e) => setNewCert({...newCert, issuer: e.target.value})} required /></div>
        <div><label>Date:</label><input type="text" value={newCert.date} onChange={(e) => setNewCert({...newCert, date: e.target.value})} required /></div>
        <div><label>Link:</label><input type="url" value={newCert.link} onChange={(e) => setNewCert({...newCert, link: e.target.value})} /></div>
        <div><label>Skills (comma):</label><input type="text" value={newCert.skills} onChange={(e) => setNewCert({...newCert, skills: e.target.value})} /></div>
        <div><label>Order:</label><input type="number" value={newCert.order} onChange={(e) => setNewCert({...newCert, order: parseInt(e.target.value) || 0})} /></div>
        <button type="submit">Add Certification</button>
      </form>
      <hr />
      <h3>Existing Certifications</h3>
      <table border="1" cellPadding="8">
        <thead><tr><th>ID</th><th>Name</th><th>Issuer</th><th>Date</th><th>Actions</th></tr></thead>
        <tbody>
          {certifications.map(cert => (
            <tr key={cert.id}>
              {editingId === cert.id ? (
                <>
                  <td>{cert.id}</td>
                  <td><input value={editForm.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})} /></td>
                  <td><input value={editForm.issuer} onChange={(e) => setEditForm({...editForm, issuer: e.target.value})} /></td>
                  <td><input value={editForm.date} onChange={(e) => setEditForm({...editForm, date: e.target.value})} /></td>
                  <td><button onClick={() => handleUpdate(cert.id)}>Save</button><button onClick={() => setEditingId(null)}>Cancel</button></td>
                </>
              ) : (
                <>
                  <td>{cert.id}</td><td>{cert.name}</td><td>{cert.issuer}</td><td>{cert.date}</td>
                  <td><button onClick={() => handleEditClick(cert)}>Edit</button><button onClick={() => handleDelete(cert.id)}>Delete</button></td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default CertificationsManager