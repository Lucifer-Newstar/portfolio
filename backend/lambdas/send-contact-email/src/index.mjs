import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const client = new SESClient({ region: "us-east-1" });

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST,OPTIONS",
    "Content-Type": "application/json",
  };
}

function parseBody(event) {
  if (!event?.body) return event || {};
  return typeof event.body === "string" ? JSON.parse(event.body) : event.body;
}

function isValidEmail(value) {
  return typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export const handler = async (event) => {
  try {
    // Handle OPTIONS preflight
    if (event?.requestContext?.http?.method === "OPTIONS" || event?.httpMethod === "OPTIONS") {
      return { statusCode: 200, headers: corsHeaders(), body: JSON.stringify({ ok: true }) };
    }

    const body = parseBody(event);
    const name = String(body?.name || "").trim();
    const email = String(body?.email || "").trim();
    const reason = String(body?.reason || "General").trim();
    const message = String(body?.message || "").trim();

    if (!name || !isValidEmail(email) || !message) {
      return {
        statusCode: 400,
        headers: corsHeaders(),
        body: JSON.stringify({ error: "Name, valid email, and message are required." }),
      };
    }

    if (message.length > 4000) {
      return {
        statusCode: 400,
        headers: corsHeaders(),
        body: JSON.stringify({ error: "Message is too long." }),
      };
    }

    const targetEmail = process.env.CONTACT_TARGET_EMAIL || "navin.jairam@gmail.com";
    const sourceEmail = process.env.CONTACT_SOURCE_EMAIL || targetEmail;

    const command = new SendEmailCommand({
      Destination: {
        ToAddresses: [targetEmail],
      },
      Source: sourceEmail,
      ReplyToAddresses: [email],
      Message: {
        Subject: {
          Data: `[Portfolio Contact] ${reason}`,
          Charset: "UTF-8",
        },
        Body: {
          Text: {
            Charset: "UTF-8",
            Data: [
              "New contact form submission",
              "",
              `Name: ${name}`,
              `Email: ${email}`,
              `Reason: ${reason}`,
              "",
              "Message:",
              message,
            ].join("\n"),
          },
        },
      },
    });

    await client.send(command);

    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify({ message: "Message sent successfully." }),
    };
  } catch (error) {
    console.error("send-contact-email failed:", error);
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({ error: "Unable to send message right now." }),
    };
  }
};