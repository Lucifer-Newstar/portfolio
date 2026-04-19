import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

const REGION = process.env.AWS_REGION || "us-east-1";
const client = new DynamoDBClient({ region: REGION });
const docClient = DynamoDBDocumentClient.from(client);

const DEFAULT_ALLOWED_ORIGINS = "http://localhost:5173,https://lucifernewstar-2006.xyz";
const TABLES = {
  learning_log: process.env.LEARNING_LOG_TABLE || "learning_log",
  workout_log: process.env.WORKOUT_LOG_TABLE || "workout_log",
  daily_status: process.env.DAILY_STATUS_TABLE || "daily_status",
  hobby_items: process.env.HOBBY_ITEMS_TABLE || "hobby_items",
  goals: process.env.GOALS_TABLE || "goals",
  cert_progress: process.env.CERT_PROGRESS_TABLE || "cert_progress",
};

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
    "Access-Control-Allow-Methods": "GET,OPTIONS",
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

function dateKey(value) {
  return new Date(value).toISOString().slice(0, 10);
}

function computeStreak(items) {
  const dateSet = new Set(items.map((item) => dateKey(item.date || item.updatedAt)).filter(Boolean));
  if (!dateSet.size) return 0;

  const pointer = new Date();
  pointer.setUTCHours(0, 0, 0, 0);
  const yesterday = new Date(pointer);
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);

  if (!dateSet.has(dateKey(pointer.toISOString())) && !dateSet.has(dateKey(yesterday.toISOString()))) {
    return 0;
  }

  let streak = 0;
  while (dateSet.has(dateKey(pointer.toISOString()))) {
    streak += 1;
    pointer.setUTCDate(pointer.getUTCDate() - 1);
  }

  return streak;
}

function computeWorkoutPrs(workouts) {
  const grouped = {};
  workouts.forEach((entry) => {
    const exercise = String(entry.exercise || "").trim();
    if (!exercise) return;

    const score = Number(entry.weight || 0) || (Number(entry.reps || 0) * Math.max(Number(entry.sets || 0), 1));
    if (!grouped[exercise] || score > grouped[exercise].score) {
      grouped[exercise] = {
        exercise,
        score,
        weight: Number(entry.weight || 0),
        reps: Number(entry.reps || 0),
      };
    }
  });

  return Object.values(grouped).sort((left, right) => right.score - left.score).slice(0, 6);
}

export const handler = async (event) => {
  const method = event?.httpMethod || event?.requestContext?.http?.method || "";

  if (method === "OPTIONS") {
    return response(event, 200, { ok: true });
  }

  const authorized = await validateAdminToken(event);
  if (!authorized) {
    return response(event, 401, { error: "Unauthorized admin request." });
  }

  try {
    const [learning, workouts, dailyStatus, hobbies, goals, certProgress] = await Promise.all([
      docClient.send(new ScanCommand({ TableName: TABLES.learning_log })),
      docClient.send(new ScanCommand({ TableName: TABLES.workout_log })),
      docClient.send(new ScanCommand({ TableName: TABLES.daily_status })),
      docClient.send(new ScanCommand({ TableName: TABLES.hobby_items })),
      docClient.send(new ScanCommand({ TableName: TABLES.goals })),
      docClient.send(new ScanCommand({ TableName: TABLES.cert_progress })),
    ]);

    const learningItems = learning.Items || [];
    const workoutItems = workouts.Items || [];
    const hobbyItems = hobbies.Items || [];

    const weeklyThreshold = new Date();
    weeklyThreshold.setUTCDate(weeklyThreshold.getUTCDate() - 6);
    const thresholdKey = dateKey(weeklyThreshold.toISOString());

    return response(event, 200, {
      generatedAt: new Date().toISOString(),
      currentStreak: computeStreak(learningItems),
      weeklySummary: {
        learningDays: new Set(learningItems.map((entry) => dateKey(entry.date || entry.updatedAt)).filter((value) => value >= thresholdKey)).size,
        workouts: workoutItems.filter((entry) => dateKey(entry.date || entry.updatedAt) >= thresholdKey).length,
        booksCompleted: hobbyItems.filter((entry) => entry.type === "reading" && entry.status === "completed").length,
      },
      quickStats: {
        certificationsTracked: (certProgress.Items || []).length,
        workoutsLogged: workoutItems.length,
        hobbiesTracked: hobbyItems.length,
        goalsTracked: (goals.Items || []).length,
      },
      workout: {
        prs: computeWorkoutPrs(workoutItems),
        weeklyVolume: workoutItems.reduce((sum, entry) => sum + (Number(entry.sets || 0) * Number(entry.reps || 0) * Math.max(Number(entry.weight || 0), 1)), 0),
      },
      latestStatus: (dailyStatus.Items || []).sort((left, right) => String(right.date || right.updatedAt).localeCompare(String(left.date || left.updatedAt)))[0] || null,
    });
  } catch (error) {
    console.error("lucifer-summary failed:", error);
    return response(event, 500, { error: error.message || "Unable to load Lucifer summary." });
  }
};
