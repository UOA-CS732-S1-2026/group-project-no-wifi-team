# International Student Simulator — Frontend

A text-based interactive story game for international students, built with React + Vite.

## Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| React | 19 | UI framework |
| TypeScript | 5 | Type safety |
| Vite | 8 | Build tool & dev server |
| Tailwind CSS | 4 | Styling |
| React Router | 7 | Client-side routing |
| TanStack Query | 5 | Server state / data fetching |
| Vitest | 3 | Unit testing |
| ESLint + Prettier | 9 / 3 | Linting & formatting |

## Project Structure

```
src/
├── screens/        # Page-level components (one per route)
├── components/     # Reusable UI components
├── hooks/          # Custom React hooks
├── assets/         # Images, icons, static files
├── test/           # Test setup and utilities
├── App.tsx         # Router configuration
└── main.tsx        # App entry point
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Install dependencies

```bash
npm install
```

### Start development server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check formatting (CI use) |
| `npm run test` | Run tests in watch mode |
| `npm run test:run` | Run tests once |
| `npm run coverage` | Generate test coverage report |

## Adding a New Page

1. Create a screen component in `src/screens/YourScreen.tsx`
2. Add a route in `src/App.tsx`:

```tsx
{ path: '/your-path', element: <YourScreen /> }
```

## Code Style

- **Formatting**: Prettier (auto-format on save recommended)
- **Linting**: ESLint with TypeScript + React Hooks rules
- **TypeScript**: Strict mode enabled — no implicit `any`
- **Tailwind**: Custom color tokens defined in `src/index.css` under `@theme`
