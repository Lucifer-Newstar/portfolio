# Infrastructure Rebuild Playbook

Last updated: 2026-04-08

This document is the rebuild blueprint for recreating the project from scratch. It is intentionally written like an infrastructure and operations playbook, not just a setup note.

## 1. Target System

Rebuild a portfolio platform with:

- static public SPA
- hidden admin dashboard
- Cognito-protected admin actions
- CRUD APIs backed by DynamoDB
- editable site-content sync
- admin image uploads to S3
- admin-triggered deploy through API + GitHub Actions
- contact email through SES
- public/admin operations views
- backup/export process for AWS state

## 2. Region and Naming Baseline

Use `us-east-1`.

Reference names:

- bucket: `navin-portfolio`
- REST API: `portfolio-rest-api`
- REST API id in current live system: `6e2n1oy6k9`
- admin route: `/lucifer-newstar_dashboard`
- domain: `lucifernewstar-2006.xyz`
- SSM token path: `/portfolio/github/token`
- shared Lambda role: `lambda-dynamodb-role`

## 3. Pre-Rebuild Inputs

Before provisioning, gather:

- AWS account access
- GitHub repository access
- GitHub PAT for workflow dispatch storage in SSM
- domain/DNS access
- SES sender mailbox ownership

Useful source artifacts:

- `backend/api-gateway/portfolio-rest-api-prod-oas30.json`
- `backend/lambdas/*/template.yaml`
- `backend/aws-backups/2026-04-08/`
- `docs/admin-content-and-deploy-api-setup.md`
- `docs/contact-email-setup.md`

## 4. Provision AWS Resources

Create:

- S3 bucket for static hosting
- CloudFront distribution
- Route 53 hosted zone / records
- ACM certificate in `us-east-1`
- WAF Web ACL
- API Gateway REST API
- Cognito user pool
- Cognito app client configured for OAuth code flow
- Cognito hosted domain
- SES identity for `navin.jairam@gmail.com`
- SSM SecureString `/portfolio/github/token`
- DynamoDB tables:
- `skills`
- `projects`
- `experience`
- `certifications`
- `posts`
- `site_content`

## 5. Build the Lambda Fleet

### CRUD handlers

Create handlers for:

- `create-skill`, `get-skills`, `update-skill`, `delete-skill`
- `create-project`, `get-projects`, `update-project`, `delete-project`
- `create-experience`, `get-experience`, `update-experience`, `delete-experience`
- `create-certification`, `get-certifications`, `update-certification`, `delete-certification`
- `create-post`, `get-post`, `update-post`, `delete-post`

### Platform handlers

Create:

- `fetch-github-activity`
- `send-contact-email`
- `get-site-content`
- `save-site-content`
- `deploy-website`
- `ops-insights`
- `upload-admin-image`

Reference source:

- `backend/lambdas/*/src/index.mjs`

## 6. IAM Rules

### Shared Lambda role

Grant only what is needed:

- DynamoDB access to project tables
- CloudWatch metrics/log read access for ops
- SSM `GetParameter` for `/portfolio/github/token`
- S3 `PutObject` only for `images/uploads/*` where needed

### Contact Lambda

- `ses:SendEmail`
- `ses:SendRawEmail`

### Upload Lambda

- `s3:PutObject` to uploads prefix

## 7. API Gateway Buildout

### Public routes

- CRUD routes for public entities
- `POST /posts/sync-github`
- `POST /contact`
- `GET /ops/summary`

### Admin routes

- `GET /admin/content`
- `POST /admin/content`
- `POST /admin/deploy`
- `GET /admin/ops-insights`
- `POST /admin/upload-image`

For browser-facing routes, create matching `OPTIONS`.

Deploy to stage:

- `prod`

## 8. Frontend Rebuild

Use the active app under `frontend/`.

Steps:

1. create Vite + React shell
2. add route structure
3. add contexts for theme and site content
4. add global visual layers
5. add public pages
6. add hidden protected admin route
7. wire API helpers
8. wire remote content hydration and saving
9. add deploy, upload, and ops UI

Required frontend env:

```env
VITE_API_BASE_URL=https://<api-id>.execute-api.us-east-1.amazonaws.com/prod
VITE_COGNITO_DOMAIN=https://<domain>.auth.us-east-1.amazoncognito.com
VITE_COGNITO_CLIENT_ID=<client-id>
VITE_COGNITO_REDIRECT_URI=https://<site-domain>/callback
VITE_COGNITO_SCOPE=openid email phone
```

## 9. Admin Auth Setup

Frontend:

- login button generates Hosted UI URL with PKCE
- callback exchanges code for access token
- protected admin route checks session + expiry

Backend:

- admin handlers validate bearer token with Cognito userinfo endpoint

Required env:

- `COGNITO_USERINFO_URL`
- `ALLOWED_ORIGINS`

## 10. Content Save Setup

Required rules:

- compute and save only content overrides
- strip embedded image data before save
- chunk serialized content in `site_content`

Why this exists:

- avoids `413 Payload Too Large`
- avoids DynamoDB item-size failures
- keeps admin saves predictable

## 11. Image Upload Setup

Do not store image blobs inside site content JSON.

Correct flow:

1. image selected in admin
2. frontend encodes and posts to `/admin/upload-image`
3. Lambda validates admin token
4. Lambda writes object to `images/uploads/` in S3
5. Lambda returns public URL
6. content stores URL only

## 12. Contact Email Setup

`POST /contact` -> `send-contact-email`

Required env:

- `CONTACT_TARGET_EMAIL`
- `CONTACT_SOURCE_EMAIL`
- `ALLOWED_ORIGINS`

Validation rules:

- require `name`, `email`, `message`
- basic email validation
- reject oversized messages

If SES is sandboxed, verify both sender and recipient.

## 13. GitHub Actions Setup

### `ci.yml`

- install
- lint
- audit
- build

### `deploy.yml`

- install
- lint
- audit
- build
- sync `frontend/dist` to S3
- invalidate CloudFront

Critical rule:

```bash
aws s3 sync frontend/dist s3://<bucket> --delete --exclude "images/uploads/*"
```

Without that exclusion, admin-uploaded images will be lost on deploy.

## 14. Deploy Trigger Setup

`deploy-website` requires:

- `GITHUB_OWNER`
- `GITHUB_REPO`
- `GITHUB_WORKFLOW_FILE`
- `GITHUB_REF`
- `GITHUB_TOKEN_PARAMETER=/portfolio/github/token`
- `COGNITO_USERINFO_URL`
- `ALLOWED_ORIGINS`

Required behavior:

- validate admin token
- read PAT from SSM
- dispatch GitHub Actions workflow

## 15. Operations Setup

`ops-insights` should provide:

- Lambda metrics
- API latency and 5xx visibility
- CloudFront request counts
- basic infra health
- deploy history from GitHub Actions
- recent CloudWatch logs

Split routes:

- public-safe `GET /ops/summary`
- admin-only `GET /admin/ops-insights`

## 16. Backup and Recovery Setup

Keep two forms of recovery material:

1. source and docs in git
2. exported AWS snapshot outside or alongside git

Current export helper:

- `backend/export-aws-backup.cmd`

Current snapshot:

- `backend/aws-backups/2026-04-08/`

Repo-copy backup rules:

- redact secrets before committing
- keep ciphertext-only SSM metadata if needed
- store full unredacted forensics backup outside the repo if required

## 17. Final Validation Checklist

- public routes render
- hidden admin route is protected
- Cognito login callback works
- content save works
- image upload works
- deploy trigger works
- uploaded images survive deploy
- contact email works
- ops views work
- no plaintext GitHub PAT exists in code or Lambda env vars
- backup snapshot exists and is documented

## 18. Known Gaps After This Pass

- no automated browser test suite exists for cross-page/button/theme verification
- build still warns about large bundle chunks
- some recovery fidelity still depends on AWS backup artifacts, not SAM templates alone
