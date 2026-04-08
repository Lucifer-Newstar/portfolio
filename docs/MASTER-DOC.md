# Portfolio Master Doc

Last updated: 2026-04-08

## 1. Project Summary

This repository contains a production-style portfolio platform made of:

- a public Vite + React SPA in `frontend/`
- a hidden admin dashboard at `/lucifer-newstar_dashboard`
- AWS Lambda + API Gateway CRUD and utility APIs
- Cognito-protected admin write and deploy actions
- DynamoDB-backed editable site content with chunked storage
- admin image uploads to S3 under `images/uploads/`
- GitHub Actions deployment to S3 + CloudFront
- SES-backed contact form delivery
- public and admin operations / observability views
- an AWS recovery snapshot in `backend/aws-backups/2026-04-08/`

Live site:

- `https://lucifernewstar-2006.xyz`

## 2. Active Code Paths

Important repo truth:

- the production app is `frontend/`
- the root-level `src/` folder is an older stub, not the active site
- backend Lambda source lives under `backend/lambdas/*/src`
- API export lives in `backend/api-gateway/portfolio-rest-api-prod-oas30.json`

## 3. Live Resource Snapshot

### Hosting and edge

- S3 bucket: `navin-portfolio`
- CloudFront distribution: `ECVS4UV0ZKGHO`
- Route 53 hosted zone: `lucifernewstar-2006.xyz`
- ACM certificate ARN: `arn:aws:acm:us-east-1:969849535462:certificate/9ec7d419-495c-4160-86eb-c8cb57a60c45`
- WAF Web ACL attached to CloudFront

### API and auth

- REST API: `portfolio-rest-api`
- REST API id: `6e2n1oy6k9`
- stage: `prod`
- Cognito user pool: `us-east-1_IWnaPdbK8`
- Cognito app client: `2kqig6fjtjb5rot22ccttr398n`
- Cognito domain: `us-east-1iwnapdbk8.auth.us-east-1.amazoncognito.com`

### Data stores

- `skills`
- `projects`
- `experience`
- `certifications`
- `posts`
- `site_content`

### Security / config

- shared Lambda role: `lambda-dynamodb-role`
- SSM token path: `/portfolio/github/token`
- deployed website URL: `https://lucifernewstar-2006.xyz`

## 4. Lambda Surface

### CRUD handlers

- create / get / update / delete for skills
- create / get / update / delete for projects
- create / get / update / delete for experience
- create / get / update / delete for certifications
- create / get / update / delete for posts

### Platform handlers

- `fetch-github-activity`
- `send-contact-email`
- `get-site-content`
- `save-site-content`
- `deploy-website`
- `ops-insights`
- `upload-admin-image`

## 5. API Surface

### Public routes

- entity CRUD routes for skills, projects, experience, certifications, and posts
- `POST /posts/sync-github`
- `POST /contact`
- `GET /ops/summary`

### Admin routes

- `GET /admin/content`
- `POST /admin/content`
- `POST /admin/deploy`
- `GET /admin/ops-insights`
- `POST /admin/upload-image`

Browser-facing routes also require `OPTIONS`.

## 6. Core Runtime Rules

- admin mutations validate Cognito bearer tokens on the backend
- content saves store only override payloads, not the full expanded content tree
- `site_content` is chunked in DynamoDB to avoid item-size failures
- embedded base64 image payloads are stripped before save
- uploaded admin images go to S3 first and content stores only the returned public URL
- GitHub PAT must come from SSM, not plaintext Lambda env vars
- deploy workflow must exclude `images/uploads/*` from destructive sync deletes
- repo backups may be stored in git, but secrets in those backups must be redacted for the repo copy

## 7. AWS Backup Snapshot

Current backup:

- `backend/aws-backups/2026-04-08/`

Covered services:

- Lambda
- API Gateway
- DynamoDB
- Cognito
- CloudFront
- S3
- Route 53
- ACM
- SES
- IAM
- WAF
- SSM

Repo safety notes:

- Cognito `ClientSecret` is redacted in the checked-in backup copy
- SSM backup stores encrypted SecureString metadata rather than a decrypted token
- `backend/export-aws-backup.cmd` documents how the snapshot was collected

## 8. Current Verification Status

Completed locally on 2026-04-08:

- frontend lint: passed
- frontend production build: passed

Still requiring manual or live validation:

- full click-through of all public pages
- admin login round-trip through Cognito Hosted UI
- button/card/effect validation across both themes in a real browser
- live API, SES, deploy, and S3 upload behavior against AWS

Current non-blocking build warnings:

- very large `three-stack` bundle chunk
- `LinkedDataModal.jsx` is both static and dynamic imported, so intended code-splitting is partially defeated

## 9. Primary Reference Docs

Use these as the source of truth:

1. `docs/INFRASTRUCTURE-REBUILD-PLAYBOOK.md`
2. `docs/TECH-STACK-AND-ARCHITECTURE.md`
3. `docs/CRITICAL-ISSUES-WARNINGS-AND-PRECAUTIONS.md`
4. `docs/VISUAL-EFFECTS-CATALOG.md`
5. `docs/UPDATES-LOG.md`
