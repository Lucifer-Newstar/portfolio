# Contact Email Setup

Last updated: 2026-04-08

The contact form is backed by:

- `POST /contact`
- Lambda: `backend/lambdas/send-contact-email/src/index.mjs`

## 1. Frontend Contract

Submitted fields:

- `name`
- `email`
- `reason`
- `message`

Frontend entry points:

- `frontend/src/pages/public/Contact.jsx`
- `frontend/src/utils/api.js`

## 2. Lambda Requirements

The Lambda must:

- parse JSON
- validate required fields
- validate email format
- reject oversized messages
- send SES email
- return allowlisted CORS headers for browser calls

## 3. Required Environment Variables

- `CONTACT_TARGET_EMAIL=navin.jairam@gmail.com`
- `CONTACT_SOURCE_EMAIL=navin.jairam@gmail.com`
- `ALLOWED_ORIGINS=http://localhost:5173,https://lucifernewstar-2006.xyz`

## 4. Required IAM

- `ses:SendEmail`
- `ses:SendRawEmail`

## 5. API Gateway Setup

Routes:

- `POST /contact`
- `OPTIONS /contact`

## 6. SES Checklist

- verify sender identity
- verify recipient too if SES is still in sandbox
- confirm region alignment with Lambda

## 7. Failure Modes and Warnings

- invalid payload should return `400`
- SES/runtime issues should return `500`
- wildcard CORS should not be used when the site only needs known origins

## 8. Validation Checklist

- invalid payload is rejected
- valid payload returns success
- inbox receives the email
- browser can submit from localhost and production origin
