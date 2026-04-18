import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const inputPath = process.argv[2]

if (!inputPath) {
  console.error('Usage: node scripts/import-skills-json-safe.mjs <path-to-skills-json>')
  process.exit(1)
}

function slugify(value = '') {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function normalizeText(value = '') {
  return String(value)
    .replace(/â†’/g, '->')
    .replace(/â€¦/g, '...')
    .replace(/â€™/g, "'")
    .replace(/â€œ/g, '"')
    .replace(/â€/g, '"')
    .replace(/â€"/g, '"')
    .replace(/Â/g, '')
    .replace(/Ã¢â€ â€™/g, '->')
    .replace(/Ã¢â‚¬Â¦/g, '...')
    .replace(/Ã¢â‚¬â„¢/g, "'")
    .replace(/Ã¢â‚¬Å“/g, '"')
    .replace(/Ã¢â‚¬Â/g, '"')
    .replace(/Ã¢â‚¬/g, '"')
    .replace(/Ã‚/g, '')
    .trim()
}

function normalizeSubItems(value) {
  if (!Array.isArray(value)) return []
  return value.map((item) => normalizeText(item)).filter(Boolean)
}

const raw = readFileSync(resolve(inputPath), 'utf8')
const parsed = JSON.parse(raw)

if (!Array.isArray(parsed.groups)) {
  throw new Error('Input JSON must contain a groups array')
}

const groups = parsed.groups.map((group, index) => {
  const concepts = []
  const toolsAndTechnologies = []

  for (const item of group.items || []) {
    const entry = {
      id: `skills-group-${group.group_id}-${slugify(item.name)}`,
      name: normalizeText(item.name),
    }

    if (normalizeText(item.type).toLowerCase() === 'concept') {
      entry.subConcepts = normalizeSubItems(item.sub_items)
      concepts.push(entry)
      continue
    }

    if (normalizeText(item.type).toLowerCase() === 'tool') {
      entry.subSkills = normalizeSubItems(item.sub_items)
      toolsAndTechnologies.push(entry)
      continue
    }

    throw new Error(`Unsupported item type "${item.type}" in group ${group.group_name}`)
  }

  return {
    id: `skills-group-${group.group_id}-${slugify(group.group_name)}`,
    category: normalizeText(group.group_name),
    order: Number(group.group_id) || index + 1,
    concepts,
    toolsAndTechnologies,
  }
})

const seedPath = resolve('scripts', 'skills-seed.json')
const batchPath = resolve('scripts', 'skills-batch-write.json')
const legacyIdsToDelete = ['skill-docker', 'test-skill']

writeFileSync(seedPath, `${JSON.stringify(groups, null, 2)}\n`)

const batchPayload = {
  RequestItems: {
    skills: [
      ...legacyIdsToDelete.map((id) => ({
        DeleteRequest: {
          Key: { id },
        },
      })),
      ...groups.map((item) => ({
        PutRequest: {
          Item: item,
        },
      })),
    ],
  },
}

writeFileSync(batchPath, `${JSON.stringify(batchPayload, null, 2)}\n`)

console.log(`Prepared ${groups.length} group records from ${inputPath}`)
console.log(`Seed file: ${seedPath}`)
console.log(`Batch file: ${batchPath}`)
