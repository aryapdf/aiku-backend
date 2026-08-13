# AIKU API (aiku-backend)

Backend API server for AIKU — Personal AI Workspace.

## Tech Stack

- **Hono** — lightweight web framework
- **Prisma** — ORM (PostgreSQL)
- **TypeScript** — type safety
- **Zod** — runtime validation

## Quick Start

```bash
npm install
cp .env.example .env
# Edit .env with your PostgreSQL credentials
npx prisma migrate dev --name init
npm run dev        # http://localhost:3003
```

## Project Structure

```
src/
├── server.ts              # Entry point
├── config/                # env, constants
├── lib/                   # db client, utils
├── types/                 # DTOs, Zod schemas, response types
├── middleware/             # auth, error handling, logger
├── repositories/          # Prisma data access
├── services/              # business logic
└── routes/                # API route handlers
```

## API Endpoints

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/auth/login` | OAuth login |
| `GET` | `/api/auth/session` | Current session |
| `POST` | `/api/auth/logout` | Logout |
| `GET` | `/api/projects` | List projects |
| `POST` | `/api/projects` | Create project |
| `GET` | `/api/projects/:id` | Get project |
| `PATCH` | `/api/projects/:id` | Update project |
| `DELETE` | `/api/projects/:id` | Delete project |
| `GET` | `/api/conversations` | List conversations |
| `POST` | `/api/conversations` | Create conversation |
| `GET` | `/api/conversations/:id` | Get conversation |
| `PATCH` | `/api/conversations/:id` | Update conversation |
| `DELETE` | `/api/conversations/:id` | Delete conversation |
| `GET` | `/api/messages` | List messages |
| `POST` | `/api/messages` | Send message (SSE stream) |
| `GET` | `/api/reference` | List reference files |
| `POST` | `/api/reference` | Upload reference file |
| `GET` | `/api/reference/:id` | Get reference file |
| `PATCH` | `/api/reference/:id` | Update reference file |
| `DELETE` | `/api/reference/:id` | Delete reference file |
| `GET` | `/api/models` | Available AI models |

## Response Format

```json
{ "data": { ... }, "meta": { "timestamp": "..." } }
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server (hot reload) |
| `npm run build` | Compile TypeScript |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:studio` | Open Prisma Studio |
| `npm run test` | Run tests |
