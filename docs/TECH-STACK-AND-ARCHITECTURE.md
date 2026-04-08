# Tech Stack and Architecture

Last updated: 2026-04-08

## 1. Frontend Stack

- React 19
- Vite 5
- React Router 7
- GSAP + ScrollTrigger
- custom canvas-rendered particle scenes
- Three.js
- `@react-three/fiber`
- `@react-three/drei`
- CSS-first styling with layered override files

## 2. Backend Stack

- AWS Lambda
- API Gateway REST API
- DynamoDB
- Cognito Hosted UI + OAuth code flow with PKCE
- S3
- CloudFront
- Route 53
- ACM
- SES
- WAF
- SSM Parameter Store
- GitHub Actions

## 3. Frontend Runtime Architecture

### Entry and shell

- `frontend/src/main.jsx`
- `frontend/src/App.jsx`

Global layers mounted at app level:

- `PageThemeHandler`
- `RouteMeta`
- `ParticleBackground`
- `ThemeAtmosphere`
- `AdvancedVisualOverlays`
- `InteractionEffects`
- `ScrollAnimations`
- `ScrollProgress`
- `Breadcrumbs`

### Routes

Public routes:

- `/`
- `/about`
- `/experience`
- `/skills`
- `/projects`
- `/devops-lab`
- `/certifications`
- `/posts`
- `/contact`
- `/callback`

Protected admin route:

- `/lucifer-newstar_dashboard`

### State layers

Theme state:

- `ThemeContext` handles theme persistence and page-level theming

Content state:

- `SiteContentContext` manages saved content, draft content, local cache, remote hydration, and remote save

### API layer

`frontend/src/utils/api.js` centralizes:

- CRUD requests
- content load / save
- image upload
- deploy trigger
- public ops summary
- admin ops insights
- contact submit

## 4. Styling Architecture

### Base layers

- `frontend/src/styles/global.css`
- `frontend/src/styles/main.css`
- `frontend/src/styles/theme.css`

### Override layers

- `layout.css`
- `navbar-explore.css`
- `interaction.css`
- `home-hero.css`
- `admin-content.css`
- `scroll-story.css`
- `visual-additions.css`
- `advanced-visuals.css`
- `theme-signatures.css`
- `typography-rhythm.css`
- `page-experiences.css`
- `interaction-mobile-polish.css`
- `devops-observability.css`
- `posts-source-cards.css`

### Page layers

- `skills.css`
- `projects.css`
- `experience.css`
- `certifications.css`
- `posts.css`
- `contact.css`

## 5. Backend Architecture

### CRUD pattern

Each entity uses dedicated Lambdas for create, get, update, and delete.

Entity groups:

- skills
- projects
- experience
- certifications
- posts

### Utility handlers

- `get-site-content`
- `save-site-content`
- `deploy-website`
- `ops-insights`
- `send-contact-email`
- `fetch-github-activity`
- `upload-admin-image`

### Data storage model

- entity tables store records directly in DynamoDB
- site content stores a root record plus chunk records in `site_content`
- admin-uploaded images are stored in S3 and referenced by public URL

## 6. Auth Architecture

Frontend:

- login button creates Cognito Hosted UI URL with PKCE
- callback route exchanges auth code for access token
- protected route checks session and expiry in `sessionStorage`

Backend:

- admin-sensitive handlers call Cognito userinfo endpoint with bearer token
- successful validation requires a valid `sub`

Important envs:

- `VITE_COGNITO_DOMAIN`
- `VITE_COGNITO_CLIENT_ID`
- `VITE_COGNITO_REDIRECT_URI`
- `COGNITO_USERINFO_URL`

## 7. Content Architecture

Save path:

1. admin edits draft content
2. frontend strips embedded image data and computes overrides
3. frontend posts override object to `/admin/content`
4. backend serializes JSON
5. backend chunks content into `site_content`
6. frontend stores saved snapshot locally after success

Read path:

1. frontend tries `GET /admin/content`
2. backend assembles chunked payload from DynamoDB
3. frontend merges overrides with default content

## 8. Deploy Architecture

### CI

`ci.yml` runs:

- checkout
- Node setup
- `npm ci --legacy-peer-deps`
- lint
- production dependency audit
- build

### Production deploy

`deploy.yml` runs:

- checkout
- Node setup using `frontend/.nvmrc`
- install
- lint
- production dependency audit
- build
- S3 sync
- CloudFront invalidation

Critical deploy rule:

```bash
aws s3 sync frontend/dist s3://<bucket> --delete --exclude "images/uploads/*"
```

### Admin-triggered deploy

1. admin UI posts to `/admin/deploy`
2. `deploy-website` validates bearer token
3. Lambda fetches GitHub PAT from SSM
4. Lambda dispatches GitHub Actions workflow

## 9. Operations Architecture

Public:

- `GET /ops/summary`

Admin:

- `GET /admin/ops-insights`

Signals collected:

- Lambda metrics
- Lambda logs
- API Gateway status
- CloudFront request telemetry
- S3/site health context
- GitHub Actions deploy history

## 10. Backup and Restore Architecture

Reference artifacts:

- `backend/aws-backups/2026-04-08/`
- `backend/export-aws-backup.cmd`
- `backend/api-gateway/portfolio-rest-api-prod-oas30.json`

Design intent:

- docs explain the build order and rules
- templates capture local Lambda intent
- backup snapshot captures the deployed AWS state
- together they form the practical rebuild blueprint
