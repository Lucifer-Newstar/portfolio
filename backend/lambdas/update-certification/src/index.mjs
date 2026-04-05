import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "us-east-1" });
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
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
    
    // Remove trailing comma and space
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