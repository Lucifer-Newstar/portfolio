import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

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

export const handler = async (event) => {
  const authorized = await validateAdminToken(event);
  if (!authorized) {
    return unauthorizedResponse();
  }
  try {
    let body;
    if (typeof event.body === 'string') {
      body = JSON.parse(event.body);
    } else {
      body = event.body;
    }
    
    const { id, title, organization, period, location, description, skills, order } = body || {};

    if (!id?.trim() || !title?.trim() || !organization?.trim() || !period?.trim()) {
      return {
        statusCode: 400,
        headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Experience id, title, organization, and period are required" })
      };
    }
    
    const command = new PutCommand({
      TableName: "experience",
      Item: {
        id: id.trim(),
        title: title.trim(),
        organization: organization.trim(),
        period: period.trim(),
        location: location || "",
        description: description || [],
        skills: skills || [],
        order: Number.isFinite(Number(order)) ? Number(order) : 999
      }
    });
    
    await docClient.send(command);
    
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: "Experience created successfully" })
    };
  } catch (error) {
    console.error(error);
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
