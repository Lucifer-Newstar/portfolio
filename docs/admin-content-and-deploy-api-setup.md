# Admin Content and Deploy API Setup

Last updated: 2026-04-08

This project now expects API routes for admin content persistence and deploy triggering.

## 1. Required API Routes

- `GET /admin/content` -> `get-site-content` lambda
- `POST /admin/content` -> `save-site-content` lambda
- `POST /admin/deploy` -> `deploy-website` lambda
- `OPTIONS` for the above routes for CORS preflight

### Verified prod routing (2026-04-08)
- `/admin/content` OPTIONS uses Lambda proxy (`get-site-content`) for consistent CORS headers.
- `/admin/deploy` OPTIONS uses Lambda proxy (`deploy-website`) for browser preflight support.

## 2. Frontend Behavior

`frontend/src/utils/api.js` now does:
- site content load/save via `/admin/content` first
- fallback to posts-based system record for backward compatibility
- deploy button via `/admin/deploy` first
- fallback to `VITE_DEPLOY_WEBHOOK_URL` if API deploy route fails

## 3. Deploy Lambda Config (`deploy-website`)

Lambda file:
- `backend/lambdas/deploy-website/src/index.mjs`

Template:
- `backend/lambdas/deploy-website/template.yaml`

Set environment variables on Lambda:
- `GITHUB_OWNER=Lucifer-Newstar`
- `GITHUB_REPO=portfolio`
- `GITHUB_WORKFLOW_FILE=deploy.yml`
- `GITHUB_REF=main`
- `GITHUB_TOKEN=<fine-grained token with actions:write on repo>`

Important:
- GitHub workflow file on default branch must include `workflow_dispatch`.
- If API returns 422 with "Workflow does not have 'workflow_dispatch' trigger", push updated `.github/workflows/deploy.yml` to the repo default branch.

## 4. Site Content Table

Both `save-site-content` and `get-site-content` use:
- Table: `site_content`
- Primary key: `id` (string)
- Stored key currently: `id = "global"`

## 5. Optional Frontend Env

If deploy API is not reachable and you still want fallback trigger:

```env
VITE_DEPLOY_WEBHOOK_URL=https://<your-webhook-endpoint>
```

Optional API path override (defaults to `/admin/deploy`):

```env
VITE_DEPLOY_API_PATH=/admin/deploy
```

## 6. CORS baseline used by admin APIs

Recommended response headers:
- `Access-Control-Allow-Origin: *`
- `Access-Control-Allow-Headers: Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token`
- `Access-Control-Allow-Methods: GET,POST,OPTIONS` (or `POST,OPTIONS` for deploy route)

## 7. Security note

Do not keep PAT values in repository files. Prefer AWS Secrets Manager/SSM and rotate any exposed token.
