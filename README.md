# Chewlitics AI

A nutrition logging MVP with a React frontend and FastAPI backend.

## Run locally

1. Start the backend

```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload
```

- Backend default URL: `http://localhost:8000`
- API docs: `http://localhost:8000/docs`

2. Start the frontend

```bash
cd frontend
npm install
npm start
```

- Frontend default URL: `http://localhost:3000`

> Run the backend first so the frontend can connect to the API.

## Project structure

```
chewlitics-ai/
│
├── backend/                          # Python FastAPI backend server
│   ├── main.py                       # App entry point, API routes
│   ├── models.py                     # Database models (users, meals, nutrition data, etc.)
│   ├── database.py                   # Database connection & session config
│   ├── schemas.py                    # Pydantic schemas for validation
│   └── requirements.txt              # Python dependencies
│
├── frontend/                         # React.js web application
│   ├── public/                       # Static assets served publicly
│   │   └── index.html, manifest.json, robots.txt
│   │
│   ├── src/                          # React source code
│   │   │
│   │   ├── components/               # Reusable React components
│   │   │   ├── layout/               # Layout wrappers (Header, Sidebar, Layout)
│   │   │   └── ui/                   # UI building blocks (Button, Card, etc.)
│   │   │
│   │   ├── constants/                # App-wide constants (theme, colors, spacing)
│   │   │
│   │   ├── pages/                    # Full page components (Dashboard, MealScanner, etc.)
│   │   │
│   │   ├── App.js                    # Main app router & structure
│   │   ├── index.js                  # React DOM render entry point
│   │   └── [CSS & test files]        # Styling and tests
│   │
│   ├── package.json                  # Node.js dependencies & scripts
│   └── node_modules/                 # Installed npm packages (generated)
│
├── README.md                         # Project overview
└── REDESIGN_SUMMARY.md               # Design decisions & architecture notes
```

