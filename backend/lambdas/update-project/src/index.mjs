import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "us-east-1" });
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  try {
    const id = event.pathParameters?.id
    
    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "ID is required" })
      }
    }
    
    let body
    if (typeof event.body === 'string') {
      body = JSON.parse(event.body)
    } else {
      body = event.body
    }
    
    let updateExpression = "SET "
    const expressionAttributeValues = {}
    const expressionAttributeNames = {}
    
    if (body.title !== undefined) {
      updateExpression += "#projTitle = :title, "
      expressionAttributeNames["#projTitle"] = "title"
      expressionAttributeValues[":title"] = body.title
    }
    if (body.description !== undefined) {
      updateExpression += "#projDesc = :desc, "
      expressionAttributeNames["#projDesc"] = "description"
      expressionAttributeValues[":desc"] = body.description
    }
    if (body.tech_stack !== undefined) {
      updateExpression += "tech_stack = :tech, "
      expressionAttributeValues[":tech"] = body.tech_stack
    }
    if (body.github_link !== undefined) {
      updateExpression += "github_link = :github, "
      expressionAttributeValues[":github"] = body.github_link
    }
    if (body.visible !== undefined) {
      updateExpression += "visible = :visible, "
      expressionAttributeValues[":visible"] = body.visible
    }
    if (body.order !== undefined) {
      updateExpression += "#projOrder = :order, "
      expressionAttributeNames["#projOrder"] = "order"
      expressionAttributeValues[":order"] = body.order
    }
    
    updateExpression = updateExpression.slice(0, -2)
    
    const command = new UpdateCommand({
      TableName: "projects",
      Key: { id },
      UpdateExpression: updateExpression,
      ExpressionAttributeNames: Object.keys(expressionAttributeNames).length ? expressionAttributeNames : undefined,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: "ALL_NEW"
    })
    
    const response = await docClient.send(command)
    
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(response.Attributes)
    }
  } catch (error) {
    console.error(error)
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ error: error.message })
    }
  }
}