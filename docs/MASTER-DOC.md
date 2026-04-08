# Portfolio Project — Master Documentation

Last updated: 2026-04-08

## 1. Executive Summary

This project is a production-style portfolio platform with:
- public website (multi-page, themed, motion-rich)
- hidden admin dashboard (`/lucifer-newstar_dashboard`)
- AWS-backed CRUD content APIs
- cloud-synced editable site content
- source-specific feed cards (GitHub/LinkedIn/LeetCode/Notion/Other)
- CI/CD deployment to S3 + CloudFront
- contact email pipeline via Lambda + SES

The previous version of this file was from an early build phase and is now superseded by the architecture and rebuild docs listed below.

## 2. Current Documentation Source of Truth

Use these docs for full detail:

1. [DOCS-INDEX.md](/D:/navin/Resume%20and%20Portfolio/portfolio/docs/DOCS-INDEX.md)
2. [PROJECT-HIERARCHY.md](/D:/navin/Resume%20and%20Portfolio/portfolio/docs/PROJECT-HIERARCHY.md)
3. [TECH-STACK-AND-ARCHITECTURE.md](/D:/navin/Resume%20and%20Portfolio/portfolio/docs/TECH-STACK-AND-ARCHITECTURE.md)
4. [INFRASTRUCTURE-REBUILD-PLAYBOOK.md](/D:/navin/Resume%20and%20Portfolio/portfolio/docs/INFRASTRUCTURE-REBUILD-PLAYBOOK.md)
5. [UPDATES-LOG.md](/D:/navin/Resume%20and%20Portfolio/portfolio/docs/UPDATES-LOG.md)
6. [PROJECT-PROGRESS-LOG-2026-03-28_to_2026-04-08.md](/D:/navin/Resume%20and%20Portfolio/portfolio/docs/PROJECT-PROGRESS-LOG-2026-03-28_to_2026-04-08.md)
7. [contact-email-setup.md](/D:/navin/Resume%20and%20Portfolio/portfolio/docs/contact-email-setup.md)

## 3. Current Architecture Snapshot

## Frontend
- React + Vite SPA
- Route system for public + admin pages
- layered visual engine (theme-aware overrides, overlays, interaction polish)
- route-level metadata (`RouteMeta`) for SEO/OG

## Backend
- API Gateway + Lambda CRUD for `skills/projects/experience/certifications/posts`
- additional lambdas:
- `get-site-content` (`GET/OPTIONS /admin/content`)
- `save-site-content` (`POST /admin/content`)
- `deploy-website` (`POST/OPTIONS /admin/deploy`)
- `fetch-github-activity`
- `send-contact-email`
- DynamoDB as primary content store
- posts table doubles as hidden system-content store for admin content snapshot sync

## API -> Lambda route map (prod)
- `GET /admin/content` -> `get-site-content`
- `POST /admin/content` -> `save-site-content`
- `OPTIONS /admin/content` -> `get-site-content` (proxy integration for stable CORS headers)
- `POST /admin/deploy` -> `deploy-website`
- `OPTIONS /admin/deploy` -> `deploy-website`

## Delivery
- CI workflow on PR (`ci.yml`)
- deploy workflow on push main (`deploy.yml`)
- S3 sync + CloudFront invalidation

## 4. Key Functional Capabilities (Now Implemented)

- Admin content editing with save/discard and preview modes.
- Draft/saved content model with remote sync.
- Deploy trigger button in admin with explicit error reason output.
- Contact form submission wired to backend route (`POST /contact`) and SES mail send.
- Feed cards themed by source platform.
- Major visual and UX upgrades across pages with light/dark differentiation.

## 5. Security and Access Notes

- Admin area uses hidden route + Cognito login flow entry.
- Session handling now uses OAuth code exchange against Cognito `/oauth2/token` (no local-only auth fallback).
- Sensitive values should remain in environment variables, AWS Systems Manager/Secrets Manager, and GitHub secrets.
- Contact email sender requires SES identity verification and least-privilege IAM.
- Do not store GitHub Personal Access Tokens in repository docs or committed code.
- Rotate any token that was previously written in plaintext.
- Admin write/deploy APIs require bearer token validation via Cognito userinfo endpoint.

## 6. Operational Notes

- For contact email to work in production, deploy the contact Lambda and configure SES identities.
- For admin deploy button to work through API: `deploy.yml` on GitHub default branch must include `workflow_dispatch`.
- If API deploy trigger is unavailable, optional fallback uses `VITE_DEPLOY_WEBHOOK_URL`.
- Build status currently passes (`npm run build`).

## 7. Change Control

This `MASTER-DOC.md` now acts as a top-level index/summary document.  
Detailed and evolving technical truth should be maintained in:
- `PROJECT-HIERARCHY.md`
- `TECH-STACK-AND-ARCHITECTURE.md`
- `INFRASTRUCTURE-REBUILD-PLAYBOOK.md`
- `UPDATES-LOG.md`
- `PROJECT-PROGRESS-LOG-2026-03-28_to_2026-04-08.md`

## 8. Current IAM snapshot

- Shared API role: `lambda-dynamodb-role`
- Contact role: `send-contact-email-role` (inline SES send policy)
- Deploy trigger lambda currently runs on shared role and calls GitHub REST Actions API.
