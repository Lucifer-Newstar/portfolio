import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchSkills } from '../../utils/api'
import { HorizontalGraph, MicroBarChart, PieChart } from '../../components/InsightCharts'
import { useSiteContent } from '../../context/useSiteContent'
import { deriveSkillInsights } from '../../utils/portfolioInsights'

function getSkillTileVariant(skill, index, compactMode) {
  if (compactMode) {
    return skill.children.length >= 8 || skill.name.length > 34
      ? 'skill-tile is-overview-card'
      : 'skill-tile is-overview-card'
  }

  const childCount = skill.children.length
  const nameLength = skill.name.length

  if (childCount >= 9 || nameLength > 34) return 'skill-tile is-featured is-wide'
  if (childCount >= 7) return 'skill-tile is-wide'
  if (childCount >= 5 || index % 4 === 0) return 'skill-tile is-tall'
  return 'skill-tile'
}

function SkillSection({ title, items, expandedSkillId, onSkillClick, emptyLabel, compactMode = false }) {
  const visibleItems = compactMode ? items.slice(0, 3) : items
  const hiddenCount = Math.max(items.length - visibleItems.length, 0)

  return (
    <section className={`skill-section-block ${compactMode ? 'is-overview' : ''}`}>
      <div className="skill-section-header">
        <div>
          <span className="eyebrow">Lane</span>
          <h3>{title}</h3>
        </div>
        <span className="section-count">{items.length}</span>
      </div>

      {items.length > 0 ? (
        <>
          <div className={`skill-card-grid ${compactMode ? 'is-overview' : ''}`}>
            {visibleItems.map((skill, index) => {
              const isExpanded = expandedSkillId === skill.id

              return (
                <button
                  key={skill.id}
                  type="button"
                  className={`${getSkillTileVariant(skill, index, compactMode)} ${isExpanded ? 'is-expanded' : ''}`}
                  onClick={() => onSkillClick(skill)}
                  aria-expanded={isExpanded}
                >
                  <div className="skill-tile-header">
                    <div className="skill-tile-heading">
                      <strong>{skill.name}</strong>
                      <p className="skill-tile-hint">{isExpanded ? 'Click to collapse' : 'Click to view sub-items'}</p>
                    </div>
                    <span className="skill-tile-count">{skill.children.length} sub-items</span>
                  </div>

                  {isExpanded ? (
                    <div className="skill-detail-list">
                      {skill.children.map((subskill) => (
                        <span key={`${skill.id}-${subskill.name}`} className="skill-detail-item">
                          {subskill.name}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </button>
              )
            })}
          </div>
          {compactMode && hiddenCount > 0 ? (
            <p className="skill-section-note">+{hiddenCount} more {title.toLowerCase()} in this group. Open the filter above for the full lane.</p>
          ) : null}
        </>
      ) : (
        <p className="skill-section-empty">{emptyLabel}</p>
      )}
    </section>
  )
}

function Skills() {
  const { siteContent } = useSiteContent()
  const content = siteContent.skillsPage
  const [skills, setSkills] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')
  const [expandedSkillId, setExpandedSkillId] = useState('')

  useEffect(() => {
    const loadSkills = async () => {
      const data = await fetchSkills()
      setSkills(data)
      setLoading(false)
    }
    loadSkills()
  }, [])

  const handleSkillClick = (skill) => {
    setExpandedSkillId((currentId) => (currentId === skill.id ? '' : skill.id))
  }

  if (loading) {
    return <div className="container text-center mt-4">Loading skills...</div>
  }

  const insights = deriveSkillInsights(skills)
  const categories = ['All', ...insights.categories.map((item) => item.category)]
  const filteredGroups = activeCategory === 'All'
    ? insights.categories
    : insights.categories.filter((item) => item.category === activeCategory)
  const isOverview = activeCategory === 'All'

  return (
    <div className="page-shell skills-shell">
      <section className="container page-hero" data-reveal="up">
        <span className="eyebrow">{content.eyebrow}</span>
        <h1>{content.title}</h1>
        <p className="page-lead">{content.lead}</p>
      </section>

      <section className="container page-section" data-reveal="scale">
        <div className="skills-signal-board">
          {insights.categories.slice(0, 3).map(({ category, itemCount, completion, subskillCount }) => (
            <article key={category} className="widget-card skill-signal-card">
              <span className="eyebrow">{category}</span>
              <strong>{completion}%</strong>
              <p>{itemCount} focus areas • {subskillCount} sub-items.</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container page-section" data-reveal="up">
        <div className="homepage-graph-zone">
          <HorizontalGraph
            title="Completion by skill lane"
            items={insights.categories.map((item) => ({ label: item.category, value: item.completion }))}
          />
          <MicroBarChart
            title="Top skill depth"
            items={insights.topSkills.slice(0, 5).map((item) => ({ label: item.name.slice(0, 10), value: item.completion }))}
          />
        </div>
      </section>

      <section className="container page-section" data-reveal="scale">
        <PieChart
          title="Capability distribution"
          items={insights.categories.slice(0, 5).map((item, index) => ({
            label: item.category,
            value: item.completion,
            color: ['#ff8e5f', '#3456d1', '#d94d78', '#f3c357', '#69e2ff'][index % 5],
          }))}
        />
      </section>

      <section className="container page-section" data-reveal="scale">
        <div className="picker-row wrap">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={`picker-chip ${activeCategory === category ? 'is-active' : ''}`}
              onClick={() => {
                setActiveCategory(category)
                setExpandedSkillId('')
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      <section className="container page-section">
        <div className={`skills-grid ${isOverview ? 'is-overview' : ''}`}>
          {filteredGroups.map(({ category, concepts, tools, itemCount, completion }, index) => (
            <article key={category} className={`skill-category ${isOverview ? 'is-overview' : ''}`} data-reveal={index % 2 === 0 ? 'up' : 'scale'}>
              <div className="skill-category-header">
                <div className="skill-category-copy">
                  <h2>{category}</h2>
                  <p>
                    {isOverview
                      ? `${concepts.length} concepts and ${tools.length} tools in this group.`
                      : `${concepts.length} concepts and ${tools.length} tools arranged in adaptive bento lanes.`}
                  </p>
                </div>
                <span className="metric-pill">{itemCount} items • {completion}%</span>
              </div>

              <div className={`skill-lane-grid ${isOverview ? 'is-overview' : ''}`}>
                <SkillSection
                  title="Concepts"
                  items={concepts}
                  expandedSkillId={expandedSkillId}
                  onSkillClick={handleSkillClick}
                  emptyLabel="No concepts added in this group yet."
                  compactMode={isOverview}
                />
                <SkillSection
                  title="Tools & Technologies"
                  items={tools}
                  expandedSkillId={expandedSkillId}
                  onSkillClick={handleSkillClick}
                  emptyLabel="No tools added in this group yet."
                  compactMode={isOverview}
                />
              </div>
            </article>
          ))}
        </div>
      </section>

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

export default Skills
