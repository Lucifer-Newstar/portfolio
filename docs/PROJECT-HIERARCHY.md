# Project Hierarchy (Current)

Last updated: 2026-04-08

## 1. Top-Level

```text
portfolio/
|- .github/
|  \- workflows/
|     |- ci.yml
|     \- deploy.yml
|- backend/
|  |- api-gateway/
|  |  \- portfolio-rest-api-prod-oas30.json
|  |- dynamodb/
|  |  \- schemas/
|  |     |- certifications.json
|  |     |- experience.json
|  |     |- posts.json
|  |     |- projects.json
|  |     \- skills.json
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
|     |- fetch-github-activity/
|     |- get-certifications/
|     |- get-experience/
|     |- get-post/
|     |- get-projects/
|     |- get-skills/
|     |- send-contact-email/
|     |- update-certification/
|     |- update-experience/
|     |- update-post/
|     |- update-project/
|     \- update-skill/
|- docs/
|- frontend/
|  |- src/
|  |- package.json
|  \- ...
|- public/
|- package.json
\- README.md
```

## 2. Frontend Source Structure

```text
frontend/src/
|- App.jsx
|- main.jsx
|- components/
|  |- admin/
|  |  |- CertificationsManager.jsx
|  |  |- ContentManager.jsx
|  |  |- ExperienceManager.jsx
|  |  |- PostsManager.jsx
|  |  |- PreviewManager.jsx
|  |  |- ProjectsManager.jsx
|  |  \- SkillsManager.jsx
|  |- AdvancedVisualOverlays.jsx
|  |- Breadcrumbs.jsx
|  |- DepthPrism.jsx
|  |- Footer.jsx
|  |- InsightCharts.jsx
|  |- InteractionEffects.jsx
|  |- LinkedDataModal.jsx
|  |- LoginButton.jsx
|  |- Navbar.jsx
|  |- PageThemeHandler.jsx
|  |- ParticleBackground.jsx
|  |- ProjectCaseStudyModal.jsx
|  |- ProtectedRoute.jsx
|  |- RouteMeta.jsx
|  |- SceneOrb.jsx
|  |- ScrollAnimations.jsx
|  |- ScrollProgress.jsx
|  |- ThemeAtmosphere.jsx
|  \- ThemeToggle.jsx
|- content/
|- context/
|  |- SiteContentContext.jsx
|  |- ThemeContext.jsx
|  |- site-content-context.js
|  |- theme-context.js
|  |- useSiteContent.js
|  \- useTheme.js
|- pages/
|  |- admin/
|  |  \- AdminDashboard.jsx
|  \- public/
|     |- About.jsx
|     |- Callback.jsx
|     |- Certifications.jsx
|     |- Contact.jsx
|     |- DevOpsLab.jsx
|     |- Experience.jsx
|     |- Home.jsx
|     |- Login.jsx
|     |- Posts.jsx
|     |- Projects.jsx
|     \- Skills.jsx
|- styles/
|  \- overrides/
|     |- admin-content.css
|     |- advanced-visuals.css
|     |- home-hero.css
|     |- interaction-mobile-polish.css
|     |- interaction.css
|     |- layout.css
|     |- navbar-explore.css
|     |- page-experiences.css
|     |- posts-source-cards.css
|     |- scroll-story.css
|     |- theme-signatures.css
|     |- typography-rhythm.css
|     \- visual-additions.css
\- utils/
   |- adminAuth.js
   |- api.js
   \- portfolioInsights.js
```

## 3. Backend Lambda Pattern

Each Lambda folder typically contains:

```text
backend/lambdas/<function-name>/
|- src/
|  \- index.mjs
\- template.yaml
```

The project follows a CRUD-per-resource pattern:
- Skills: create/get/update/delete
- Projects: create/get/update/delete
- Experience: create/get/update/delete
- Certifications: create/get/update/delete
- Posts: create/get/update/delete
- Automation:
- `fetch-github-activity`
- `send-contact-email`

## 4. Key Runtime Boundaries

- Public experience: `frontend/src/pages/public/*`
- Admin experience: `frontend/src/pages/admin/AdminDashboard.jsx` + `components/admin/*`
- API integration layer: `frontend/src/utils/api.js`
- Auth flow: `frontend/src/utils/adminAuth.js`, `LoginButton.jsx`, `Callback.jsx`, `ProtectedRoute.jsx`
- Content persistence state machine: `SiteContentContext.jsx`
