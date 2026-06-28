# Frontend App

This folder contains the active Vite + React application for the portfolio platform. If you are running, testing, or building the website, start here.

## Stack

- React 19
- Vite 5
- React Router 7
- GSAP
- Three.js with `@react-three/fiber` and `@react-three/drei`

## Run Locally

```bash
cd frontend
npm ci --legacy-peer-deps
npm run dev
```

Node version: `22` via [frontend/.nvmrc](/D:/navin/Resume%20and%20Portfolio/portfolio/frontend/.nvmrc)

## Recommended Env

```env
VITE_API_BASE_URL=https://6e2n1oy6k9.execute-api.us-east-1.amazonaws.com/prod
VITE_COGNITO_DOMAIN=https://us-east-1iwnapdbk8.auth.us-east-1.amazoncognito.com
VITE_COGNITO_CLIENT_ID=2kqig6fjtjb5rot22ccttr398n
VITE_COGNITO_REDIRECT_URI=https://lucifernewstar-2006.xyz/callback
VITE_COGNITO_SCOPE=openid email phone
```

The app has fallback values for the current live environment, but explicit env values are the safer rebuild path.

## Verification

```bash
cd frontend
npm run lint
npm run build
npm audit --omit=dev
```

## SonarQube

CI is prepared for an optional repo-level SonarQube quality gate. The scan covers `frontend/src/` and the Lambda handlers under `backend/lambdas/**/src/`, and it runs only when these GitHub settings are configured:

- Secret: `SONAR_TOKEN`
- Variable: `SONAR_HOST_URL`
- Variable: `SONAR_PROJECT_KEY`

If those values are absent, the rest of CI still runs normally.
