function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
    "Access-Control-Allow-Methods": "POST,OPTIONS",
    "Content-Type": "application/json",
  };
}

function parseBody(event) {
  if (!event?.body) return event || {};
  return typeof event.body === "string" ? JSON.parse(event.body) : event.body;
}

export const handler = async (event) => {
  try {
    const method =
      event?.httpMethod ||
      event?.requestContext?.http?.method ||
      event?.requestContext?.httpMethod ||
      "";

    if (method === "OPTIONS") {
      return { statusCode: 200, headers: corsHeaders(), body: JSON.stringify({ ok: true }) };
    }

    let body;
    try {
      body = parseBody(event);
    } catch {
      return {
        statusCode: 400,
        headers: corsHeaders(),
        body: JSON.stringify({ error: "Invalid JSON payload." }),
      };
    }

    const source = String(body?.source || "admin-dashboard");

    const token = process.env.GITHUB_TOKEN;
    const owner = process.env.GITHUB_OWNER;
    const repo = process.env.GITHUB_REPO;
    const workflowFile = process.env.GITHUB_WORKFLOW_FILE || "deploy.yml";
    const ref = process.env.GITHUB_REF || "main";

    if (!token || !owner || !repo) {
      return {
        statusCode: 500,
        headers: corsHeaders(),
        body: JSON.stringify({
          error: "Deploy lambda misconfigured. Missing GITHUB_TOKEN/GITHUB_OWNER/GITHUB_REPO.",
        }),
      };
    }

    const url = `https://api.github.com/repos/${owner}/${repo}/actions/workflows/${workflowFile}/dispatches`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "User-Agent": "portfolio-admin-deploy-trigger",
      },
      body: JSON.stringify({
        ref,
        inputs: {
          source,
          requestedAt: new Date().toISOString(),
        },
      }),
    });

    if (!response.ok) {
      const raw = await response.text().catch(() => "");
      return {
        statusCode: response.status,
        headers: corsHeaders(),
        body: JSON.stringify({
          error: `GitHub workflow dispatch failed: ${raw || response.statusText}`,
        }),
      };
    }

    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify({
        message: "Deploy workflow triggered successfully.",
        workflow: workflowFile,
        ref,
      }),
    };
  } catch (error) {
    console.error("deploy-website failed:", error);
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({ error: `Unable to trigger deploy: ${error.message}` }),
    };
  }
};
