import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "us-east-1" });
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = "site_content";
const CONTENT_ID = "global";

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Content-Type": "application/json",
  };
}

function parseBody(event) {
  if (!event?.body) return event || {};
  return typeof event.body === "string" ? JSON.parse(event.body) : event.body;
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
      return { statusCode: 200, headers: corsHeaders(), body: JSON.stringify({ ok: true }) };
    }

    let body;
    try {
      body = parseBody(event);
    } catch {
      return {
        statusCode: 400,
        headers: corsHeaders(),
        body: JSON.stringify({ error: "Invalid JSON payload." })
      };
    }
    const content = body;

    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        id: CONTENT_ID,
        content: content,
        updatedAt: new Date().toISOString()
      }
    });

    await docClient.send(command);

    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify({ message: "Content saved successfully." })
    };
  } catch (error) {
    console.error("save-site-content failed:", error);
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({ error: "Unable to save content." })
    };
  }
};
