# Visual Effects Catalog

Last updated: 2026-04-08

This file catalogs the visual, motion, depth, and interaction systems used in the active frontend under `frontend/src/`. It is intended to answer two questions:

1. what visual effects exist
2. where each one lives

## 1. Global Scene and Atmosphere

### Canvas particle world

Files:

- `frontend/src/components/ParticleBackground.jsx`

Effects:

- full-screen animated canvas background
- dark-theme node network with connecting lines
- light-theme floating glow shapes
- pointer-reactive radial lighting
- drifting haze, sparkles, waves, dust, and blob fields
- reduced-motion handling

### Theme atmosphere shapes

Files:

- `frontend/src/components/ThemeAtmosphere.jsx`
- `frontend/src/styles/overrides/advanced-visuals.css`

Effects:

- floating orbit/ring/panel/prism/glass forms
- different atmosphere objects in light and dark themes
- slow scene drift and depth layering

### Cinematic overlay layer

Files:

- `frontend/src/components/AdvancedVisualOverlays.jsx`
- `frontend/src/styles/overrides/advanced-visuals.css`

Effects:

- cinematic fog bands
- light beams
- telemetry orbits
- telemetry nodes
- scene-seed changes by route
- scroll-progress and scroll-velocity CSS variables
- pointer aura that changes state based on hovered target type

## 2. Interaction Effects

### Cursor and spotlight system

Files:

- `frontend/src/components/InteractionEffects.jsx`
- `frontend/src/styles/overrides/interaction.css`
- `frontend/src/styles/overrides/interaction-mobile-polish.css`

Effects:

- custom cursor dot and ring
- spotlight following the pointer
- cursor trail particles
- pressed and hover cursor states
- per-surface pointer glow variables for buttons and chips
- disabled automatically for reduced motion and coarse pointers

### Scroll progress control

Files:

- `frontend/src/components/ScrollProgress.jsx`
- global/override styles loaded from `frontend/src/main.jsx`

Effects:

- circular scroll progress indicator
- animated stroke-dash progress ring
- scroll-to-top button

## 3. Scroll and Motion Storytelling

### GSAP reveal system

Files:

- `frontend/src/components/ScrollAnimations.jsx`

Effects:

- page-shell entrance fades
- directional reveal variants via `data-reveal`
- story-section active state toggles
- marquee track parallax
- sticky-story card staged reveals
- orbit-node floating animation
- large-screen parallax transforms
- atmosphere shape page-scroll drift
- project-tile reveal and travel motion
- zoom-blur panel scroll transforms
- compact-motion/mobile reveal fallbacks

### Scroll-story and experience polish

Files:

- `frontend/src/styles/overrides/scroll-story.css`
- `frontend/src/styles/overrides/page-experiences.css`

Effects:

- scroll-story framing
- timeline emphasis
- stage and card activation visuals
- page-to-page narrative layout polish

## 4. Theme Effects

### Theme toggle presentation

Files:

- `frontend/src/components/ThemeToggle.jsx`
- `frontend/src/styles/overrides/theme-signatures.css`

Effects:

- branded theme toggle shell
- glow layers
- animated rings
- label treatment that changes with theme
- `@theme-toggles/react` icon animation

### Theme signatures

Files:

- `frontend/src/styles/overrides/theme-signatures.css`
- `frontend/src/styles/overrides/typography-rhythm.css`

Effects:

- dark theme neon/control-room atmosphere
- light theme warm editorial/royal atmosphere
- color shifts, glow accents, surface treatment
- typography pacing and contrast tuning

## 5. Hero and Page-Level Effects

### Home hero polish

Files:

- `frontend/src/styles/overrides/home-hero.css`
- `frontend/src/pages/public/Home.jsx`

Effects:

- hero glow field
- layered spotlight and card depth
- bento/grid polish
- portrait emphasis
- large-format landing presentation

### Additional page polish

Files:

- `frontend/src/styles/overrides/visual-additions.css`
- `frontend/src/styles/pages/projects.css`
- `frontend/src/styles/pages/posts.css`
- `frontend/src/styles/pages/skills.css`
- `frontend/src/styles/pages/experience.css`
- `frontend/src/styles/pages/certifications.css`
- `frontend/src/styles/pages/contact.css`

Effects:

- card depth and elevation
- source-themed post cards
- section framing and badge treatment
- zoom/blur/panel effects
- theme-consistent surfaces on every page

## 6. Navbar, Layout, and Structural Effects

Files:

- `frontend/src/styles/overrides/layout.css`
- `frontend/src/styles/overrides/navbar-explore.css`
- `frontend/src/components/Navbar.jsx`
- `frontend/src/components/Breadcrumbs.jsx`

Effects:

- layered shell layout
- polished navbar exploration states
- breadcrumb framing
- route-aware page chrome

## 7. Admin and Operations UI Effects

Files:

- `frontend/src/pages/admin/AdminDashboard.jsx`
- `frontend/src/components/admin/OperationsManager.jsx`
- `frontend/src/components/OperationsInsights.jsx`
- `frontend/src/styles/overrides/admin-content.css`
- `frontend/src/styles/overrides/devops-observability.css`

Effects:

- admin control-room / editorial workspace theming
- ribbon, metric-pill, and status-chip styling
- operations cards and insight surfaces
- deploy history and log panel styling
- health-state emphasis and observability polish

## 8. Visual System Warnings

- every visual change must be checked in both light and dark themes
- every visual change must be checked on mobile and desktop
- reduced-motion behavior exists but is not covered by automated tests
- custom cursor effects are intentionally disabled on coarse-pointer devices
- build remains functional, but bundle-size warnings mean heavy visual modules should be watched over time
