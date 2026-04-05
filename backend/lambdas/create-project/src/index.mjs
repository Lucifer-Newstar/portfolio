import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "us-east-1" });
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  try {
    let body
    if (typeof event.body === 'string') {
      body = JSON.parse(event.body)
    } else {
      body = event.body
    }
    
    const { id, title, description, tech_stack, github_link, visible, order } = body
    
    const command = new PutCommand({
      TableName: "projects",
      Item: {
        id,
        title,
        description,
        tech_stack: tech_stack || [],
        github_link: github_link || "",
        visible: visible !== false,
        order: order || 999
      }
    })
    
    await docClient.send(command)
    
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: "Project created successfully" })
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