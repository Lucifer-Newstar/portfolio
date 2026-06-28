import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";

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
    const id = event.pathParameters?.id;
    
    if (!id) {
      return {
        statusCode: 400,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ error: "ID is required" })
      };
    }
    
    let body;
    if (typeof event.body === 'string') {
      body = JSON.parse(event.body);
    } else {
      body = event.body;
    }
    
    let updateExpression = "SET ";
    const expressionAttributeValues = {};
    const expressionAttributeNames = {};
    
    if (body.title !== undefined) {
      updateExpression += "#expTitle = :title, ";
      expressionAttributeNames["#expTitle"] = "title";
      expressionAttributeValues[":title"] = body.title;
    }
    if (body.organization !== undefined) {
      updateExpression += "organization = :org, ";
      expressionAttributeValues[":org"] = body.organization;
    }
    if (body.period !== undefined) {
      updateExpression += "period = :period, ";
      expressionAttributeValues[":period"] = body.period;
    }
    if (body.location !== undefined) {
      updateExpression += "location = :loc, ";
      expressionAttributeValues[":loc"] = body.location;
    }
    if (body.description !== undefined) {
      updateExpression += "#expDesc = :desc, ";
      expressionAttributeNames["#expDesc"] = "description";
      expressionAttributeValues[":desc"] = body.description;
    }
    if (body.skills !== undefined) {
      updateExpression += "skills = :skills, ";
      expressionAttributeValues[":skills"] = body.skills;
    }
    if (body.order !== undefined) {
      updateExpression += "#expOrder = :order, ";
      expressionAttributeNames["#expOrder"] = "order";
      expressionAttributeValues[":order"] = body.order;
    }
    
    if (Object.keys(expressionAttributeValues).length === 0) {
      return {
        statusCode: 400,
        headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" },
        body: JSON.stringify({ error: "At least one experience field is required" })
      };
    }

    updateExpression = updateExpression.slice(0, -2);
    
    const command = new UpdateCommand({
      TableName: "experience",
      Key: { id },
      UpdateExpression: updateExpression,
      ExpressionAttributeNames: Object.keys(expressionAttributeNames).length ? expressionAttributeNames : undefined,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: "ALL_NEW"
    });
    
    const response = await docClient.send(command);
    
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(response.Attributes)
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
