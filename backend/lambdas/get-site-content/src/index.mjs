import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "us-east-1" });
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = "site_content";
const CONTENT_ID = "global";

function getChunkId(index) {
  return `${CONTENT_ID}#${String(index + 1).padStart(4, "0")}`;
}

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Content-Type": "application/json",
  };
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

    const command = new GetCommand({
      TableName: TABLE_NAME,
      Key: { id: CONTENT_ID }
    });

    const response = await docClient.send(command);
    const item = response.Item;

    let content = item?.content || {};
    if (item?.storage === "chunked" && Number(item.chunkCount) > 0) {
      const parts = [];
      for (let index = 0; index < Number(item.chunkCount); index += 1) {
        const chunkResponse = await docClient.send(new GetCommand({
          TableName: TABLE_NAME,
          Key: { id: getChunkId(index) },
        }));
        const chunk = chunkResponse.Item?.chunk;
        if (typeof chunk !== "string") {
          throw new Error(`Missing content chunk ${index + 1}`);
        }
        parts.push(chunk);
      }
      content = JSON.parse(parts.join(""));
    }

    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify(content)
    };
  } catch (error) {
    console.error("get-site-content failed:", error);
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({ error: "Unable to retrieve content." })
    };
  }
};
