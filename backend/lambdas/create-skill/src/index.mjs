import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "us-east-1" });
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  console.log("Event received:", JSON.stringify(event))
  
  try {
    let body
    
    if (typeof event.body === 'string') {
      body = JSON.parse(event.body)
    } else {
      body = event.body
    }
    
    console.log("Parsed body:", body)
    
    // Try to write to DynamoDB
    const command = new PutCommand({
      TableName: "skills",
      Item: {
        id: body.id,
        name: body.name,
        category: body.category,
        level: body.level || "Learning",
        order: body.order || 999
      }
    })
    
    const result = await docClient.send(command)
    console.log("DynamoDB result:", result)
    
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ 
        message: "Skill created successfully", 
        data: body 
      })
    }
  } catch (error) {
    console.error("Error:", error)
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