import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchSkills } from '../../utils/api'
import { HorizontalGraph, MicroBarChart, PieChart } from '../../components/InsightCharts'
import LinkedDataModal from '../../components/LinkedDataModal'
import { useSiteContent } from '../../context/useSiteContent'
import { deriveSkillInsights } from '../../utils/portfolioInsights'

function Skills() {
  const { siteContent } = useSiteContent()
  const content = siteContent.skillsPage
  const [skills, setSkills] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState({ type: '', id: '', name: '' })
  const [activeCategory, setActiveCategory] = useState('All')

  useEffect(() => {
    const loadSkills = async () => {
      const data = await fetchSkills()
      setSkills(data)
      setLoading(false)
    }
    loadSkills()
  }, [])

  const handleSkillClick = (skill) => {
    setSelectedItem({
      type: 'skill',
      id: skill.id,
      name: skill.name
    })
    setModalOpen(true)
  }

  if (loading) {
    return <div className="container text-center mt-4">Loading skills...</div>
  }

  const insights = deriveSkillInsights(skills)
  const categories = ['All', ...insights.categories.map((item) => item.category)]
  const filteredGroups = activeCategory === 'All'
    ? insights.categories
    : insights.categories.filter((item) => item.category === activeCategory)

  return (
    <div className="page-shell skills-shell">
      <section className="container page-hero" data-reveal="up">
        <span className="eyebrow">{content.eyebrow}</span>
        <h1>{content.title}</h1>
        <p className="page-lead">{content.lead}</p>
      </section>

      <section className="container page-section" data-reveal="scale">
        <div className="skills-signal-board">
          {insights.categories.slice(0, 3).map(({ category, skills: categorySkills, completion, subskillCount }) => (
            <article key={category} className="widget-card skill-signal-card">
              <span className="eyebrow">{category}</span>
              <strong>{completion}%</strong>
              <p>{categorySkills.length} skills · {subskillCount} sub-skills.</p>
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
            color: ['#ff8e5f', '#3456d1', '#d94d78', '#f3c357', '#69e2ff'][index % 5]
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
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      <section className="container page-section">
        <div className="skills-grid">
          {filteredGroups.map(({ category, skills: categorySkills, completion }, index) => (
            <article key={category} className="skill-category" data-reveal={index % 2 === 0 ? 'up' : 'scale'}>
              <div className="skill-category-header">
                <h2>{category}</h2>
                <span className="metric-pill">{categorySkills.length} items · {completion}%</span>
              </div>
              <div className="skill-card-grid">
                {categorySkills.map((skill) => (
                  <button
                    key={skill.id}
                    type="button"
                    className="skill-tile"
                    onClick={() => handleSkillClick(skill)}
                  >
                    <strong>{skill.name}</strong>
                    <span>{skill.level} · {skill.completion}%</span>
                    <div className="level-meter">
                      <span style={{ width: `${skill.completion}%` }} />
                    </div>
                    <div className="subskill-cloud">
                      {skill.subskills.map((subskill) => (
                        <span key={`${skill.id}-${subskill.name}`} className="skill-tag subskill-tag">
                          {subskill.name} {subskill.completion}%
                        </span>
                      ))}
                    </div>
                  </button>
                ))}
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

      <LinkedDataModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        itemType={selectedItem.type}
        itemId={selectedItem.id}
        itemName={selectedItem.name}
      />
    </div>
  )
}

export default Skills
