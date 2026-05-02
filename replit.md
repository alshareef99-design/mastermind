# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## Artifacts

### Earth Explorer Game (`artifacts/earth-game`)
- **Type**: react-vite, served at `/`
- **Purpose**: Geography learning game for memorizing countries, flags, capitals, and maps
- **Features**:
  - **Flag Quiz**: Identify countries by their flag emoji (20 questions, streak system)
  - **Map Quiz**: Click the correct country location on a dot map (hints toggle)
  - **Shape Quiz**: Recognize countries by their SVG shape outline
  - **Capital Quiz**: Match countries to capitals (two modes: country→capital and capital→country)
  - **Flash Cards**: Flip cards with flag, capital, population, area, fun fact + grid view
  - **Leaderboard**: Stored scores in localStorage
  - **Continent filter**: Filter all quizzes by region (Africa, Asia, Europe, etc.)
- **Data**: 191 countries with name, capital, continent, population, area, flag emoji, lat/lng, fun fact
- **No backend needed**: Fully client-side, no API calls
