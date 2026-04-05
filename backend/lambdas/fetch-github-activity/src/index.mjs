import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "us-east-1" });
const docClient = DynamoDBDocumentClient.from(client);

const GITHUB_USERNAME = "Lucifer-Newstar";

export const handler = async (event) => {
  try {
    console.log("Fetching GitHub activity for:", GITHUB_USERNAME);
    
    // Fetch GitHub events
    const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/events/public`);
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }
    
    const events = await response.json();
    console.log(`Fetched ${events.length} events`);
    
    // Filter for push events that have commits
    const pushEvents = events.filter(event => 
      event.type === 'PushEvent' && 
      event.payload?.commits?.length > 0
    );
    console.log(`Found ${pushEvents.length} push events with commits`);
    
    // Take last 10 commits
    const commits = pushEvents.slice(0, 10);
    
    // Save to DynamoDB
    let savedCount = 0;
    
    for (const event of commits) {
      const commit = event.payload.commits[0];
      if (!commit) {
        console.log("Skipping event with no commit:", event.id);
        continue;
      }
      
      const id = `github-${event.id}`;
      const date = new Date(event.created_at).toISOString();
      const message = commit.message ? commit.message.split('\n')[0] : 'No message';
      const repo = event.repo.name;
      const sha = commit.sha;
      const url = `https://github.com/${repo}/commit/${sha}`;
      
      console.log(`Saving: ${repo} - ${message.substring(0, 50)}`);
      
      const command = new PutCommand({
        TableName: "posts",
        Item: {
          id,
          type: "github",
          title: repo,
          content: message,
          link: url,
          date,
          visible: true,
          order: 0
        }
      });
      
      await docClient.send(command);
      savedCount++;
    }
    
    console.log(`Saved ${savedCount} commits`);
    
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ 
        message: `Synced ${savedCount} commits from GitHub`,
        count: savedCount
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