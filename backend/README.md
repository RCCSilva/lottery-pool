# Backend API

Fastify backend with TypeScript and Zod validation.

## Setup

```bash
npm install
npm run dev
```

Server runs on `http://localhost:3001`

## Structure

- `src/index.ts` - Main server entry point
- `src/types/` - Shared TypeScript types (used by frontend)
- `src/schemas/` - Zod validation schemas
- `src/routes/` - API route handlers

## Example Endpoints

- `GET /health` - Health check
- `POST /users` - Create user (with Zod validation)
- `GET /users/:id` - Get user by ID (with Zod validation)

## Type Sharing

Types defined in `src/types/index.ts` are imported by the frontend for type safety across the stack.

