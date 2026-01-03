# Lottery Pool

A full-stack TypeScript application with a Fastify backend and Next.js frontend.

## Project Structure

```
lottery-pool/
├── backend/          # Fastify API server
│   ├── src/
│   │   ├── types/    # Shared types
│   │   ├── schemas/  # Zod validation schemas
│   │   └── index.ts  # Main server file
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/         # Next.js application
    ├── src/
    │   ├── app/      # Next.js app directory
    │   └── types/    # Re-exported backend types
    ├── package.json
    └── tsconfig.json
```

## Features

- **Backend**: Fastify with TypeScript and Zod validation
- **Frontend**: Next.js 14 with TypeScript and styled-components
- **Type Sharing**: Frontend imports types directly from backend

## Getting Started

### Quick Start with Makefile

The easiest way to get started is using the Makefile:

```bash
# Install all dependencies
make install

# Run both backend and frontend in development mode
make dev

# Or run them separately:
make dev-backend   # Backend on http://localhost:3001
make dev-frontend  # Frontend on http://localhost:3000
```

See all available commands with:
```bash
make help
```

### Manual Setup

#### Backend Setup

```bash
cd backend
npm install
npm run dev
```

The backend server will run on `http://localhost:3001`

#### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on `http://localhost:3000`

## Type Sharing

Types are shared between backend and frontend through direct imports. The frontend's `tsconfig.json` includes path mappings to access backend types:

```typescript
// In frontend code
import { User, LotteryPool } from '@/types'
```

The types are defined in `backend/src/types/index.ts` and re-exported in `frontend/src/types/index.ts` for convenience.

## Development

### Using Makefile

```bash
make dev              # Run both projects
make dev-backend      # Backend only (http://localhost:3001)
make dev-frontend     # Frontend only (http://localhost:3000)
make type-check       # Type check both projects
make build            # Build both projects
make clean            # Clean build artifacts
```

### Manual Commands

- Backend: `npm run dev` (uses tsx for hot reload)
- Frontend: `npm run dev` (Next.js dev server)
- Type checking: `npm run type-check` in either directory

## Static Export

The frontend is configured to build as a static site. After building, all static files will be generated in the `frontend/out` directory.

### Building Static Pages

```bash
# Build static export
cd frontend
npm run build

# The static files will be in frontend/out/
# You can serve them with any static file server:
# - npx serve frontend/out
# - python -m http.server 3000 -d frontend/out
# - Or deploy to any static hosting (GitHub Pages, Netlify, Vercel, etc.)
```

The static export includes all pages and assets, ready to be deployed to any static hosting service.

### GitHub Pages Deployment

To prepare the site for GitHub Pages deployment:

```bash
# Build frontend and create docs folder for GitHub Pages
make github-pages

# This will:
# 1. Build the frontend (creates frontend/out/)
# 2. Create a docs folder with the static files
# 3. Ready to commit and push

# Then commit and push:
git add docs
git commit -m "Deploy to GitHub Pages"
git push

# Finally, in GitHub repository settings:
# Settings > Pages > Source: select "docs" folder
```

The `docs` folder will contain all static files ready for GitHub Pages hosting.

