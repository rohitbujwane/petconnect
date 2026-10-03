# Pet Connect — System Architecture & Design

## 1. High-Level Architecture Overview
Pet Connect is built on a clean three-tier architecture:
1. **Presentation Tier:** A reactive Single Page Application (SPA) built with React 19, TypeScript, Vite, and Tailwind CSS.
2. **Application / Business Logic Tier:** A Node.js and Express.js RESTful API structured around service-controller-route separation.
3. **Data Tier:** A MongoDB-compatible asynchronous persistence layer providing document validation, indexing, and pre-seeded initial state.

```mermaid
graph TD
    Client["Client Browser (React 19 + TypeScript + Vite)"]
    Router["React Router v7 / State Contexts"]
    Axios["Axios Interceptors with JWT Bearer"]
    
    SubGraphBackend["Backend API Server (Express.js / Node.js)"]
        AuthMiddleware["Auth & RBAC Middleware"]
        Controllers["API Controllers (Pets, Adoptions, Rescue, etc.)"]
        Services["Business Services (AI Matcher, PetCare Engine)"]
        DataStore["Data Access Layer (Mongoose / JSON Storage)"]
    end
    
    Database[("Data Persistence (MongoDB / Local JSON Store)")]

    Client --> Router
    Router --> Axios
    Axios -- "HTTP / REST API (Port 5000)" --> SubGraphBackend
    SubGraphBackend --> AuthMiddleware
    AuthMiddleware --> Controllers
    Controllers --> Services
    Controllers --> DataStore
    DataStore --> Database
```

---

## 2. Directory & Module Structure

```
petconnect/
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable UI widgets (Navbar, Footer, Modals, Maps, Cards)
│   │   ├── context/          # Global state management (AuthContext, NotificationContext)
│   │   ├── pages/            # 20+ feature route views (Home, Pets, Rescue, LostFound, Admin, etc.)
│   │   ├── services/         # Axios API abstraction layer
│   │   ├── types/            # TypeScript data contracts & schema definitions
│   │   ├── App.tsx           # Route declaration & application shell
│   │   └── main.tsx          # Application entrypoint
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
│
├── backend/
│   ├── src/
│   │   ├── controllers/      # Request handlers & HTTP responses
│   │   ├── middleware/       # JWT token verification, RBAC, error handlers
│   │   ├── models/           # Data store abstraction, types, schema interfaces
│   │   ├── routes/           # REST endpoint definitions
│   │   ├── services/         # Algorithmic logic (AI Matcher, PetCare knowledge)
│   │   ├── utils/            # Seed data generators, password hashing helpers
│   │   └── server.ts         # Express server bootstrapping
│   ├── package.json
│   └── tsconfig.json
│
├── docs/                     # Comprehensive architectural & technical specifications
├── .env.example
├── README.md
└── package.json              # Monorepo task orchestration
```

---

## 3. Data Flow & Security Model

### Authentication Flow
1. User provides credentials to `/api/auth/login`.
2. Controller retrieves user record and executes `bcrypt.compare()` against the stored hash.
3. Upon validation, the server issues a signed JWT token encapsulating the user's `id`, `email`, and `role`.
4. The client caches the JWT in `localStorage` and injects it into all subsequent outgoing HTTP requests via Axios request interceptors:
   ```typescript
   config.headers.Authorization = `Bearer ${token}`;
   ```
5. Protected endpoints pass through `authenticateToken` and `requireRole(['admin', 'ngo', ...])` middleware to enforce role boundaries.

### Explainable AI Matching Engine Flow
1. Adopter submits their profile: Living environment, activity level, pet experience, work schedule, family situation.
2. The `aiMatchingService` fetches candidate pets and runs a normalized scoring algorithm:
   $$\text{Score} = w_{\text{species}} \cdot S + w_{\text{living}} \cdot L + w_{\text{activity}} \cdot A + w_{\text{exp}} \cdot E + w_{\text{fam}} \cdot F$$
3. Each sub-dimension yields an individual compatibility rating alongside human-readable explanations.
4. Results are returned sorted by descending compatibility score.

---

## 4. Frontend State Management
- **AuthContext:** Maintains currently authenticated user, active role, JWT token, and provides 1-click demo login helpers.
- **NotificationContext:** Tracks unread notification counts, polling simulation, and toast notifications.
- **Local Form State:** Managed with reactive controlled inputs and validation states.
