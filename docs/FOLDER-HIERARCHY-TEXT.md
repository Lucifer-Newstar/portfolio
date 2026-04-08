# Folder Hierarchy (Text)

Last updated: 2026-04-08

This tree omits bulky generated folders such as `node_modules`, Lambda `dist/node_modules`, and most synced S3 object contents.

```text
portfolio/
|- .github/
|  \- workflows/
|     |- ci.yml
|     \- deploy.yml
|- backend/
|  |- api-gateway/
|  |  \- portfolio-rest-api-prod-oas30.json
|  |- aws-backups/
|  |  \- 2026-04-08/
|  |     |- BACKUP-MANIFEST.md
|  |     |- README.txt
|  |     |- acm/
|  |     |- apigateway/
|  |     |- cloudfront/
|  |     |- cognito/
|  |     |- dynamodb/
|  |     |- iam/
|  |     |- inventory/
|  |     |- lambdas/
|  |     |- route53/
|  |     |- s3/
|  |     |- ses/
|  |     |- ssm/
|  |     \- waf/
|  |- dynamodb/
|  |- export-aws-backup.cmd
|  \- lambdas/
|     |- create-certification/
|     |- create-experience/
|     |- create-post/
|     |- create-project/
|     |- create-skill/
|     |- delete-certification/
|     |- delete-experience/
|     |- delete-post/
|     |- delete-project/
|     |- delete-skill/
|     |- deploy-website/
|     |- fetch-github-activity/
|     |- get-certifications/
|     |- get-experience/
|     |- get-post/
|     |- get-projects/
|     |- get-site-content/
|     |- get-skills/
|     |- ops-insights/
|     |- save-site-content/
|     |- send-contact-email/
|     |- update-certification/
|     |- update-experience/
|     |- update-post/
|     |- update-project/
|     |- update-skill/
|     \- upload-admin-image/
|- docs/
|  |- DOCS-INDEX.md
|  |- MASTER-DOC.md
|  |- TECH-STACK-AND-ARCHITECTURE.md
|  |- INFRASTRUCTURE-REBUILD-PLAYBOOK.md
|  |- PROJECT-HIERARCHY.md
|  |- FOLDER-HIERARCHY-TEXT.md
|  |- UPDATES-LOG.md
|  |- PROJECT-PROGRESS-LOG-2026-03-28_to_2026-04-08.md
|  |- CRITICAL-ISSUES-WARNINGS-AND-PRECAUTIONS.md
|  |- VISUAL-EFFECTS-CATALOG.md
|  |- admin-content-and-deploy-api-setup.md
|  \- contact-email-setup.md
|- frontend/
|  |- .nvmrc
|  |- index.html
|  |- package.json
|  |- vite.config.js
|  \- src/
|     |- App.jsx
|     |- main.jsx
|     |- assets/
|     |- components/
|     |  |- AdvancedVisualOverlays.jsx
|     |  |- Breadcrumbs.jsx
|     |  |- Footer.jsx
|     |  |- InteractionEffects.jsx
|     |  |- LinkedDataModal.jsx
|     |  |- Navbar.jsx
|     |  |- OperationsInsights.jsx
|     |  |- PageThemeHandler.jsx
|     |  |- ParticleBackground.jsx
|     |  |- ProjectCaseStudyModal.jsx
|     |  |- ProtectedRoute.jsx
|     |  |- RouteMeta.jsx
|     |  |- ScrollAnimations.jsx
|     |  |- ThemeToggle.jsx
|     |  \- admin/
|     |- content/
|     |- context/
|     |- data/
|     |- effects/
|     |- pages/
|     |  |- admin/
|     |  \- public/
|     |- styles/
|     |  |- global.css
|     |  |- main.css
|     |  |- theme.css
|     |  |- components/
|     |  |- overrides/
|     |  \- pages/
|     \- utils/
|- public/
|  |- 404.html
|  |- favicon.svg
|  \- icons.svg
|- scripts/
|  |- deploy-website-env-secure.json
|  |- ops-insights-env-secure.json
|  |- ssm-github-token-policy.json
|  |- upload-admin-image-env.json
|  \- upload-admin-image-s3-policy.json
|- src/      # legacy root stub
\- README.md
```

Notes:

- `frontend/` is the active website and admin app.
- `backend/aws-backups/2026-04-08/` is the current restore/reference snapshot.
- `backend/export-aws-backup.cmd` shows exactly how the AWS state was exported.
- `docs/CRITICAL-ISSUES-WARNINGS-AND-PRECAUTIONS.md` documents why several architectural guardrails exist.
