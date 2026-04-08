function corsHeaders(event) {
  const allowedOrigins = String(process.env.ALLOWED_ORIGINS || "http://localhost:5173,https://lucifernewstar-2006.xyz")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
  const requestOrigin = event?.headers?.origin || event?.headers?.Origin || "";
  const origin = allowedOrigins.includes(requestOrigin)
    ? requestOrigin
    : (allowedOrigins[0] || "*");

  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
    "Access-Control-Allow-Methods": "POST,OPTIONS",
    "Content-Type": "application/json",
  };
}

function parseBody(event) {
  if (!event?.body) return event || {};
  return typeof event.body === "string" ? JSON.parse(event.body) : event.body;
}

async function validateAdminToken(event) {
  const userInfoUrl = process.env.COGNITO_USERINFO_URL;
  if (!userInfoUrl) return false;

  const authHeader =
    event?.headers?.Authorization ||
    event?.headers?.authorization ||
    "";

  if (!authHeader.startsWith("Bearer ")) {
    return false;
  }

  const token = authHeader.slice("Bearer ".length).trim();
  if (!token) return false;

  try {
    const response = await fetch(userInfoUrl, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) return false;

    const payload = await response.json().catch(() => ({}));
    return Boolean(payload?.sub);
  } catch {
    return false;
  }
}

export const handler = async (event) => {
  try {
    const method =
      event?.httpMethod ||
      event?.requestContext?.http?.method ||
      event?.requestContext?.httpMethod ||
      "";

    if (method === "OPTIONS") {
      return { statusCode: 200, headers: corsHeaders(event), body: JSON.stringify({ ok: true }) };
    }

    const authorized = await validateAdminToken(event);
    if (!authorized) {
      return {
        statusCode: 401,
        headers: corsHeaders(event),
        body: JSON.stringify({ error: "Unauthorized admin request." }),
      };
    }

    let body;
    try {
      body = parseBody(event);
    } catch {
      return {
        statusCode: 400,
        headers: corsHeaders(event),
        body: JSON.stringify({ error: "Invalid JSON payload." }),
      };
    }

    if (body && typeof body !== "object") {
      return {
        statusCode: 400,
        headers: corsHeaders(event),
        body: JSON.stringify({ error: "Payload must be a JSON object." }),
      };
    }

    const source = String(body?.source || "admin-dashboard").slice(0, 64);

    const token = process.env.GITHUB_TOKEN;
    const owner = process.env.GITHUB_OWNER;
    const repo = process.env.GITHUB_REPO;
    const workflowFile = process.env.GITHUB_WORKFLOW_FILE || "deploy.yml";
    const ref = process.env.GITHUB_REF || "main";

    if (!token || !owner || !repo) {
      return {
        statusCode: 500,
        headers: corsHeaders(event),
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
        headers: corsHeaders(event),
        body: JSON.stringify({
          error: `GitHub workflow dispatch failed: ${raw || response.statusText}`,
        }),
      };
    }

    return {
      statusCode: 200,
      headers: corsHeaders(event),
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
      headers: corsHeaders(event),
      body: JSON.stringify({ error: `Unable to trigger deploy: ${error.message}` }),
    };
  }
};
