# Rebuild Playbook (From Scratch, No Existing Codebase)

Last updated: 2026-04-08

This playbook is for recreating the same system architecture from zero.

## 1. Target Outcome

Build a portfolio SPA with:
- public pages
- hidden admin dashboard
- DynamoDB-backed CRUD content
- cloud-synced editable site content
- source-themed feed cards
- Cognito login gate for admin
- contact form emails to `navin.jairam@gmail.com`
- GitHub Actions CI + deploy to S3 + CloudFront

## 2. Provision Cloud Infrastructure

Create in AWS (`us-east-1` recommended):

1. S3 bucket for static frontend hosting.
2. CloudFront distribution for CDN + HTTPS.
3. API Gateway REST API with `/prod` stage.
4. DynamoDB tables:
- `skills`
- `projects`
- `experience`
- `certifications`
- `posts`
5. Lambda functions:
- CRUD lambdas for all tables
- `fetch-github-activity`
- `send-contact-email`
6. Cognito User Pool + App Client (Hosted UI enabled).
7. SES identities:
- verify `navin.jairam@gmail.com` (sender)
8. IAM roles/policies:
- lambdas: table access + SES access (for contact lambda)
- deploy user: S3 sync + CloudFront invalidation

## 3. Create Backend API Surface

Implement API routes:
- `/skills` and `/skills/{id}`
- `/projects` and `/projects/{id}`
- `/experience` and `/experience/{id}`
- `/certifications` and `/certifications/{id}`
- `/posts` and `/posts/{id}`
- `/posts/sync-github`
- `/contact`

For each route:
- enable CORS (`Access-Control-Allow-Origin`, methods, headers)
- parse JSON body
- return typed errors with `statusCode`

## 4. Build Frontend App Skeleton

1. Create React + Vite app.
2. Add router pages:
- Home, About, Experience, Skills, Projects, DevOps Lab, Certifications, Posts, Contact, Callback
- Admin Dashboard route `/lucifer-newstar_dashboard`
3. Add app shell layers:
- theme handler
- route metadata
- background/interaction/scroll layers
4. Add contexts:
- Theme context
- Site content context (saved + draft + remote sync)

## 5. Implement Data Layer

Create `api.js` with:
- generic `request()`
- per-resource CRUD wrappers
- posts filtering helpers
- site-content snapshot helpers (hidden `__site-content__` post record)
- contact submit helper
- deploy trigger helper

## 6. Implement Admin UX

Admin tabs:
- overview
- content manager (nested editor + import/export + image upload)
- preview manager (saved/draft and light/dark compare)
- skills/projects/experience/certifications/posts managers

Key admin actions:
- save content to local + remote snapshot
- deploy trigger button + readable error messages

## 7. Implement Contact Email Flow

1. Frontend contact form submits:
- name
- email
- reason
- message
2. API route `POST /contact` -> `send-contact-email` lambda.
3. Lambda validates payload.
4. Lambda sends SES email to target inbox.

Required env vars on lambda:
- `CONTACT_TARGET_EMAIL`
- `CONTACT_SOURCE_EMAIL`

## 8. CI/CD Setup

Create workflows:

## `ci.yml`
- on PR to main
- install dependencies
- lint
- security audit (`npm audit --omit=dev`)
- build

## `deploy.yml`
- on push to main
- repeat checks
- sync `frontend/dist` to S3
- invalidate CloudFront

Required GitHub secrets:
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `S3_BUCKET`
- `CLOUDFRONT_DISTRIBUTION_ID`

## 9. Frontend Environment Variables

At minimum:

```env
VITE_API_BASE_URL=https://<api-id>.execute-api.us-east-1.amazonaws.com/prod
VITE_COGNITO_DOMAIN=https://<domain>.auth.us-east-1.amazoncognito.com
VITE_COGNITO_CLIENT_ID=<app-client-id>
VITE_COGNITO_REDIRECT_URI=https://<your-domain>/callback
VITE_DEPLOY_WEBHOOK_URL=https://<deploy-trigger-endpoint>
```

## 10. Visual Layer Rebuild Sequence

1. Baseline layout and theme variables.
2. Home hero + bento + motion layers.
3. Route-unique visual signatures for each page.
4. Typography rhythm and heading accents.
5. Interaction stabilization (anti-flinch).
6. Mobile fluency pass + overflow hardening.
7. Source-specific posts card system.

## 11. Acceptance Checklist

- Public pages load in both themes.
- Admin login gate works.
- Admin save updates visible on another device.
- Contact form successfully emails inbox.
- Deploy pipeline works from git push.
- Admin deploy trigger reports success/failure reason.
- No horizontal overflow on major pages.
- Dark theme readability validated (cards and bento text).
