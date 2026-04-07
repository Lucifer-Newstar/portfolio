const CATEGORY_SUBSKILLS = {
  devops: ['CI/CD', 'IaC', 'Containers', 'Release Safety'],
  cloud: ['AWS Compute', 'Networking', 'Security', 'Automation'],
  sre: ['SLIs/SLOs', 'Incident Response', 'Runbooks', 'Observability'],
  monitoring: ['Prometheus', 'Grafana', 'Alerting', 'Dashboards'],
  kubernetes: ['Cluster Ops', 'Helm', 'Scaling', 'Ingress'],
  default: ['Architecture', 'Delivery', 'Automation', 'Reliability'],
}

function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value))
}

function categoryKey(label = '') {
  return label.toLowerCase()
}

export function completionFromLevel(level = '') {
  const normalized = level.toLowerCase()
  if (normalized.includes('advanced')) return 91
  if (normalized.includes('intermediate')) return 72
  if (normalized.includes('learning')) return 48
  return 64
}

export function deriveSkillInsights(skills = []) {
  const normalizedSkills = skills.map((skill, index) => {
    const completion = skill.completion ?? completionFromLevel(skill.level)
    const subskills = Array.isArray(skill.subskills) && skill.subskills.length
      ? skill.subskills
      : (CATEGORY_SUBSKILLS[categoryKey(skill.category)] || CATEGORY_SUBSKILLS.default).map((item, subIndex) => ({
          name: item,
          completion: clamp(completion - 8 + subIndex * 4),
        }))

    return {
      ...skill,
      completion,
      subskills,
      visualIndex: index % 5,
    }
  })

  const grouped = normalizedSkills.reduce((acc, skill) => {
    const category = skill.category || 'General'
    if (!acc[category]) acc[category] = []
    acc[category].push(skill)
    return acc
  }, {})

  const categories = Object.entries(grouped).map(([category, categorySkills]) => {
    const completion = Math.round(categorySkills.reduce((sum, skill) => sum + skill.completion, 0) / categorySkills.length)
    return {
      category,
      skills: categorySkills,
      completion,
      subskillCount: categorySkills.reduce((sum, skill) => sum + skill.subskills.length, 0),
    }
  })

  const topSkills = [...normalizedSkills].sort((left, right) => right.completion - left.completion).slice(0, 6)

  return {
    skills: normalizedSkills,
    categories,
    topSkills,
  }
}

function estimateProjectCompletion(project = {}) {
  const stackSize = project.tech_stack?.length || 0
  const descriptionScore = Math.min((project.description?.length || 0) / 8, 18)
  const githubScore = project.github_link ? 10 : 0
  const visibilityScore = project.visible === false ? -10 : 0
  return clamp(Math.round(52 + stackSize * 5 + descriptionScore + githubScore + visibilityScore))
}

export function deriveProjectInsights(projects = []) {
  const normalizedProjects = projects.map((project, index) => {
    const completion = project.completion ?? estimateProjectCompletion(project)
    const workstreams = Array.isArray(project.workstreams) && project.workstreams.length
      ? project.workstreams
      : [
          { name: 'Architecture', completion: clamp(completion - 10) },
          { name: 'Delivery', completion: clamp(completion - 2) },
          { name: 'Observability', completion: clamp(completion - 6) },
        ]

    return {
      ...project,
      completion,
      workstreams,
      stackDensity: Math.min(100, (project.tech_stack?.length || 0) * 14),
      visualIndex: index % 6,
    }
  })

  const groupedByTrack = normalizedProjects.reduce((acc, project) => {
    const track = project.tech_stack?.[0] || 'General'
    if (!acc[track]) acc[track] = []
    acc[track].push(project)
    return acc
  }, {})

  const tracks = Object.entries(groupedByTrack).map(([track, trackProjects]) => ({
    track,
    projects: trackProjects,
    completion: Math.round(trackProjects.reduce((sum, project) => sum + project.completion, 0) / trackProjects.length),
  }))

  return {
    projects: normalizedProjects,
    tracks,
    featured: [...normalizedProjects].sort((left, right) => right.completion - left.completion).slice(0, 4),
  }
}

export function buildHomepageSignals(skills = [], projects = []) {
  const skillInsights = deriveSkillInsights(skills)
  const projectInsights = deriveProjectInsights(projects)

  return {
    charts: [
      {
        title: 'Skills completion',
        value: skillInsights.categories[0]?.completion ?? 0,
        detail: `${skillInsights.categories.length} capability lanes`,
      },
      {
        title: 'Projects completion',
        value: projectInsights.featured[0]?.completion ?? 0,
        detail: `${projectInsights.projects.length} active case studies`,
      },
      {
        title: 'Operational readiness',
        value: Math.round(((skillInsights.topSkills[0]?.completion ?? 70) + (projectInsights.featured[0]?.completion ?? 70)) / 2),
        detail: 'Cloud + delivery + observability blend',
      },
    ],
  }
}
