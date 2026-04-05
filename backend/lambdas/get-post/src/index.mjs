import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "us-east-1" });
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  try {
    const command = new ScanCommand({
      TableName: "posts"
    });
    
    const response = await docClient.send(command);
    
    // Sort by date descending
    const items = response.Items.sort((a, b) => 
      new Date(b.date) - new Date(a.date)
    );
    
    // For admin dashboard, return all posts (including invisible)
    // For public page, we'll filter on frontend
    
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(items)
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({ error: error.message })
    };
  }
};