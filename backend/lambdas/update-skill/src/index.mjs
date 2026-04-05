import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "us-east-1" });
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
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
    
    // Build update expression
    let updateExpression = "SET ";
    const expressionAttributeValues = {};
    const expressionAttributeNames = {};
    
    if (body.name !== undefined) {
      updateExpression += "#skillName = :name, ";
      expressionAttributeNames["#skillName"] = "name";
      expressionAttributeValues[":name"] = body.name;
    }
    if (body.category !== undefined) {
      updateExpression += "category = :category, ";
      expressionAttributeValues[":category"] = body.category;
    }
    if (body.level !== undefined) {
      updateExpression += "#skillLevel = :level, ";
      expressionAttributeNames["#skillLevel"] = "level";
      expressionAttributeValues[":level"] = body.level;
    }
    if (body.order !== undefined) {
      updateExpression += "#skillOrder = :order, ";
      expressionAttributeNames["#skillOrder"] = "order";
      expressionAttributeValues[":order"] = body.order;
    }
    
    updateExpression = updateExpression.replace(/,\s*$/, "");
    
    const command = new UpdateCommand({
      TableName: "skills",
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
        message: "Skill updated successfully", 
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