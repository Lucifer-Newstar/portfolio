import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, DeleteCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "us-east-1" });
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
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
            allKeys: Object.keys(event)
          }
        })
      };
    }
    
    console.log("Deleting post with ID:", id);
    
    const command = new DeleteCommand({
      TableName: "posts",
      Key: { id }
    });
    
    await docClient.send(command);
    
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: "Post deleted successfully", id: id })
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