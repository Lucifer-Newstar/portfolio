import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "us-east-1" });
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  // Log everything to see what's coming
  console.log("=== FULL EVENT RECEIVED ===");
  console.log(JSON.stringify(event, null, 2));
  console.log("=== pathParameters ===");
  console.log(event.pathParameters);
  console.log("=== pathParameters.id ===");
  console.log(event.pathParameters?.id);
  
  try {
    // Try to get ID from multiple possible locations
    const id = event.pathParameters?.id || event.pathParams?.id || event.id;
    
    console.log("Extracted ID:", id);
    
    if (!id) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          error: "ID is required in path",
          receivedEvent: {
            hasPathParameters: !!event.pathParameters,
            pathParameters: event.pathParameters,
            hasPathParams: !!event.pathParams,
            allKeys: Object.keys(event)
          }
        })
      };
    }
    
    // Parse the body
    let body;
    if (event.body) {
      body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    } else {
      body = event;
    }
    
    console.log("Parsed body:", body);
    
    // Build update expression
    let updateExpression = "SET ";
    const expressionAttributeValues = {};
    const expressionAttributeNames = {};
    
    if (body.title !== undefined) {
      updateExpression += "#postTitle = :title, ";
      expressionAttributeNames["#postTitle"] = "title";
      expressionAttributeValues[":title"] = body.title;
    }
    if (body.content !== undefined) {
      updateExpression += "#postContent = :content, ";
      expressionAttributeNames["#postContent"] = "content";
      expressionAttributeValues[":content"] = body.content;
    }
    if (body.link !== undefined) {
      updateExpression += "link = :link, ";
      expressionAttributeValues[":link"] = body.link;
    }
    if (body.date !== undefined) {
      updateExpression += "#postDate = :date, ";
      expressionAttributeNames["#postDate"] = "date";
      expressionAttributeValues[":date"] = body.date;
    }
    if (body.visible !== undefined) {
      updateExpression += "visible = :visible, ";
      expressionAttributeValues[":visible"] = body.visible;
    }
    if (body.order !== undefined) {
      updateExpression += "#postOrder = :order, ";
      expressionAttributeNames["#postOrder"] = "order";
      expressionAttributeValues[":order"] = body.order;
    }
    
    updateExpression = updateExpression.slice(0, -2);
    
    const command = new UpdateCommand({
      TableName: "posts",
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
        message: "Post updated successfully", 
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