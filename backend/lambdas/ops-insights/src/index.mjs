import { CloudWatchClient, GetMetricStatisticsCommand } from "@aws-sdk/client-cloudwatch";
import { CloudFrontClient, GetDistributionCommand } from "@aws-sdk/client-cloudfront";
import { APIGatewayClient, GetRestApiCommand } from "@aws-sdk/client-api-gateway";
import { S3Client, GetBucketLocationCommand } from "@aws-sdk/client-s3";
import { CloudWatchLogsClient, FilterLogEventsCommand } from "@aws-sdk/client-cloudwatch-logs";

const REGION = process.env.AWS_REGION || "us-east-1";
const cloudWatch = new CloudWatchClient({ region: REGION });
const cloudFront = new CloudFrontClient({ region: REGION });
const apiGateway = new APIGatewayClient({ region: REGION });
const s3 = new S3Client({ region: REGION });
const logsClient = new CloudWatchLogsClient({ region: REGION });

const DEFAULT_ALLOWED_ORIGINS = "http://localhost:5173,https://lucifernewstar-2006.xyz";
const DEFAULT_SITE_URL = "https://lucifernewstar-2006.xyz";
const DEFAULT_API_BASE_URL = "https://6e2n1oy6k9.execute-api.us-east-1.amazonaws.com/prod";
const DEFAULT_API_ID = "6e2n1oy6k9";
const DEFAULT_API_NAME = "portfolio-rest-api";
const DEFAULT_API_STAGE = "prod";
const DEFAULT_BUCKET = "navin-portfolio";
const DEFAULT_CLOUDFRONT_DISTRIBUTION_ID = "ECVS4UV0ZKGHO";
const DEFAULT_LOG_GROUPS = "/aws/lambda/deploy-website,/aws/lambda/save-site-content,/aws/lambda/get-site-content,/aws/lambda/send-contact-email";
const DEFAULT_OBSERVED_LAMBDAS = "deploy-website,save-site-content,get-site-content,send-contact-email";

function getAllowedOrigin(event) {
  const allowedOrigins = String(process.env.ALLOWED_ORIGINS || DEFAULT_ALLOWED_ORIGINS)
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
  const requestOrigin = event?.headers?.origin || event?.headers?.Origin || "";
  return allowedOrigins.includes(requestOrigin)
    ? requestOrigin
    : (allowedOrigins[0] || "*");
}

function corsHeaders(event) {
  return {
    "Access-Control-Allow-Origin": getAllowedOrigin(event),
    "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
    "Access-Control-Allow-Methods": "GET,OPTIONS",
    "Content-Type": "application/json",
  };
}

function ok(event, body) {
  return {
    statusCode: 200,
    headers: corsHeaders(event),
    body: JSON.stringify(body),
  };
}

function failure(event, statusCode, error) {
  return {
    statusCode,
    headers: corsHeaders(event),
    body: JSON.stringify({ error }),
  };
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

async function getMetricStatistics({
  namespace,
  metricName,
  dimensions,
  startTime,
  endTime,
  period,
  stat,
}) {
  const response = await cloudWatch.send(new GetMetricStatisticsCommand({
    Namespace: namespace,
    MetricName: metricName,
    Dimensions: dimensions,
    StartTime: startTime,
    EndTime: endTime,
    Period: period,
    Statistics: [stat],
  }));

  const datapoints = Array.isArray(response.Datapoints) ? response.Datapoints : [];
  if (!datapoints.length) return 0;

  return datapoints.reduce((total, point) => {
    const value = Number(point?.[stat] || 0);
    return total + (Number.isFinite(value) ? value : 0);
  }, 0);
}

async function getMetricAverage({
  namespace,
  metricName,
  dimensions,
  startTime,
  endTime,
  period,
}) {
  const response = await cloudWatch.send(new GetMetricStatisticsCommand({
    Namespace: namespace,
    MetricName: metricName,
    Dimensions: dimensions,
    StartTime: startTime,
    EndTime: endTime,
    Period: period,
    Statistics: ["Average"],
  }));

  const datapoints = Array.isArray(response.Datapoints) ? response.Datapoints : [];
  if (!datapoints.length) return 0;

  const sum = datapoints.reduce((total, point) => total + Number(point?.Average || 0), 0);
  return sum / datapoints.length;
}

async function getLambdaMetrics(startTime, endTime) {
  const lambdaNames = String(process.env.OBSERVED_LAMBDAS || DEFAULT_OBSERVED_LAMBDAS)
    .split(",")
    .map((name) => name.trim())
    .filter(Boolean);

  const lambdaBreakdown = await Promise.all(lambdaNames.map(async (name) => {
    const dimensions = [{ Name: "FunctionName", Value: name }];
    const [invocations, errors] = await Promise.all([
      getMetricStatistics({
        namespace: "AWS/Lambda",
        metricName: "Invocations",
        dimensions,
        startTime,
        endTime,
        period: 3600,
        stat: "Sum",
      }),
      getMetricStatistics({
        namespace: "AWS/Lambda",
        metricName: "Errors",
        dimensions,
        startTime,
        endTime,
        period: 3600,
        stat: "Sum",
      }),
    ]);

    return {
      name,
      invocations: Math.round(invocations),
      errors: Math.round(errors),
    };
  }));

  return {
    lambdaInvocations24h: lambdaBreakdown.reduce((sum, item) => sum + item.invocations, 0),
    lambdaErrors24h: lambdaBreakdown.reduce((sum, item) => sum + item.errors, 0),
    lambdaBreakdown,
  };
}

async function getApiMetrics(startTime, endTime) {
  const apiName = process.env.API_NAME || DEFAULT_API_NAME;
  const apiStage = process.env.API_STAGE || DEFAULT_API_STAGE;
  const dimensions = [
    { Name: "ApiName", Value: apiName },
    { Name: "Stage", Value: apiStage },
  ];

  const [latency, errors5xx, requestCount] = await Promise.all([
    getMetricAverage({
      namespace: "AWS/ApiGateway",
      metricName: "Latency",
      dimensions,
      startTime,
      endTime,
      period: 3600,
    }),
    getMetricStatistics({
      namespace: "AWS/ApiGateway",
      metricName: "5XXError",
      dimensions,
      startTime,
      endTime,
      period: 3600,
      stat: "Sum",
    }),
    getMetricStatistics({
      namespace: "AWS/ApiGateway",
      metricName: "Count",
      dimensions,
      startTime,
      endTime,
      period: 3600,
      stat: "Sum",
    }),
  ]);

  return {
    apiLatencyMs: Number(latency.toFixed(2)),
    api5xx24h: Math.round(errors5xx),
    apiCalls24h: Math.round(requestCount),
  };
}

async function getCloudFrontAnalytics(now) {
  const distributionId = process.env.CLOUDFRONT_DISTRIBUTION_ID || DEFAULT_CLOUDFRONT_DISTRIBUTION_ID;
  const baseDimensions = [
    { Name: "DistributionId", Value: distributionId },
    { Name: "Region", Value: "Global" },
  ];

  const requestVolume24h = await getMetricStatistics({
    namespace: "AWS/CloudFront",
    metricName: "Requests",
    dimensions: baseDimensions,
    startTime: new Date(now.getTime() - (24 * 60 * 60 * 1000)),
    endTime: now,
    period: 3600,
    stat: "Sum",
  });

  const requestVolume7d = await getMetricStatistics({
    namespace: "AWS/CloudFront",
    metricName: "Requests",
    dimensions: baseDimensions,
    startTime: new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000)),
    endTime: now,
    period: 86400,
    stat: "Sum",
  });

  return {
    requestVolume24h: Math.round(requestVolume24h),
    requestVolume7d: Math.round(requestVolume7d),
    estimatedVisitors24h: null,
    note: "CloudFront request counts are live. Unique visitor estimation requires dedicated analytics instrumentation.",
  };
}

function mapStatus(ok, detail, extra = {}) {
  return {
    status: ok ? "operational" : "degraded",
    statusLabel: ok ? "Operational" : "Degraded",
    detail,
    ...extra,
  };
}

async function probeUrl(name, label, href, init = {}) {
  const started = Date.now();
  try {
    const response = await fetch(href, init);
    const latencyMs = Date.now() - started;
    const ok = response.ok;
    return {
      id: name,
      name,
      label,
      href,
      latencyMs,
      ...mapStatus(ok, ok ? "Probe succeeded and endpoint responded normally." : `Probe returned HTTP ${response.status}.`),
    };
  } catch (error) {
    return {
      id: name,
      name,
      label,
      href,
      latencyMs: null,
      status: "error",
      statusLabel: "Error",
      detail: error.message || "Probe failed.",
    };
  }
}

async function getInfrastructureStatus() {
  const bucket = process.env.S3_BUCKET || DEFAULT_BUCKET;
  const distributionId = process.env.CLOUDFRONT_DISTRIBUTION_ID || DEFAULT_CLOUDFRONT_DISTRIBUTION_ID;
  const apiId = process.env.API_ID || DEFAULT_API_ID;
  const siteUrl = process.env.SITE_URL || DEFAULT_SITE_URL;
  const apiBaseUrl = process.env.API_BASE_URL || DEFAULT_API_BASE_URL;

  const [siteProbe, apiProbe, bucketStatus, distributionStatus, apiGatewayStatus] = await Promise.all([
    probeUrl("public-site", "Public site", siteUrl, { method: "GET" }),
    probeUrl("api-gateway", "API Gateway", `${apiBaseUrl}/skills`, { method: "GET" }),
    (async () => {
      try {
        await s3.send(new GetBucketLocationCommand({ Bucket: bucket }));
        return {
          id: "s3-bucket",
          name: bucket,
          label: "S3 bucket",
          status: "operational",
          statusLabel: "Operational",
          detail: "Bucket metadata is reachable.",
        };
      } catch (error) {
        return {
          id: "s3-bucket",
          name: bucket,
          label: "S3 bucket",
          status: "error",
          statusLabel: "Error",
          detail: error.message || "Bucket check failed.",
        };
      }
    })(),
    (async () => {
      try {
        const response = await cloudFront.send(new GetDistributionCommand({ Id: distributionId }));
        const distribution = response.Distribution;
        const enabled = Boolean(distribution?.DistributionConfig?.Enabled);
        return {
          id: "cloudfront",
          name: distributionId,
          label: "CloudFront",
          status: enabled ? "operational" : "degraded",
          statusLabel: enabled ? "Operational" : "Disabled",
          detail: enabled ? "Distribution is enabled and serving traffic." : "Distribution exists but is disabled.",
        };
      } catch (error) {
        return {
          id: "cloudfront",
          name: distributionId,
          label: "CloudFront",
          status: "error",
          statusLabel: "Error",
          detail: error.message || "CloudFront lookup failed.",
        };
      }
    })(),
    (async () => {
      try {
        const response = await apiGateway.send(new GetRestApiCommand({ restApiId: apiId }));
        return {
          id: "rest-api",
          name: response?.name || apiId,
          label: "REST API",
          status: "operational",
          statusLabel: "Operational",
          detail: "API metadata is reachable.",
        };
      } catch (error) {
        return {
          id: "rest-api",
          name: apiId,
          label: "REST API",
          status: "error",
          statusLabel: "Error",
          detail: error.message || "REST API lookup failed.",
        };
      }
    })(),
  ]);

  return [siteProbe, apiProbe, bucketStatus, distributionStatus, apiGatewayStatus];
}

async function getDeployHistory() {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const workflowFile = process.env.GITHUB_WORKFLOW_FILE || "deploy.yml";

  if (!token || !owner || !repo) return [];

  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/actions/workflows/${workflowFile}/runs?per_page=6`, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "User-Agent": "portfolio-ops-insights",
    },
  });

  if (!response.ok) return [];

  const payload = await response.json().catch(() => ({}));
  const runs = Array.isArray(payload?.workflow_runs) ? payload.workflow_runs : [];

  return runs.map((run) => {
    const status = run.conclusion || run.status || "unknown";
    return {
      id: String(run.id),
      name: run.display_title || run.name || "Deploy workflow",
      branch: run.head_branch || "main",
      createdAt: run.created_at,
      url: run.html_url,
      status,
      statusLabel:
        status === "success" ? "Success"
        : status === "failure" ? "Failed"
        : status === "in_progress" ? "Running"
        : status === "queued" ? "Queued"
        : "Unknown",
    };
  });
}

async function getRecentLogs() {
  const groups = String(process.env.LOG_GROUPS || DEFAULT_LOG_GROUPS)
    .split(",")
    .map((group) => group.trim())
    .filter(Boolean);

  const logs = await Promise.all(groups.map(async (group) => {
    try {
      const response = await logsClient.send(new FilterLogEventsCommand({
        logGroupName: group,
        startTime: Date.now() - (6 * 60 * 60 * 1000),
        limit: 6,
      }));

      const events = Array.isArray(response.events) ? response.events : [];
      return events.map((event) => ({
        timestamp: event.timestamp ? new Date(event.timestamp).toISOString() : new Date().toISOString(),
        source: group.replace("/aws/lambda/", ""),
        message: String(event.message || "").trim().slice(0, 280),
      }));
    } catch {
      return [];
    }
  }));

  return logs
    .flat()
    .sort((left, right) => new Date(right.timestamp).getTime() - new Date(left.timestamp).getTime())
    .slice(0, 12);
}

async function buildSummary({ includeAdmin }) {
  const now = new Date();
  const start24h = new Date(now.getTime() - (24 * 60 * 60 * 1000));

  const [lambdaMetrics, apiMetrics, analytics, status, deployHistory, logs] = await Promise.all([
    getLambdaMetrics(start24h, now),
    getApiMetrics(start24h, now),
    getCloudFrontAnalytics(now),
    getInfrastructureStatus(),
    includeAdmin ? getDeployHistory() : Promise.resolve([]),
    includeAdmin ? getRecentLogs() : Promise.resolve([]),
  ]);

  return {
    live: true,
    generatedAt: now.toISOString(),
    cloudWatch: {
      ...lambdaMetrics,
      apiLatencyMs: apiMetrics.apiLatencyMs,
      api5xx24h: apiMetrics.api5xx24h,
    },
    analytics: {
      ...analytics,
      apiCalls24h: apiMetrics.apiCalls24h,
    },
    status,
    ...(includeAdmin ? { deployHistory, logs } : {}),
  };
}

export const handler = async (event) => {
  try {
    const method =
      event?.httpMethod ||
      event?.requestContext?.http?.method ||
      event?.requestContext?.httpMethod ||
      "";

    if (method === "OPTIONS") {
      return ok(event, { ok: true });
    }

    const path = event?.path || event?.rawPath || "";
    const includeAdmin = path.includes("/admin/");

    if (includeAdmin) {
      const authorized = await validateAdminToken(event);
      if (!authorized) {
        return failure(event, 401, "Unauthorized admin request.");
      }
    }

    const summary = await buildSummary({ includeAdmin });
    return ok(event, summary);
  } catch (error) {
    console.error("ops-insights failed:", error);
    return failure(event, 500, `Unable to load observability summary: ${error.message}`);
  }
};
