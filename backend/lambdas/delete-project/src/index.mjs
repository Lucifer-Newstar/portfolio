import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, DeleteCommand } from "@aws-sdk/lib-dynamodb";

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
    
    const command = new DeleteCommand({
      TableName: "projects",
      Key: { id }
    })
    
    await docClient.send(command)
    
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: "Project deleted successfully" })
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