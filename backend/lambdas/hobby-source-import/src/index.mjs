const DEFAULT_ALLOWED_ORIGINS = "http://localhost:5173,https://lucifernewstar-2006.xyz";
const MAL_API_BASE = "https://api.myanimelist.net/v2";

function corsHeaders(event) {
  const allowedOrigins = String(process.env.ALLOWED_ORIGINS || DEFAULT_ALLOWED_ORIGINS)
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
  const requestOrigin = event?.headers?.origin || event?.headers?.Origin || "";
  const origin = allowedOrigins.includes(requestOrigin) ? requestOrigin : (allowedOrigins[0] || "*");

  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
    "Access-Control-Allow-Methods": "POST,OPTIONS",
    "Content-Type": "application/json",
  };
}

function response(event, statusCode, body) {
  return {
    statusCode,
    headers: corsHeaders(event),
    body: JSON.stringify(body),
  };
}

async function validateAdminToken(event) {
  const userInfoUrl = process.env.COGNITO_USERINFO_URL;
  if (!userInfoUrl) return false;

  const authHeader = event?.headers?.Authorization || event?.headers?.authorization || "";
  if (!authHeader.startsWith("Bearer ")) return false;

  try {
    const token = authHeader.slice("Bearer ".length).trim();
    const result = await fetch(userInfoUrl, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!result.ok) return false;
    const payload = await result.json().catch(() => ({}));
    return Boolean(payload?.sub);
  } catch {
    return false;
  }
}

function parseBody(event) {
  if (!event?.body) return {};
  return typeof event.body === "string" ? JSON.parse(event.body) : event.body;
}

function normalizeStatus(status) {
  return String(status || "")
    .replace(/_/g, " ")
    .trim()
    .toLowerCase();
}

function stripHtml(value) {
  return String(value || "")
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]*>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function extractTag(block, tagName) {
  const pattern = new RegExp(`<${tagName}>([\\s\\S]*?)<\\/${tagName}>`, "i");
  const match = block.match(pattern);
  return match ? stripHtml(match[1]) : "";
}

function extractItemsFromRss(xml) {
  return String(xml || "").match(/<item>([\s\S]*?)<\/item>/gi) || [];
}

async function importFromMyAnimeList(username, limit = 10) {
  const clientId = process.env.MYANIMELIST_CLIENT_ID;
  if (!clientId) {
    throw new Error("MYANIMELIST_CLIENT_ID is not configured.");
  }

  const url = new URL(`${MAL_API_BASE}/users/${encodeURIComponent(username)}/animelist`);
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("sort", "list_updated_at");
  url.searchParams.set(
    "fields",
    "list_status,mean,synopsis,media_type,num_episodes,main_picture,start_season"
  );

  const result = await fetch(url, {
    method: "GET",
    headers: {
      "X-MAL-CLIENT-ID": clientId,
    },
  });

  if (!result.ok) {
    const message = await result.text();
    throw new Error(`MyAnimeList import failed: ${message || result.statusText}`);
  }

  const payload = await result.json();
  const items = Array.isArray(payload?.data) ? payload.data : [];

  return items.map((entry) => {
    const node = entry?.node || {};
    const listStatus = entry?.list_status || {};
    const season = node?.start_season?.season && node?.start_season?.year
      ? `${node.start_season.season} ${node.start_season.year}`
      : "";
    const synopsis = stripHtml(node?.synopsis || "");

    return {
      id: `mal-${node.id}`,
      type: "anime",
      title: node.title || "Untitled anime",
      status: normalizeStatus(listStatus.status) || "planned",
      rating: listStatus.score || node.mean || "",
      notes: [synopsis, season ? `Season: ${season}` : "", node.media_type ? `Format: ${node.media_type}` : "", node.num_episodes ? `Episodes: ${node.num_episodes}` : ""]
        .filter(Boolean)
        .join(" | "),
      source: "myanimelist",
      sourceUsername: username,
      sourceUrl: `https://myanimelist.net/anime/${node.id}`,
      image: node?.main_picture?.medium || node?.main_picture?.large || "",
      updatedAt: listStatus.updated_at || new Date().toISOString(),
    };
  });
}

async function importFromLetterboxd(username, limit = 10) {
  const result = await fetch(`https://letterboxd.com/${encodeURIComponent(username)}/rss/`, {
    method: "GET",
    headers: {
      Accept: "application/rss+xml, application/xml, text/xml",
    },
  });

  if (!result.ok) {
    const message = await result.text();
    throw new Error(`Letterboxd import failed: ${message || result.statusText}`);
  }

  const xml = await result.text();
  const items = extractItemsFromRss(xml).slice(0, limit);

  return items.map((item, index) => {
    const filmTitle = extractTag(item, "letterboxd:filmTitle") || extractTag(item, "title") || `Film ${index + 1}`;
    const filmYear = extractTag(item, "letterboxd:filmYear");
    const memberRating = extractTag(item, "letterboxd:memberRating");
    const watchedDate = extractTag(item, "pubDate");
    const review = stripHtml(extractTag(item, "description"));
    const link = extractTag(item, "link");

    return {
      id: `letterboxd-${username}-${index}-${filmTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      type: "movies",
      title: filmYear ? `${filmTitle} (${filmYear})` : filmTitle,
      status: "logged",
      rating: memberRating || "",
      notes: review || "Imported from Letterboxd RSS.",
      source: "letterboxd",
      sourceUsername: username,
      sourceUrl: link,
      updatedAt: watchedDate ? new Date(watchedDate).toISOString() : new Date().toISOString(),
    };
  });
}

export const handler = async (event) => {
  const method = event?.httpMethod || event?.requestContext?.http?.method || "";

  if (method === "OPTIONS") {
    return response(event, 200, { ok: true });
  }

  if (method !== "POST") {
    return response(event, 405, { error: "Method not allowed." });
  }

  const authorized = await validateAdminToken(event);
  if (!authorized) {
    return response(event, 401, { error: "Unauthorized admin request." });
  }

  try {
    const body = parseBody(event);
    const source = String(body?.source || "").trim().toLowerCase();
    const username = String(body?.username || "").trim();
    const limit = Math.min(Math.max(Number(body?.limit || 10), 1), 25);

    if (!username) {
      return response(event, 400, { error: "Username is required." });
    }

    if (source === "myanimelist") {
      const items = await importFromMyAnimeList(username, limit);
      return response(event, 200, { source, username, count: items.length, items });
    }

    if (source === "letterboxd") {
      const items = await importFromLetterboxd(username, limit);
      return response(event, 200, { source, username, count: items.length, items });
    }

    return response(event, 400, { error: "Unsupported hobby source." });
  } catch (error) {
    console.error("hobby-source-import failed:", error);
    return response(event, 500, { error: error.message || "Unable to import hobby source." });
  }
};
