import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "us-east-1" });
const docClient = DynamoDBDocumentClient.from(client);
const DEFAULT_COGNITO_USERINFO_URL = "https://us-east-1iwnapdbk8.auth.us-east-1.amazoncognito.com/oauth2/userInfo";

async function validateAdminToken(event) {
  const userInfoUrl = process.env.COGNITO_USERINFO_URL || DEFAULT_COGNITO_USERINFO_URL;
  const authHeader = event?.headers?.Authorization || event?.headers?.authorization || "";

  if (!authHeader.startsWith("Bearer ")) return false;

  const token = authHeader.slice("Bearer ".length).trim();
  if (!token) return false;

  try {
    const response = await fetch(userInfoUrl, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) return false;
    const payload = await response.json().catch(() => ({}));
    return Boolean(payload?.sub);
  } catch {
    return false;
  }
}

function unauthorizedResponse() {
  return {
    statusCode: 401,
    headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" },
    body: JSON.stringify({ error: "Unauthorized admin request." }),
  };
}

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

function buildSkillItem(existing = {}, updates = {}) {
  const merged = { ...existing, ...updates };
  const id = merged.id?.trim();

  if (!id) {
    throw new Error("Skill id is required");
  }

  const category = (merged.category || merged.group || "").trim();
  const name = typeof merged.name === "string" ? merged.name.trim() : "";
  const item = {
    id,
    category,
    order: Number.isFinite(Number(merged.order)) ? Number(merged.order) : 999,
  };

  if (name) item.name = name;
  if (merged.level) item.level = merged.level;
  if (typeof merged.completion === "number") item.completion = merged.completion;

  const bucket = typeof merged.bucket === "string" ? merged.bucket.trim().toLowerCase() : "";
  if (bucket === "concepts" || bucket === "tools") {
    item.bucket = bucket;
  }

  const subConcepts = sanitizeStringArray(merged.subConcepts ?? merged.subconcepts);
  const subSkills = sanitizeStringArray(merged.subSkills ?? merged.subskills);

  if (item.bucket === "concepts") {
    item.subConcepts = subConcepts;
  } else if (item.bucket === "tools") {
    item.subSkills = subSkills;
  }

  if (Array.isArray(merged.concepts) && !name) {
    item.concepts = merged.concepts;
  }

  const toolsAndTechnologies = merged.toolsAndTechnologies ?? merged.tools ?? merged.technologies;
  if (Array.isArray(toolsAndTechnologies) && !name) {
    item.toolsAndTechnologies = toolsAndTechnologies;
  }

  return item;
}

export const handler = async (event) => {
  const authorized = await validateAdminToken(event);
  if (!authorized) {
    return unauthorizedResponse();
  }
  console.log("Full event:", JSON.stringify(event, null, 2));
  
  try {
    // With proxy integration, the ID is in pathParameters
    const id = event.pathParameters?.id;
    
    console.log("Extracted ID:", id);
    
    if (!id) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ error: "ID is required" })
      };
    }
    
    // Parse body from proxy integration
    let body;
    if (event.body) {
      body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    } else {
      body = {};
    }
    
    console.log("Update data:", body);
    
    const currentResponse = await docClient.send(new GetCommand({
      TableName: "skills",
      Key: { id }
    }));

    const item = buildSkillItem(currentResponse.Item || { id }, { ...body, id });

    await docClient.send(new PutCommand({
      TableName: "skills",
      Item: item
    }));
    
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ 
        message: "Skill updated successfully", 
        updated: item 
      })
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ error: error.message })
    };
  }
};
