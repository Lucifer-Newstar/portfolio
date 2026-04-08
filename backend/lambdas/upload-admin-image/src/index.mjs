import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const REGION = process.env.AWS_REGION || "us-east-1";
const s3 = new S3Client({ region: REGION });

const DEFAULT_ALLOWED_ORIGINS = "http://localhost:5173,https://lucifernewstar-2006.xyz";
const DEFAULT_BUCKET = "navin-portfolio";
const DEFAULT_SITE_URL = "https://lucifernewstar-2006.xyz";
const MAX_IMAGE_BYTES = 3.5 * 1024 * 1024;

function corsHeaders(event) {
  const allowedOrigins = String(process.env.ALLOWED_ORIGINS || DEFAULT_ALLOWED_ORIGINS)
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

function sanitizeFilename(filename) {
  const normalized = String(filename || "image")
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  if (!normalized) return "image";
  return normalized;
}

function extensionFromMimeType(contentType) {
  if (contentType === "image/jpeg") return "jpg";
  if (contentType === "image/png") return "png";
  if (contentType === "image/webp") return "webp";
  if (contentType === "image/gif") return "gif";
  if (contentType === "image/svg+xml") return "svg";
  if (contentType === "image/avif") return "avif";
  return "bin";
}

function buildObjectKey(filename, contentType) {
  const safeName = sanitizeFilename(filename).replace(/\.[a-z0-9]+$/i, "");
  const extension = extensionFromMimeType(contentType);
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  return `images/uploads/${timestamp}-${safeName}.${extension}`;
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

    const filename = String(body?.filename || "").trim();
    const contentType = String(body?.contentType || "").trim().toLowerCase();
    const data = String(body?.data || "").trim();

    if (!filename || !contentType || !data) {
      return {
        statusCode: 400,
        headers: corsHeaders(event),
        body: JSON.stringify({ error: "filename, contentType, and data are required." }),
      };
    }

    if (!/^image\/(avif|gif|jpe?g|png|svg\+xml|webp)$/i.test(contentType)) {
      return {
        statusCode: 400,
        headers: corsHeaders(event),
        body: JSON.stringify({ error: "Only image uploads are supported." }),
      };
    }

    const buffer = Buffer.from(data, "base64");
    if (!buffer.length) {
      return {
        statusCode: 400,
        headers: corsHeaders(event),
        body: JSON.stringify({ error: "Image payload is empty." }),
      };
    }

    if (buffer.length > MAX_IMAGE_BYTES) {
      return {
        statusCode: 413,
        headers: corsHeaders(event),
        body: JSON.stringify({ error: "Image is too large. Keep uploads under 3.5 MB." }),
      };
    }

    const bucket = process.env.S3_BUCKET || DEFAULT_BUCKET;
    const siteUrl = String(process.env.SITE_URL || DEFAULT_SITE_URL).replace(/\/+$/, "");
    const objectKey = buildObjectKey(filename, contentType);

    await s3.send(new PutObjectCommand({
      Bucket: bucket,
      Key: objectKey,
      Body: buffer,
      ContentType: contentType,
      CacheControl: "public, max-age=31536000, immutable",
    }));

    return {
      statusCode: 200,
      headers: corsHeaders(event),
      body: JSON.stringify({
        message: "Image uploaded successfully.",
        key: objectKey,
        url: `${siteUrl}/${objectKey}`,
      }),
    };
  } catch (error) {
    console.error("upload-admin-image failed:", error);
    return {
      statusCode: 500,
      headers: corsHeaders(event),
      body: JSON.stringify({ error: "Unable to upload image right now." }),
    };
  }
};
