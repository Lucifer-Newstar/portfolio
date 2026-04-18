import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "us-east-1" });
const docClient = DynamoDBDocumentClient.from(client);

function sanitizeStringArray(value) {
  if (Array.isArray(value)) {
    return value
      .map((item) => (typeof item === "string" ? item.trim() : item?.name || item?.label || ""))
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function buildSkillItem(input = {}) {
  const id = input.id?.trim();
  if (!id) {
    throw new Error("Skill id is required");
  }

  const category = (input.category || input.group || "").trim();
  const name = typeof input.name === "string" ? input.name.trim() : "";
  const item = {
    id,
    category,
    order: Number.isFinite(Number(input.order)) ? Number(input.order) : 999,
  };

  if (name) item.name = name;
  if (input.level) item.level = input.level;
  if (typeof input.completion === "number") item.completion = input.completion;

  const bucket = typeof input.bucket === "string" ? input.bucket.trim().toLowerCase() : "";
  if (bucket === "concepts" || bucket === "tools") {
    item.bucket = bucket;
  }

  const subConcepts = sanitizeStringArray(input.subConcepts ?? input.subconcepts);
  const subSkills = sanitizeStringArray(input.subSkills ?? input.subskills);

  if (item.bucket === "concepts") {
    item.subConcepts = subConcepts;
  } else if (item.bucket === "tools") {
    item.subSkills = subSkills;
  }

  if (Array.isArray(input.concepts) && !name) {
    item.concepts = input.concepts;
  }

  const toolsAndTechnologies = input.toolsAndTechnologies ?? input.tools ?? input.technologies;
  if (Array.isArray(toolsAndTechnologies) && !name) {
    item.toolsAndTechnologies = toolsAndTechnologies;
  }

  return item;
}

export const handler = async (event) => {
  console.log("Event received:", JSON.stringify(event))
  
  try {
    let body
    
    if (typeof event.body === 'string') {
      body = JSON.parse(event.body)
    } else {
      body = event.body
    }
    
    console.log("Parsed body:", body)
    
    const item = buildSkillItem(body)

    const command = new PutCommand({
      TableName: "skills",
      Item: item
    })
    
    const result = await docClient.send(command)
    console.log("DynamoDB result:", result)
    
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ 
        message: "Skill created successfully", 
        data: item 
      })
    }
  } catch (error) {
    console.error("Error:", error)
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ error: error.message })
    }
  }
}
