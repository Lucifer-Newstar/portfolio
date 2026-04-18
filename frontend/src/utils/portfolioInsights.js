const CATEGORY_CONCEPTS = {
  devops: ['CI/CD', 'Release Strategy', 'Automation', 'Platform Thinking'],
  cloud: ['Architecture', 'Security', 'Reliability', 'Cost Awareness'],
  sre: ['SLIs/SLOs', 'Incident Response', 'Runbooks', 'Observability'],
  monitoring: ['Signals', 'Alerting', 'Dashboards', 'Telemetry Hygiene'],
  kubernetes: ['Cluster Ops', 'Scheduling', 'Scaling', 'Ingress'],
  default: ['Architecture', 'Delivery', 'Automation', 'Reliability'],
}

const CATEGORY_TOOLS = {
  devops: ['Docker', 'GitHub Actions', 'Terraform', 'Release Pipelines'],
  cloud: ['AWS', 'Networking', 'IAM', 'Serverless'],
  sre: ['Prometheus', 'Grafana', 'Runbooks', 'Incident Tooling'],
  monitoring: ['Prometheus', 'Grafana', 'Alerting', 'Dashboards'],
  kubernetes: ['kubectl', 'Helm', 'Ingress', 'Autoscaling'],
  default: ['Tooling', 'Automation', 'Quality', 'Operations'],
}

function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value))
}

function categoryKey(label = '') {
  return label.toLowerCase()
}

function titleCaseLabel(label = '') {
  return label
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

export function completionFromLevel(level = '') {
  const normalized = level.toLowerCase()
  if (normalized.includes('advanced')) return 91
  if (normalized.includes('intermediate')) return 72
  if (normalized.includes('learning')) return 48
  return 64
}

function childCompletionFromValue(value, index, baseCompletion) {
  if (typeof value === 'number') return clamp(value)
  if (typeof value === 'string') return completionFromLevel(value)
  if (value && typeof value === 'object') {
    if (typeof value.completion === 'number') return clamp(value.completion)
    if (typeof value.level === 'string') return completionFromLevel(value.level)
  }

  return clamp(baseCompletion - 8 + index * 4)
}

function normalizeChildEntries(source, fallbackNames, baseCompletion) {
  if (Array.isArray(source) && source.length > 0) {
    return source.map((entry, index) => {
      if (typeof entry === 'string') {
        return {
          name: entry,
          completion: clamp(baseCompletion - 8 + index * 4),
        }
      }

      return {
        name: entry?.name || entry?.label || `Item ${index + 1}`,
        completion: childCompletionFromValue(entry, index, baseCompletion),
      }
    })
  }

  if (source && typeof source === 'object') {
    const entries = Object.entries(source)
    if (entries.length > 0) {
      return entries.map(([name, value], index) => ({
        name: titleCaseLabel(name),
        completion: childCompletionFromValue(value, index, baseCompletion),
      }))
    }
  }

  return fallbackNames.map((name, index) => ({
    name,
    completion: clamp(baseCompletion - 8 + index * 4),
  }))
}

function normalizePrimaryItem(rawItem, bucket, category) {
  const completion = rawItem?.completion ?? completionFromLevel(rawItem?.level)
  const fallbackChildren = bucket === 'concepts'
    ? (CATEGORY_CONCEPTS[categoryKey(category)] || CATEGORY_CONCEPTS.default)
    : (CATEGORY_TOOLS[categoryKey(category)] || CATEGORY_TOOLS.default)

  const childSource = bucket === 'concepts'
    ? rawItem?.subConcepts ?? rawItem?.subconcepts ?? rawItem?.concepts
    : rawItem?.subskills ?? rawItem?.subSkills ?? rawItem?.skills ?? rawItem?.tools ?? rawItem?.technologies

  return {
    id: rawItem?.id || `${category}-${bucket}-${rawItem?.name || rawItem?.title || 'item'}`,
    name: rawItem?.name || rawItem?.title || 'Untitled',
    level: rawItem?.level || 'Intermediate',
    completion,
    children: normalizeChildEntries(childSource, fallbackChildren, completion),
  }
}

function inferBucket(rawSkill) {
  const marker = `${rawSkill?.bucket || rawSkill?.section || rawSkill?.type || rawSkill?.kind || ''}`.toLowerCase()

  if (marker.includes('concept')) return 'concepts'
  if (marker.includes('tool') || marker.includes('tech')) return 'tools'
  if (rawSkill?.subConcepts || rawSkill?.subconcepts) return 'concepts'
  if (rawSkill?.toolsAndTechnologies || rawSkill?.tools || rawSkill?.technologies) return 'tools'
  if (rawSkill?.concepts && !rawSkill?.name) return 'concepts'
  if (rawSkill?.concepts && !rawSkill?.subskills && !rawSkill?.subSkills) return 'concepts'

  return 'tools'
}

function normalizeGroupRecord(rawSkill) {
  const category = rawSkill?.group || rawSkill?.category || 'General'
  const conceptSource = rawSkill?.concepts
  const toolSource = rawSkill?.toolsAndTechnologies ?? rawSkill?.tools ?? rawSkill?.technologies

  const concepts = Array.isArray(conceptSource)
    ? conceptSource.map((item) => normalizePrimaryItem(item, 'concepts', category))
    : []
  const tools = Array.isArray(toolSource)
    ? toolSource.map((item) => normalizePrimaryItem(item, 'tools', category))
    : []

  return { category, concepts, tools }
}

export function deriveSkillInsights(skills = []) {
  const grouped = skills.reduce((acc, rawSkill) => {
    const isGroupRecord =
      !rawSkill?.name &&
      (
        Array.isArray(rawSkill?.concepts) ||
        Array.isArray(rawSkill?.toolsAndTechnologies) ||
        Array.isArray(rawSkill?.tools) ||
        Array.isArray(rawSkill?.technologies)
      )

    const normalized = isGroupRecord
      ? normalizeGroupRecord(rawSkill)
      : (() => {
          const category = rawSkill?.group || rawSkill?.category || 'General'
          const bucket = inferBucket(rawSkill)
          const primaryItem = normalizePrimaryItem(rawSkill, bucket, category)

          return {
            category,
            concepts: bucket === 'concepts' ? [primaryItem] : [],
            tools: bucket === 'tools' ? [primaryItem] : [],
          }
        })()

    if (!acc[normalized.category]) {
      acc[normalized.category] = { category: normalized.category, concepts: [], tools: [] }
    }

    acc[normalized.category].concepts.push(...normalized.concepts)
    acc[normalized.category].tools.push(...normalized.tools)
    return acc
  }, {})

  const categories = Object.values(grouped).map((group, index) => {
    const concepts = group.concepts.map((item, itemIndex) => ({
      ...item,
      category: group.category,
      bucket: 'Concepts',
      visualIndex: (index + itemIndex) % 5,
    }))

    const tools = group.tools.map((item, itemIndex) => ({
      ...item,
      category: group.category,
      bucket: 'Tools & Technologies',
      visualIndex: (index + concepts.length + itemIndex) % 5,
    }))

    const items = [...concepts, ...tools]
    const completion = items.length
      ? Math.round(items.reduce((sum, item) => sum + item.completion, 0) / items.length)
      : 0

    return {
      category: group.category,
      concepts,
      tools,
      items,
      completion,
      itemCount: items.length,
      subskillCount: items.reduce((sum, item) => sum + item.children.length, 0),
    }
  })

  const normalizedSkills = categories.flatMap((group) => group.items)
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
