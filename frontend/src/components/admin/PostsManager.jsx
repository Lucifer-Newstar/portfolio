import { useState, useEffect } from 'react'
import { fetchPosts, createPost, updatePost, deletePost, syncGitHubActivity } from '../../utils/api'

function PostsManager() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({ title: '', content: '', link: '', date: '', visible: true })
  const [newPost, setNewPost] = useState({ id: '', type: 'manual', title: '', content: '', link: '', date: new Date().toISOString().split('T')[0], visible: true, order: 0 })

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await fetchPosts()
        setPosts(Array.isArray(data) ? data : [])
      } finally {
        setLoading(false)
      }
    }

    loadPosts()
  }, [])

  const refreshPosts = async () => {
    const data = await fetchPosts()
    setPosts(Array.isArray(data) ? data : [])
  }

  const handleSyncGitHub = async () => {
    setSyncing(true)
    try {
      await syncGitHubActivity()
      await refreshPosts()
      alert('GitHub activity synced!')
    } catch (error) { alert('Error: ' + error.message) }
    setSyncing(false)
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    try {
      await createPost(newPost)
      setNewPost({ id: '', type: 'manual', title: '', content: '', link: '', date: new Date().toISOString().split('T')[0], visible: true, order: 0 })
      await refreshPosts()
      alert('Post added!')
    } catch (error) { alert('Error: ' + error.message) }
  }

  const handleEditClick = (post) => {
    setEditingId(post.id)
    setEditForm({
      title: post.title || '',
      content: post.content || '',
      link: post.link || '',
      date: post.date?.split('T')[0] || '',
      visible: post.visible !== false
    })
  }

  const handleUpdate = async (id) => {
    try {
      await updatePost(id, editForm)
      setEditingId(null)
      await refreshPosts()
      alert('Post updated!')
    } catch (error) { alert('Error: ' + error.message) }
  }

  const handleDelete = async (id) => {
    if (confirm('Delete this post?')) {
      await deletePost(id)
      await refreshPosts()
    }
  }

  if (loading) return <div>Loading posts...</div>

  return (
    <div>
      <h2>Posts Manager</h2>
      <button onClick={handleSyncGitHub} disabled={syncing}>{syncing ? 'Syncing...' : 'Sync GitHub Activity'}</button>
      <hr />
      <form onSubmit={handleAdd}>
        <div><label>ID:</label><input type="text" value={newPost.id} onChange={(e) => setNewPost({...newPost, id: e.target.value})} required /></div>
        <div><label>Type:</label><select value={newPost.type} onChange={(e) => setNewPost({...newPost, type: e.target.value})}><option>manual</option><option>github</option></select></div>
        <div><label>Title:</label><input type="text" value={newPost.title} onChange={(e) => setNewPost({...newPost, title: e.target.value})} required /></div>
        <div><label>Content:</label><textarea value={newPost.content} onChange={(e) => setNewPost({...newPost, content: e.target.value})} rows="3" /></div>
        <div><label>Link:</label><input type="url" value={newPost.link} onChange={(e) => setNewPost({...newPost, link: e.target.value})} /></div>
        <div><label>Date:</label><input type="date" value={newPost.date} onChange={(e) => setNewPost({...newPost, date: e.target.value})} required /></div>
        <div><label>Visible:</label><input type="checkbox" checked={newPost.visible} onChange={(e) => setNewPost({...newPost, visible: e.target.checked})} /></div>
        <div><label>Order:</label><input type="number" value={newPost.order} onChange={(e) => setNewPost({...newPost, order: parseInt(e.target.value) || 0})} /></div>
        <button type="submit">Add Post</button>
      </form>
      <hr />
      <h3>Existing Posts</h3>
      <table border="1" cellPadding="8">
        <thead><tr><th>ID</th><th>Type</th><th>Title</th><th>Date</th><th>Visible</th><th>Actions</th></tr></thead>
        <tbody>
          {posts.map(post => (
            <tr key={post.id}>
              {editingId === post.id ? (
                <>
                  <td>{post.id}</td>
                  <td>{post.type}</td>
                  <td><input value={editForm.title} onChange={(e) => setEditForm({...editForm, title: e.target.value})} /></td>
                  <td><input type="date" value={editForm.date} onChange={(e) => setEditForm({...editForm, date: e.target.value})} /></td>
                  <td><input type="checkbox" checked={editForm.visible} onChange={(e) => setEditForm({...editForm, visible: e.target.checked})} /></td>
                  <td><button onClick={() => handleUpdate(post.id)}>Save</button><button onClick={() => setEditingId(null)}>Cancel</button></td>
                </>
              ) : (
                <>
                  <td>{post.id}</td><td>{post.type}</td><td>{post.title}</td><td>{post.date?.split('T')[0]}</td><td>{post.visible ? '✅' : '❌'}</td>
                  <td><button onClick={() => handleEditClick(post)}>Edit</button><button onClick={() => handleDelete(post.id)}>Delete</button></td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default PostsManager
