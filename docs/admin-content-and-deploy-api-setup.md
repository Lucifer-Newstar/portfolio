# Admin Content, Deploy, Ops, and Upload API Setup

Last updated: 2026-04-08

This guide covers the admin-facing APIs and the rules that make them reliable.

## 1. Required Admin Endpoints

### Content

- `GET /admin/content` -> `get-site-content`
- `POST /admin/content` -> `save-site-content`

### Deploy

- `POST /admin/deploy` -> `deploy-website`

### Operations

- `GET /admin/ops-insights` -> `ops-insights`

### Image upload

- `POST /admin/upload-image` -> `upload-admin-image`

Each browser-facing route also needs `OPTIONS`.

## 2. Authentication Rules

All admin-only routes must validate:

- `Authorization: Bearer <access_token>`

Validation method:

- call Cognito userinfo endpoint
- confirm a valid `sub`

Required env:

- `COGNITO_USERINFO_URL`
- `ALLOWED_ORIGINS`

## 3. Content Save Architecture

Current content save rules:

- save only content overrides
- strip embedded `data:image/...`
- chunk serialized payloads in `site_content`

These rules prevent:

- `413 Payload Too Large`
- DynamoDB item-size failures
- corrupted content saves after image editing

Key files:

- `frontend/src/context/SiteContentContext.jsx`
- `frontend/src/content/siteContent.js`
- `backend/lambdas/get-site-content/src/index.mjs`
- `backend/lambdas/save-site-content/src/index.mjs`

## 4. Deploy API Setup

`deploy-website` requires:

- `GITHUB_OWNER`
- `GITHUB_REPO`
- `GITHUB_WORKFLOW_FILE`
- `GITHUB_REF`
- `GITHUB_TOKEN_PARAMETER=/portfolio/github/token`
- `COGNITO_USERINFO_URL`
- `ALLOWED_ORIGINS`

Do not keep a plaintext PAT in Lambda env vars.

Key files:

- `backend/lambdas/deploy-website/src/index.mjs`
- `backend/lambdas/deploy-website/template.yaml`
- `.github/workflows/deploy.yml`

## 5. Ops Insights Setup

Public route:

- `GET /ops/summary`

Admin route:

- `GET /admin/ops-insights`

Data sources:

- CloudWatch metrics
- CloudWatch Logs
- CloudFront
- API Gateway
- S3/site health context
- GitHub Actions runs

Key files:

- `backend/lambdas/ops-insights/src/index.mjs`
- `frontend/src/components/OperationsInsights.jsx`
- `frontend/src/components/admin/OperationsManager.jsx`

## 6. Image Upload Setup

`upload-admin-image` should:

- validate admin token
- accept image payload from admin UI
- store object in S3 under `images/uploads/`
- return the final public URL

Required IAM:

- `s3:PutObject` to uploads prefix only

Required frontend rule:

- store only the returned URL in content

Key files:

- `backend/lambdas/upload-admin-image/src/index.mjs`
- `backend/lambdas/upload-admin-image/template.yaml`
- `frontend/src/utils/api.js`

## 7. Deployment Workflow Dependency

`.github/workflows/deploy.yml` must preserve uploaded images:

```bash
aws s3 sync frontend/dist s3://<bucket> --delete --exclude "images/uploads/*"
```

Without that exclusion, admin-uploaded images are lost.

## 8. Rebuild Precautions

- treat the AWS backup as the more complete restore snapshot than the SAM templates alone
- keep `ALLOWED_ORIGINS` consistent across all browser-facing admin handlers
- re-test admin login, save, deploy, and upload together after any auth or API change
