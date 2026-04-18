import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const outputPath = resolve('scripts', 'skills-seed.json')
const batchOutputPath = resolve('scripts', 'skills-batch-write.json')

function slugify(value = '') {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function finalizeSection(group, section) {
  if (!group || !section) return

  const entry = {
    id: `${group.id}-${slugify(section.name)}`,
    name: section.name,
  }

  if (section.kind === 'Concept') {
    entry.subConcepts = section.items
    group.concepts.push(entry)
  } else {
    entry.subSkills = section.items
    group.toolsAndTechnologies.push(entry)
  }
}

const scriptsDir = resolve('scripts')
const partFiles = readdirSync(scriptsDir)
  .filter((file) => /^skills-source-part-\d+\.md$/.test(file))
  .sort((left, right) => left.localeCompare(right, undefined, { numeric: true }))

const source = partFiles.length > 0
  ? partFiles.map((file) => readFileSync(resolve(scriptsDir, file), 'utf8')).join('\n')
  : readFileSync(resolve('scripts', 'skills-source.md'), 'utf8')
const lines = source.split(/\r?\n/)

const groups = []
let currentGroup = null
let currentSection = null
let groupOrder = 0

for (const rawLine of lines) {
  const line = rawLine.trim()
  if (!line || line === '---') continue

  const groupMatch = line.match(/^### Group \d+:\s+(.+)$/)
  if (groupMatch) {
    finalizeSection(currentGroup, currentSection)
    currentSection = null

    const category = groupMatch[1].trim()
    groupOrder += 1
    currentGroup = {
      id: `skills-group-${groupOrder}-${slugify(category)}`,
      category,
      order: groupOrder,
      concepts: [],
      toolsAndTechnologies: [],
    }
    groups.push(currentGroup)
    continue
  }

  const sectionMatch = line.match(/^#### (Concept|Tool):\s+(.+)$/)
  if (sectionMatch) {
    finalizeSection(currentGroup, currentSection)
    currentSection = {
      kind: sectionMatch[1],
      name: sectionMatch[2].trim(),
      items: [],
    }
    continue
  }

  const itemMatch = line.match(/^- (.+)$/)
  if (itemMatch && currentSection) {
    currentSection.items.push(itemMatch[1].trim())
  }
}

finalizeSection(currentGroup, currentSection)

writeFileSync(outputPath, `${JSON.stringify(groups, null, 2)}\n`)

const batchPayload = {
  RequestItems: {
    skills: [
      { DeleteRequest: { Key: { id: 'skill-docker' } } },
      { DeleteRequest: { Key: { id: 'test-skill' } } },
      ...groups.map((item) => ({
        PutRequest: {
          Item: item,
        },
      })),
    ],
  },
}

writeFileSync(batchOutputPath, `${JSON.stringify(batchPayload, null, 2)}\n`)

console.log(`Generated ${groups.length} grouped skill records.`)
console.log(`Seed file: ${outputPath}`)
console.log(`Batch file: ${batchOutputPath}`)
