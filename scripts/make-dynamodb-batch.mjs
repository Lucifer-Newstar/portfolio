import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

function toAttributeValue(value) {
  if (value === null || value === undefined) {
    return { NULL: true }
  }

  if (Array.isArray(value)) {
    return { L: value.map(toAttributeValue) }
  }

  if (typeof value === 'string') {
    return { S: value }
  }

  if (typeof value === 'number') {
    return { N: String(value) }
  }

  if (typeof value === 'boolean') {
    return { BOOL: value }
  }

  if (typeof value === 'object') {
    const mapped = {}
    for (const [key, child] of Object.entries(value)) {
      mapped[key] = toAttributeValue(child)
    }
    return { M: mapped }
  }

  throw new Error(`Unsupported value type: ${typeof value}`)
}

const seed = JSON.parse(readFileSync(resolve('scripts', 'skills-seed.json'), 'utf8'))

const requestItems = [
  {
    DeleteRequest: {
      Key: {
        id: { S: 'skill-docker' },
      },
    },
  },
  {
    DeleteRequest: {
      Key: {
        id: { S: 'test-skill' },
      },
    },
  },
  ...seed.map((item) => ({
    PutRequest: {
      Item: Object.fromEntries(
        Object.entries(item).map(([key, value]) => [key, toAttributeValue(value)])
      ),
    },
  })),
]

const payload = {
  RequestItems: {
    skills: requestItems,
  },
}

writeFileSync(resolve('scripts', 'skills-batch-dynamodb.json'), `${JSON.stringify(payload, null, 2)}\n`)
console.log(`Wrote DynamoDB batch payload with ${requestItems.length} requests.`)
