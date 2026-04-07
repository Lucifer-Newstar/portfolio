import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchPosts } from '../../utils/api'

function Posts() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPosts = async () => {
      const data = await fetchPosts()
      setPosts(data)
      setLoading(false)
    }
    loadPosts()
  }, [])

  if (loading) return <div className="container text-center mt-4">Loading posts...</div>

  const manualPosts = posts.filter(p => p.type === 'manual')
  const githubPosts = posts.filter(p => p.type === 'github')

  return (
    <div className="container">
      <h1 className="text-center">Posts & Updates</h1>
      <p className="text-center">My latest thoughts, learnings, and GitHub activity.</p>
      
      {githubPosts.length > 0 && (
        <>
          <h2>📊 GitHub Activity</h2>
          <div className="posts-grid">
            {githubPosts.map(post => (
              <div key={post.id} className="post-card">
                <h3>{post.title}</h3>
                <p>{post.content}</p>
                <span className="post-date">{new Date(post.date).toLocaleDateString()}</span>
                {post.link && <a href={post.link} target="_blank" rel="noopener noreferrer" className="post-link">View on GitHub →</a>}
              </div>
            ))}
          </div>
        </>
      )}
      
      {manualPosts.length > 0 && (
        <>
          <h2>📝 Recent Updates</h2>
          <div className="posts-grid">
            {manualPosts.map(post => (
              <div key={post.id} className="post-card">
                <h3>{post.title}</h3>
                <p>{post.content}</p>
                <span className="post-date">{new Date(post.date).toLocaleDateString()}</span>
                {post.link && <a href={post.link} target="_blank" rel="noopener noreferrer" className="post-link">Read more →</a>}
              </div>
            ))}
          </div>
        </>
      )}
      
      {posts.length === 0 && (
        <div className="card text-center mt-4">
          <p>No posts yet. Add posts from the admin dashboard or sync GitHub activity.</p>
        </div>
      )}
      
      <hr />
      <div className="text-center">
        <Link to="/skills" className="btn btn-secondary">View my skills</Link>
        {' '}
        <Link to="/projects" className="btn btn-secondary">See my projects</Link>
      </div>
    </div>
  )
}

export default Posts