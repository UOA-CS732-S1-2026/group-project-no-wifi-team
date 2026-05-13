# International Student Simulator — Team No WiFi

A browser-based life simulation game where players experience the highs and lows of being an international student. Navigate four academic quarters, manage your Intelligence, Health, and Wealth attributes, and discover one of many possible endings based on the choices you make.

**Live demo:** https://uoa-cs732-s1-2026.github.io/group-project-no-wifi-team/

![Team banner](./No%20WiFi%20Team.png)

---

## Team

| Name | UoA Email |
|---|---|
| Zhengyi Hao | zhao761@aucklanduni.ac.nz |
| Baiyi He | bhe783@aucklanduni.ac.nz |
| Grace Liao | jila776@aucklanduni.ac.nz |
| Huijing Men | hmen498@aucklanduni.ac.nz |
| Shiying Yang | syan634@aucklanduni.ac.nz |
| Alvin Zhu | jzhu528@aucklanduni.ac.nz |

---

## Game Overview

Players begin by selecting a character — each with different starting attribute levels — then progress through four quarters of university life. Each quarter involves:

1. **Monthly Task Selection** — choose tasks across Study, Health, and Wealth categories
2. **Task Interaction** — face events and make decisions that affect your attributes
3. **Quarter Summary** — review how your stats changed

After four quarters, your final attributes determine which of the multiple possible endings you unlock. Endings are collected in a gallery and ranked on a global leaderboard.

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 + TypeScript | UI framework |
| Redux Toolkit | Global game state management |
| React Router v7 | Client-side routing |
| Framer Motion (`motion`) | Animations and transitions |
| Tailwind CSS v4 | Styling |
| Vite | Build tool |
| Vitest + Testing Library | Unit and component testing |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express 5 | REST API server |
| MongoDB + Mongoose | Database (users, results, achievements) |
| bcryptjs | Password hashing |
| JSON Web Tokens | Authentication |

### Infrastructure
| Tool | Purpose |
|---|---|
| GitHub Actions | CI (type check, test, build) on every PR |
| GitHub Pages | Frontend deployment |
| GitHub Projects | Task tracking and sprint planning |

---

## Project Structure

```
group-project-no-wifi-team/
├── frontend/               # React + TypeScript application
│   ├── src/
│   │   ├── screens/        # Top-level page components
│   │   ├── components/     # Reusable UI components
│   │   ├── slices/         # Redux state slices
│   │   ├── api/            # API client functions
│   │   ├── assets/         # Images and static assets
│   │   ├── contexts/       # React contexts (music, etc.)
│   │   └── utils/          # Pure utility functions + tests
│   └── package.json
├── backend/                # Express REST API
│   ├── src/
│   │   ├── routes/         # API route handlers
│   │   ├── db/             # Mongoose models and schemas
│   │   ├── middleware/      # Auth and request middleware
│   │   └── app.js          # Server entry point
│   └── package.json
└── .github/workflows/
    ├── ci.yml              # PR checks: type check → test → build
    └── deploy.yml          # Auto-deploy to GitHub Pages on merge to main
```

---

## Local Development

### Prerequisites
- Node.js 20+
- MongoDB instance (local or MongoDB Atlas)

### 1. Clone the repository

```bash
git clone git@github.com:UOA-CS732-S1-2026/group-project-no-wifi-team.git
cd group-project-no-wifi-team
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/no-wifi-team
JWT_SECRET=your_jwt_secret_here
```

Start the backend server:

```bash
node src/app.js
```

The API will be available at `http://localhost:3001/api`.

### 3. Frontend setup

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_BASE_URL=http://localhost:3001/api
```

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Running Tests

```bash
cd frontend
npm run test:run        # Run all tests once (used in CI)
npm run test            # Run tests in watch mode
npm run coverage        # Run tests with coverage report
```

Tests cover utility functions (ending resolution, attribute level calculation, score calculation), screen components, and UI interactions.

---

## API Endpoints

### Auth & User (`/api/user`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/user/register` | — | Register a new user |
| `POST` | `/api/user/login` | — | Login, receive JWT |
| `POST` | `/api/user/google` | — | Google OAuth login |
| `GET` | `/api/user/me` | JWT | Get current user profile |
| `PUT` | `/api/user/password` | JWT | Change password |
| `POST` | `/api/user/logout` | JWT | Logout |
| `GET` | `/api/user/achievements/:userId` | — | Get user's earned achievements |
| `GET` | `/api/user/endings/:userId` | — | Get user's unlocked endings |

### Game (`/api/game`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/game/events?quarter=1` | — | Get selectable tasks for a quarter |
| `GET` | `/api/game/events/random?quarter=1` | — | Get a random event for a quarter |
| `POST` | `/api/game/result` | Optional JWT | Save a completed game result |
| `GET` | `/api/game/results` | — | Get all results (leaderboard data) |
| `GET` | `/api/game/result/latest` | Optional JWT | Get most recent result |
| `GET` | `/api/game/quarterly-summary` | — | Get quarterly summary for a user |

### Endings & Achievements (`/api/endings`, `/api/achievements`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/endings` | — | Get all possible endings |
| `GET` | `/api/endings/:endingId` | — | Get a single ending by ID |
| `GET` | `/api/achievements` | — | Get all achievement definitions |

### Leaderboard (`/api/leaderboard`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/leaderboard` | — | Get global ranking list |

---

## Deployment

### Frontend (GitHub Pages)

The frontend is automatically deployed to GitHub Pages on every push to `main` via `.github/workflows/deploy.yml`. No manual steps required.

To deploy manually:

```bash
cd frontend
VITE_API_BASE_URL=https://your-backend-url/api npm run build
# Upload the contents of frontend/dist/ to your static host
```

### Backend

Deploy `backend/` to any Node.js host (e.g. Render, Railway, Fly.io). Set the following environment variables on your host:

```env
PORT=3001
MONGODB_URI=<your MongoDB Atlas connection string>
JWT_SECRET=<a strong random secret>
```

---

## CI Pipeline

Every pull request to `main` triggers `.github/workflows/ci.yml`, which runs:

1. **Type check** — `npx tsc --noEmit`
2. **Tests** — `npm run test:run`
3. **Build** — `npm run build`
4. **Backend syntax check** — `node --check src/app.js`

All checks must pass before a PR can be merged.
