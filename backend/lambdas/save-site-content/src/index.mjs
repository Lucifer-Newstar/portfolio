import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, DeleteCommand, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "us-east-1" });
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = "site_content";
const CONTENT_ID = "global";
const DEFAULT_ALLOWED_ORIGINS = "http://localhost:5173,https://lucifernewstar-2006.xyz";
const MAX_REQUEST_BYTES = 5 * 1024 * 1024;
const CHUNK_SIZE_BYTES = 320 * 1024;

function corsHeaders(event) {
  const allowedOrigins = String(process.env.ALLOWED_ORIGINS || DEFAULT_ALLOWED_ORIGINS)
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
  const requestOrigin = event?.headers?.origin || event?.headers?.Origin || "";
  const origin = allowedOrigins.includes(requestOrigin)
    ? requestOrigin
    : (allowedOrigins[0] || "*");

  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Content-Type": "application/json",
  };
}

function parseBody(event) {
  if (!event?.body) return event || {};
  return typeof event.body === "string" ? JSON.parse(event.body) : event.body;
}

function chunkContent(serialized) {
  const chunks = [];
  for (let start = 0; start < serialized.length; start += CHUNK_SIZE_BYTES) {
    chunks.push(serialized.slice(start, start + CHUNK_SIZE_BYTES));
  }
  return chunks;
}

function getChunkId(index) {
  return `${CONTENT_ID}#${String(index + 1).padStart(4, "0")}`;
}

async function validateAdminToken(event) {
  const userInfoUrl = process.env.COGNITO_USERINFO_URL;
  if (!userInfoUrl) return false;

  const authHeader =
    event?.headers?.Authorization ||
    event?.headers?.authorization ||
    "";

  if (!authHeader.startsWith("Bearer ")) {
    return false;
  }

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

export const handler = async (event) => {
  try {
    const method =
      event?.httpMethod ||
      event?.requestContext?.http?.method ||
      event?.requestContext?.httpMethod ||
      "";

    // Handle OPTIONS preflight
    if (method === "OPTIONS") {
      return { statusCode: 200, headers: corsHeaders(event), body: JSON.stringify({ ok: true }) };
    }

    const authorized = await validateAdminToken(event);
    if (!authorized) {
      return {
        statusCode: 401,
        headers: corsHeaders(event),
        body: JSON.stringify({ error: "Unauthorized admin request." })
      };
    }

    let body;
    try {
      body = parseBody(event);
    } catch {
      return {
        statusCode: 400,
        headers: corsHeaders(event),
        body: JSON.stringify({ error: "Invalid JSON payload." })
      };
    }
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return {
        statusCode: 400,
        headers: corsHeaders(event),
        body: JSON.stringify({ error: "Payload must be a JSON object." })
      };
    }

    const serializedContent = JSON.stringify(body);
    const bodyBytes = Buffer.byteLength(serializedContent);
    if (bodyBytes > MAX_REQUEST_BYTES) {
      return {
        statusCode: 413,
        headers: corsHeaders(event),
        body: JSON.stringify({ error: "Payload too large. Limit is 5MB." })
      };
    }

    const existing = await docClient.send(new GetCommand({
      TableName: TABLE_NAME,
      Key: { id: CONTENT_ID },
    }));

    const previousChunkCount = Number(existing.Item?.chunkCount || 0);
    const chunks = chunkContent(serializedContent);
    const updatedAt = new Date().toISOString();

    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        id: CONTENT_ID,
        storage: "chunked",
        chunkCount: chunks.length,
        updatedAt
      }
    });

    await docClient.send(command);
    for (let index = 0; index < chunks.length; index += 1) {
      await docClient.send(new PutCommand({
        TableName: TABLE_NAME,
        Item: {
          id: getChunkId(index),
          chunk: chunks[index],
          part: index + 1,
          updatedAt,
        },
      }));
    }

    for (let index = chunks.length; index < previousChunkCount; index += 1) {
      await docClient.send(new DeleteCommand({
        TableName: TABLE_NAME,
        Key: { id: getChunkId(index) },
      }));
    }

    return {
      statusCode: 200,
      headers: corsHeaders(event),
      body: JSON.stringify({ message: "Content saved successfully.", chunkCount: chunks.length })
    };
  } catch (error) {
    console.error("save-site-content failed:", error);
    return {
      statusCode: 500,
      headers: corsHeaders(event),
      body: JSON.stringify({ error: "Unable to save content." })
    };
  }
};
