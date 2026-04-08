import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchPosts } from '../../utils/api'
import { useSiteContent } from '../../context/useSiteContent'

function detectPostSource(post) {
  const type = String(post?.type || '').toLowerCase().trim()
  const link = String(post?.link || '').toLowerCase()
  const title = String(post?.title || '').toLowerCase()

  if (type.includes('github') || link.includes('github.com')) return 'github'
  if (type.includes('linkedin') || link.includes('linkedin.com')) return 'linkedin'
  if (type.includes('leetcode') || link.includes('leetcode.com')) return 'leetcode'
  if (type.includes('notion') || link.includes('notion.so') || link.includes('notion.site')) return 'notion'
  if (type === 'manual' || type === 'update') return 'manual'
  if (title.includes('github')) return 'github'
  if (title.includes('linkedin')) return 'linkedin'
  if (title.includes('leetcode')) return 'leetcode'
  if (title.includes('notion')) return 'notion'
  return 'other'
}

function sourceLabel(source) {
  if (source === 'github') return 'GitHub'
  if (source === 'linkedin') return 'LinkedIn'
  if (source === 'leetcode') return 'LeetCode'
  if (source === 'notion') return 'Notion'
  if (source === 'manual') return 'Update'
  return 'Signal'
}

function sourceActionLabel(source) {
  if (source === 'github') return 'View on GitHub'
  if (source === 'linkedin') return 'View on LinkedIn'
  if (source === 'leetcode') return 'View on LeetCode'
  if (source === 'notion') return 'Open in Notion'
  return 'Read more'
}

function Posts() {
  const { siteContent } = useSiteContent()
  const content = siteContent.postsPage
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeFeed, setActiveFeed] = useState('all')

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
  const linkedinPosts = posts.filter((post) => detectPostSource(post) === 'linkedin')
  const leetcodePosts = posts.filter((post) => detectPostSource(post) === 'leetcode')
  const notionPosts = posts.filter((post) => detectPostSource(post) === 'notion')
  const visiblePosts = activeFeed === 'github' ? githubPosts : activeFeed === 'manual' ? manualPosts : posts
  const featuredPost = visiblePosts[0]
  const featuredSource = featuredPost ? detectPostSource(featuredPost) : 'other'

  return (
    <div className="page-shell posts-shell">
      <section className="container page-hero" data-reveal="up">
        <span className="eyebrow">{content.eyebrow}</span>
        <h1>{content.title}</h1>
        <p className="page-lead">{content.lead}</p>
      </section>

      <section className="container page-section" data-reveal="scale">
        <div className="picker-row">
          <button type="button" className={`picker-chip ${activeFeed === 'all' ? 'is-active' : ''}`} onClick={() => setActiveFeed('all')}>All</button>
          <button type="button" className={`picker-chip ${activeFeed === 'manual' ? 'is-active' : ''}`} onClick={() => setActiveFeed('manual')}>Manual</button>
          <button type="button" className={`picker-chip ${activeFeed === 'github' ? 'is-active' : ''}`} onClick={() => setActiveFeed('github')}>GitHub</button>
        </div>
      </section>

      <section className="container page-section" data-reveal="up">
        <div className="feed-dashboard-strip">
          <article className="widget-card">
            <span className="eyebrow">All</span>
            <strong>{posts.length}</strong>
          </article>
          <article className="widget-card">
            <span className="eyebrow">Manual</span>
            <strong>{manualPosts.length}</strong>
          </article>
          <article className="widget-card">
            <span className="eyebrow">GitHub</span>
            <strong>{githubPosts.length}</strong>
          </article>
          <article className="widget-card">
            <span className="eyebrow">LinkedIn</span>
            <strong>{linkedinPosts.length}</strong>
          </article>
          <article className="widget-card">
            <span className="eyebrow">LeetCode</span>
            <strong>{leetcodePosts.length}</strong>
          </article>
          <article className="widget-card">
            <span className="eyebrow">Notion</span>
            <strong>{notionPosts.length}</strong>
          </article>
        </div>
      </section>

      <section className="container page-section" data-reveal="scale">
        <div className="feed-spectrum-grid">
          <article className="feed-spectrum-card">
            <span className="eyebrow">Signal</span>
            <h3>Manual notes</h3>
            <p>{manualPosts.length} curated thoughts and updates.</p>
          </article>
          <article className="feed-spectrum-card">
            <span className="eyebrow">Velocity</span>
            <h3>GitHub activity</h3>
            <p>{githubPosts.length} automated development traces.</p>
          </article>
          <article className="feed-spectrum-card">
            <span className="eyebrow">Blend</span>
            <h3>Story + source</h3>
            <p>A feed that mixes authored context with actual project motion.</p>
          </article>
        </div>
      </section>

      {featuredPost && (
        <section className="container page-section" data-reveal="up">
          <article className={`featured-post source-${featuredSource}`}>
            <span className="eyebrow">{content.featuredLabel}</span>
            <h2>{featuredPost.title}</h2>
            <p>{featuredPost.content}</p>
            <div className="feed-meta">
              <span>{new Date(featuredPost.date).toLocaleDateString()}</span>
              <span>{sourceLabel(featuredSource)}</span>
            </div>
            {featuredPost.link && (
              <a href={featuredPost.link} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">
                {sourceActionLabel(featuredSource)}
              </a>
            )}
          </article>
        </section>
      )}

      {posts.length === 0 ? (
        <section className="container page-section">
          <div className="card text-center">
            <p>{content.emptyText}</p>
          </div>
        </section>
      ) : (
        <section className="container page-section">
          <div className="posts-grid">
            {visiblePosts.map((post, index) => (
              <article
                key={post.id}
                className={`post-card source-${detectPostSource(post)}`}
                data-reveal={index % 2 === 0 ? 'up' : 'scale'}
              >
                <div className="project-card-top">
                  <span className="eyebrow">{sourceLabel(detectPostSource(post))}</span>
                  <span className="metric-pill">{new Date(post.date).toLocaleDateString()}</span>
                </div>
                <h3>{post.title}</h3>
                <p>{post.content}</p>
                {post.link && (
                  <a href={post.link} target="_blank" rel="noopener noreferrer" className="post-link">
                    {sourceActionLabel(detectPostSource(post))} →
                  </a>
                )}
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="container page-section inline-actions" data-reveal="up">
        {content.actions.map((action) => (
          <Link key={action.href} to={action.href} className={action.primary ? 'btn btn-primary' : 'btn btn-secondary'}>
            {action.label}
          </Link>
        ))}
      </section>
    </div>
  )
}

export default Posts
