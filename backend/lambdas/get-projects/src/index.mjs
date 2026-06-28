import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "us-east-1" });
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  try {
    const command = new ScanCommand({
      TableName: "projects"
    });
    
    const response = await docClient.send(command);
    
    // Check if admin mode is requested
    const isAdmin = event.queryStringParameters?.admin === 'true';
    
    let items = response.Items;
    
    if (!isAdmin) {
      // For public page, filter out invisible items
      items = items.filter(item => item.visible !== false);
    }
    
    items = items.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
    
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,OPTIONS",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(items)
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
