# Project Hierarchy

Last updated: 2026-04-08

## 1. Top-Level Structure

```text
portfolio/
|- .github/
|- backend/
|- docs/
|- frontend/
|- public/
|- scripts/
|- src/              # legacy stub, not active production app
\- README.md
```

## 2. Top-Level Responsibilities

### `.github/`

- CI workflow
- production deploy workflow

### `backend/`

- Lambda source
- API Gateway exports
- DynamoDB references
- AWS backup snapshots
- export helper scripts

### `docs/`

- rebuild blueprint
- architecture and hierarchy docs
- visual system catalog
- critical issue history
- focused setup guides

### `frontend/`

- active production SPA
- admin dashboard
- theme and motion systems

### `public/`

- static frontend assets such as `404.html`

### `scripts/`

- Lambda env payload snapshots
- IAM policy references
- helper artifacts used during ops/debugging

### `src/`

- older root-level starter code
- should not be treated as the current production frontend

## 3. Backend Modules

### `backend/lambdas/`

CRUD groups:

- skills
- projects
- experience
- certifications
- posts

Platform handlers:

- `deploy-website`
- `fetch-github-activity`
- `get-site-content`
- `save-site-content`
- `send-contact-email`
- `ops-insights`
- `upload-admin-image`

### `backend/aws-backups/`

- exported AWS state snapshots
- current snapshot: `2026-04-08`

### `backend/api-gateway/`

- exported REST API definition for the live API

## 4. Frontend Modules

### Shared components

- navigation
- overlays
- 3D background
- interaction effects
- scroll effects
- route metadata
- operations insights

### Admin components

- content manager
- preview manager
- resource managers
- operations manager

### Context modules

- theme context
- site content context

### Styling modules

- base theme and layout
- page-specific layers
- override layers for motion, glow, observability, and theme polish

## 5. Runtime Boundaries

- auth boundary: frontend session + server-side bearer validation
- content boundary: default content, draft state, override saves, remote sync
- deploy boundary: admin UI -> API -> GitHub Actions -> S3 -> CloudFront
- image boundary: admin UI -> upload API -> S3 -> URL stored in content
- backup boundary: source repo + AWS export snapshot together form recovery set
