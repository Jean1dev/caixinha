# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run lint     # Run ESLint
npm start        # Start production server
```

There is no test runner configured — no Jest or Vitest setup exists.

## Gotchas & conventions

- **Auth is OAuth-only** (Keycloak + Google, `src/pages/api/auth/[...nextauth].ts`). Logged-in screens can't be reached in local dev without real credentials — verify authenticated UI via `npm run build` + code review; only logged-out routes (e.g. `/` onboarding) are browser-drivable locally.
- **`next build` rewrites `tsconfig.json`** (`moduleResolution: node → bundler`). Revert it (`git checkout tsconfig.json`) after building.
- **`CenteredCircularProgress` triggers a benign hydration warning** — it picks a random capicoin image at render (SSR/CSR mismatch). Pre-existing; not a regression.

## Visual redesign (Indigo)

- `DESIGN_TASKS.md` tracks the Indigo redesign screen-by-screen; update it when redesigning a screen.
- Default theme preset is `indigo` (`#6366F1`, `src/theme/colors.ts`); `h1`–`h6` use Plus Jakarta Sans via `theme/base/create-typography.ts`.
- Redesign idiom: MUI components + inline `sx` (theme palette keys like `primary.lightest`/`success.dark`, plus hardcoded hex where needed). Card radius `5` (borderRadius) / shadow `0 5px 22px rgba(0,0,0,0.08)`; reuse the `GRADIENTS` array (see `src/pages/index.tsx`, `src/components/caixinha/CaixinhaCard.tsx`).

## Architecture Overview

**Next.js 16 + TypeScript** app using file-based routing under `src/pages/`. UI is built with **Material-UI (MUI) 5**. Data fetching uses **Axios** + **SWR** for caching. Auth is handled by **next-auth**.

### Folder structure

- `src/pages/` — Next.js routes. Each folder is a route (e.g. `carteira/`, `emprestimo/`, `feed/`, `perfil/`, `market/`)
- `src/pages/api/` — Next.js API routes and legacy API call modules (`api.carteira.ts`, `api.service.ts`)
- `src/features/` — New feature-based architecture (currently `carteira/` only), containing:
  - `api/` — Axios-based HTTP functions + TypeScript types
  - `hooks/` — SWR-powered custom hooks that abstract data fetching
  - `components/` — Feature-specific React components
- `src/components/` — Global/shared UI components organized by feature (legacy pattern)
- `src/contexts/` — React Context providers: `settings/` (theme/UI state) and `web3/` (Solana wallet)
- `src/hooks/` — Global custom hooks (`useUserAuth`, `useSettings`, `useSocket`, etc.)
- `src/constants/ApiConts.ts` — All backend service base URLs
- `src/theme/` — MUI theme factory with light/dark mode support
- `src/locales/` — i18n translations (Portuguese `pt.ts` and English `en.ts`)
- `src/anchor/` + `src/program/` — Solana/Anchor Web3 integration

### API layer

Backend services defined in `src/constants/ApiConts.ts`:
- `CARTEIRA_SERVICE` — investment wallet service (Heroku)
- `CAIXINHA_SERVICE` — loans/savings groups service (Azure)
- `STORAGE_SERVICE` — file/image storage (Heroku)
- `COMMUNICATION_SERVICE` — notifications

**New pattern** (preferred): feature module in `src/features/<feature>/api/` with typed Axios calls, consumed by SWR hooks in `src/features/<feature>/hooks/`. See `src/features/carteira/` as the reference implementation.

**Legacy pattern**: direct API calls in `src/pages/api/api.carteira.ts` and `src/pages/api/api.service.ts`. Being phased out.

### State management

- **SWR** for server state (with per-hook TTLs: 30s for wallets/assets, 1h for static data like asset types, 30s polling for quotes)
- **React Context** for UI state (theme settings via `useSettings()`)
- **next-auth SessionProvider** wraps the entire app for auth state

### Authentication

`useUserAuth()` hook returns `{ user, email, name }` from the next-auth session. User identity is passed as query params to API calls.

### Internationalization

`const { t } = useTranslation()` from react-i18next. Translations live in `src/locales/translations/pt.ts` and `en.ts`.

### Path alias

`@/*` maps to `src/*` (configured in `tsconfig.json`).

### TypeScript

Build errors are **ignored** in `next.config.js` (`typescript.ignoreBuildErrors: true`). Strict mode is enabled in tsconfig but the build won't fail on type errors.
