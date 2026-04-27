# International Student Simulator — Backend

The server-side API for the International Student Simulator, handling game logic, state persistence, and user progression.

## Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | 18+ | Runtime environment |
| TypeScript | 5 | Type safety |
| Express | 4 | Web framework |
| Prisma / Drizzle | - | ORM (Database access) |
| Vitest | 3 | Unit and integration testing |
| ESLint + Prettier | 9 / 3 | Linting & formatting |

## Project Structure

```
src/
├── controllers/    # Request handlers
├── services/       # Business & game logic
├── models/         # Database schemas/types
├── routes/         # API route definitions
├── middleware/     # Auth and validation middleware
├── config/         # Environment and global configuration
└── index.ts        # Entry point
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- A running database (PostgreSQL/MySQL) or local SQLite

### Environment Configuration

Before running the server, you **must** create a `.env` file in the root of the `backend/` directory to store sensitive configuration.

1. Copy the example template:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and fill in your local values:
   ```env
   PORT=3000
   DATABASE_URL="postgresql://user:password@localhost:5432/student_sim"
   JWT_SECRET="your_super_secret_key_here"
   NODE_ENV="development"
   ```

### Install dependencies

```bash
npm install
```

### Start development server

```bash
npm run dev
```

The API will be available at http://localhost:3000.

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with `tsx` (auto-reload) |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm run start` | Run the compiled production build |
| `npm run lint` | Run ESLint check |
| `npm run test` | Run tests via Vitest |
| `npm run db:migrate`| Push database schema changes |

## API Documentation

- **Base URL**: `/api/`
