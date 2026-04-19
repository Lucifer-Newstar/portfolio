import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DeleteCommand, DynamoDBDocumentClient, GetCommand, PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";

const REGION = process.env.AWS_REGION || "us-east-1";
const client = new DynamoDBClient({ region: REGION });
const docClient = DynamoDBDocumentClient.from(client);

const DEFAULT_ALLOWED_ORIGINS = "http://localhost:5173,https://lucifernewstar-2006.xyz";
const COLLECTION_TABLES = {
  learning_log: process.env.LEARNING_LOG_TABLE || "learning_log",
  cert_progress: process.env.CERT_PROGRESS_TABLE || "cert_progress",
  study_notes: process.env.STUDY_NOTES_TABLE || "study_notes",
  resources: process.env.RESOURCES_TABLE || "resources",
  workout_log: process.env.WORKOUT_LOG_TABLE || "workout_log",
  calisthenics_progress: process.env.CALISTHENICS_TABLE || "calisthenics_progress",
  body_stats: process.env.BODY_STATS_TABLE || "body_stats",
  goals: process.env.GOALS_TABLE || "goals",
  daily_status: process.env.DAILY_STATUS_TABLE || "daily_status",
  hobby_items: process.env.HOBBY_ITEMS_TABLE || "hobby_items",
  personal_projects: process.env.PERSONAL_PROJECTS_TABLE || "personal_projects",
};

function corsHeaders(event) {
  const allowedOrigins = String(process.env.ALLOWED_ORIGINS || DEFAULT_ALLOWED_ORIGINS)
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
  const requestOrigin = event?.headers?.origin || event?.headers?.Origin || "";
  const origin = allowedOrigins.includes(requestOrigin) ? requestOrigin : (allowedOrigins[0] || "*");

  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    "Content-Type": "application/json",
  };
}

function response(event, statusCode, body) {
  return {
    statusCode,
    headers: corsHeaders(event),
    body: JSON.stringify(body),
  };
}

async function validateAdminToken(event) {
  const userInfoUrl = process.env.COGNITO_USERINFO_URL;
  if (!userInfoUrl) return false;

  const authHeader = event?.headers?.Authorization || event?.headers?.authorization || "";
  if (!authHeader.startsWith("Bearer ")) return false;

  try {
    const token = authHeader.slice("Bearer ".length).trim();
    const result = await fetch(userInfoUrl, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!result.ok) return false;
    const payload = await result.json().catch(() => ({}));
    return Boolean(payload?.sub);
  } catch {
    return false;
  }
}

function parseBody(event) {
  if (!event?.body) return {};
  return typeof event.body === "string" ? JSON.parse(event.body) : event.body;
}

function getCollectionName(event) {
  return event?.pathParameters?.collection || event?.queryStringParameters?.collection || "";
}

export const handler = async (event) => {
  const method = event?.httpMethod || event?.requestContext?.http?.method || "";

  if (method === "OPTIONS") {
    return response(event, 200, { ok: true });
  }

  const authorized = await validateAdminToken(event);
  if (!authorized) {
    return response(event, 401, { error: "Unauthorized admin request." });
  }

  const collectionName = getCollectionName(event);
  const tableName = COLLECTION_TABLES[collectionName];
  if (!tableName) {
    return response(event, 400, { error: "Unsupported private collection." });
  }

  try {
    if (method === "GET") {
      const result = await docClient.send(new ScanCommand({ TableName: tableName }));
      return response(event, 200, Array.isArray(result.Items) ? result.Items : []);
    }

    if (method === "POST" || method === "PUT") {
      const body = parseBody(event);
      const item = {
        ...body,
        id: body?.id || `${collectionName}-${Date.now()}`,
        updatedAt: new Date().toISOString(),
      };

      await docClient.send(new PutCommand({
        TableName: tableName,
        Item: item,
      }));

      return response(event, 200, item);
    }

    if (method === "DELETE") {
      const id = event?.pathParameters?.id || event?.queryStringParameters?.id;
      if (!id) {
        return response(event, 400, { error: "Item id is required." });
      }

      const existing = await docClient.send(new GetCommand({
        TableName: tableName,
        Key: { id },
      }));

      if (!existing.Item) {
        return response(event, 404, { error: "Item not found." });
      }

      await docClient.send(new DeleteCommand({
        TableName: tableName,
        Key: { id },
      }));

      return response(event, 200, { deleted: true, id });
    }

    return response(event, 405, { error: "Method not allowed." });
  } catch (error) {
    console.error("lucifer-collections failed:", error);
    return response(event, 500, { error: error.message || "Unable to process private collection request." });
  }
};
