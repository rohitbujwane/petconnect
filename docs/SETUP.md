# Pet Connect — Setup & Deployment Guide

This guide provides step-by-step instructions for running Pet Connect locally or preparing it for production deployment.

---

## 1. System Requirements
- **Node.js:** v18.0.0 or later (`node -v`)
- **Package Manager:** npm v9+ or yarn/pnpm
- **Operating System:** Windows, macOS, or Linux
- **Modern Browser:** Chrome, Firefox, Edge, or Safari with JavaScript enabled

---

## 2. Local Development Setup

### Step 1: Install Dependencies
From the repository root, install dependencies for all workspaces:
```bash
npm run install:all
```
*(Or navigate to `/backend` and `/frontend` individually and execute `npm install`)*

### Step 2: Configure Environment Variables
A pre-configured `.env` is ready in `backend/.env`. You can adjust settings as needed:
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=petconnect_super_secret_jwt_key_2026_final_year_project
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb://localhost:27017/petconnect
DATA_STORAGE=file
```

### Step 3: Run the Development Servers
From the root directory:
```bash
npm run dev
```
This triggers both:
- **Backend API Server:** Listening on `http://localhost:5000`
- **Frontend Vite Dev Server:** Accessible at `http://localhost:5173`

---

## 3. Testing with Demo Credentials

To experience full role-based permissions immediately, use the built-in demo credentials (or click the **"Demo Accounts"** badge in the navbar):

| Role | Email | Password |
| :--- | :--- | :--- |
| **System Administrator** | `admin@petconnect.demo` | `Demo@123` |
| **Partner NGO** | `ngo@petconnect.demo` | `Demo@123` |
| **Veterinarian** | `vet@petconnect.demo` | `Demo@123` |
| **Pet Adopter** | `user@petconnect.demo` | `Demo@123` |
| **Volunteer / Rescuer**| `volunteer@petconnect.demo` | `Demo@123` |

---

## 4. Building for Production

### Frontend Production Build
```bash
cd frontend
npm run build
```
The compiled, minified bundle will be output to `frontend/dist/`.

### Backend Production Build
```bash
cd backend
npm run build
```
The compiled JavaScript output will be located in `backend/dist/`.
Launch the production API server via:
```bash
node dist/server.js
```

---

## 5. Troubleshooting Common Issues

### Port 5000 / 5173 Already in Use
- Terminate existing instances:
  - On Windows: `netstat -ano | findstr :5000` then `taskkill /PID <PID> /F`
  - On Linux/macOS: `lsof -i :5000` then `kill -9 <PID>`
- Or change `PORT` in `backend/.env` and update `VITE_API_URL` in frontend.

### Leaflet Map Tiles Not Loading
Ensure you have an active internet connection to download OpenStreetMap tiles (`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`).
