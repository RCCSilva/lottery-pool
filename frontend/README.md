# Frontend

Next.js 14 application with TypeScript and styled-components.

## Setup

```bash
npm install
npm run dev
```

Application runs on `http://localhost:3000`

## Features

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **styled-components** for styling
- **Type Sharing** - Imports types directly from backend

## Type Sharing

Types are imported from the backend:

```typescript
import { User, LotteryPool } from '@/types'
```

The `@/types` alias resolves to `src/types/index.ts`, which re-exports types from the backend.

## Project Structure

- `src/app/` - Next.js app directory (pages, layouts, etc.)
- `src/types/` - Re-exported backend types for convenience

