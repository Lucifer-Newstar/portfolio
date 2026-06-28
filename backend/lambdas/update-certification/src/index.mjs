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
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json"
        },
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
    
    if (body.name !== undefined) {
      updateExpression += "#certName = :name, ";
      expressionAttributeNames["#certName"] = "name";
      expressionAttributeValues[":name"] = body.name;
    }
    if (body.issuer !== undefined) {
      updateExpression += "issuer = :issuer, ";
      expressionAttributeValues[":issuer"] = body.issuer;
    }
    if (body.date !== undefined) {
      updateExpression += "#certDate = :date, ";
      expressionAttributeNames["#certDate"] = "date";
      expressionAttributeValues[":date"] = body.date;
    }
    if (body.link !== undefined) {
      updateExpression += "link = :link, ";
      expressionAttributeValues[":link"] = body.link;
    }
    if (body.skills !== undefined) {
      updateExpression += "skills = :skills, ";
      expressionAttributeValues[":skills"] = body.skills;
    }
    if (body.order !== undefined) {
      updateExpression += "#certOrder = :order, ";
      expressionAttributeNames["#certOrder"] = "order";
      expressionAttributeValues[":order"] = body.order;
    }
    
    if (Object.keys(expressionAttributeValues).length === 0) {
      return {
        statusCode: 400,
        headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" },
        body: JSON.stringify({ error: "At least one certification field is required" })
      };
    }

    updateExpression = updateExpression.slice(0, -2);
    
    const command = new UpdateCommand({
      TableName: "certifications",
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
      body: JSON.stringify({ 
        message: "Certification updated successfully", 
        updated: response.Attributes 
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
