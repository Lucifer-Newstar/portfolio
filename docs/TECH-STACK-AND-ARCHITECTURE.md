# Tech Stack and Architecture

Last updated: 2026-04-08

## 1. Technologies Used

## Frontend
- React 19
- Vite 5
- React Router 7
- GSAP (motion)
- Three.js + @react-three/fiber + @react-three/drei (3D visuals)
- aws-amplify (auth integrations)
- Axios (available)

## Styling and UX
- Global CSS with layered override architecture
- Theme-aware design (light/dark)
- Route-level visual identities
- Scroll and interaction effect systems
- Source-specific feed cards

## Backend
- AWS Lambda (Node.js ESM style `index.mjs`)
- Amazon API Gateway (REST)
- Amazon DynamoDB (primary app data)
- Amazon SES (contact email delivery)

## Auth
- Amazon Cognito Hosted UI (code callback in current fallback session approach)
- Client-side protected route checks + session storage

## Delivery and Ops
- GitHub Actions CI (`.github/workflows/ci.yml`)
- GitHub Actions Deploy (`.github/workflows/deploy.yml`)
- AWS S3 static hosting (deploy target)
- AWS CloudFront invalidation post-deploy

## 2. High-Level Architecture

```text
Browser (Public/Admin React SPA)
  -> API layer (frontend/src/utils/api.js)
    -> API Gateway /prod/*
      -> Lambda functions
        -> DynamoDB tables (skills/projects/experience/certifications/posts)
        -> SES (contact email)

GitHub Actions (push main)
  -> Build frontend
  -> Sync dist to S3
  -> CloudFront invalidation
```

## 3. Frontend Architecture

## Core shell
- `App.jsx` manages route frame.
- Shared layers:
- `PageThemeHandler` (sets `data-page`)
- `RouteMeta` (SEO/OG metadata per route)
- `ParticleBackground`, `ThemeAtmosphere`, `AdvancedVisualOverlays`, `InteractionEffects`
- `ScrollAnimations`, `ScrollProgress`, `Breadcrumbs`

## State model
- `ThemeContext` handles light/dark theme and theme query support.
- `SiteContentContext` handles:
- saved content
- draft content
- local persistence
- remote snapshot sync via posts system record

## Admin model
- Single admin route: `/lucifer-newstar_dashboard`
- Tabbed managers:
- content
- preview
- CRUD sections
- posts manager
- Save and deploy workflows surfaced in UI.

## 4. Backend Architecture

## CRUD Functions
Per resource Lambda functions back `GET/POST/PUT/DELETE` routes.

## Posts system role
Posts are dual-purpose:
- public feed content
- hidden system records (for site-content snapshot persistence)

## Contact route
- New route contract: `POST /contact`
- Lambda: `send-contact-email`
- Sends to SES target mailbox.

## 5. Data and Contracts

## Canonical front-end API module
`frontend/src/utils/api.js`

Primary contracts:
- `fetchSkills/createSkill/updateSkill/deleteSkill`
- `fetchProjects/createProject/updateProject/deleteProject`
- `fetchExperience/...`
- `fetchCertifications/...`
- `fetchPosts/createPost/updatePost/deletePost`
- `syncGitHubActivity()`
- `fetchSiteContentRemote()/saveSiteContentRemote()`
- `submitContactForm()`
- `triggerWebsiteDeploy()`

## 6. Theming and Visual System

Layered CSS architecture in `frontend/src/styles/overrides/`:
- layout and navbar behavior
- interaction behaviors
- home hero/bento specializations
- admin content experience
- story scroll rails
- advanced overlays and cinematic atmospherics
- theme signatures (page-unique)
- typography rhythm
- posts source-card themes
- mobile and anti-flinch polish

## 7. CI/CD and Deployment

## CI
`ci.yml` on PRs to main:
- install
- lint
- npm audit (`--omit=dev`)
- build

## Deploy
`deploy.yml` on push to main:
- install
- lint
- npm audit
- build
- aws configure creds
- `aws s3 sync frontend/dist s3://<bucket> --delete`
- cloudfront invalidation

## Optional Admin-triggered deploy
- Uses `VITE_DEPLOY_WEBHOOK_URL`
- `triggerWebsiteDeploy()` sends POST payload to webhook.

## 8. Security Posture (Current)

- Private admin route
- Cognito-based login entry
- Client fallback session guard
- API CORS headers in Lambdas
- Deploy credentials in GitHub Secrets
- `.env` ignored by git
- Contact form validated server-side before SES send
