# International Student Simulator — Ending Collection Page

This package contains the standalone **Ending Collection** page for International Student Simulator.

The ending page has been separated from the start page code. The ending page file is placed in its own folder:

```text
frontend/src/endings/EndingCollectionScreen.tsx
```

## Page Structure

```text
Ending Collection Page
├── Background layer
│   ├── Desk / wood-style background
│   └── Decorative objects: book, coffee, paper, photo
├── Main container
│   ├── Header
│   └── Ending grid
```

## Pages / Routes

| Page | Route | Description |
|---|---|---|
| Ending Landing Page | `/` | Simple standalone entry page |
| Ending Collection | `/endings` | Ending achievement collection page |

## How to Run

```bash
cd frontend
npm install
npm run dev
```

Then open:

```text
http://localhost:5173/endings
```

If Vite uses another port, replace `5173` with the port shown in the terminal.
