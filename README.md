# 🐾 Pet Connect — AI-Powered Pet Adoption & Welfare Platform

> **"Connecting Hearts. Saving Lives."**
> A smart, full-stack digital platform uniting pet adopters, pet parents, animal rescuers, volunteers, partner NGOs, veterinarians, and animal welfare organizations into a unified ecosystem.

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)](https://expressjs.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-199900?style=for-the-badge&logo=Leaflet&logoColor=white)](https://leafletjs.com/)

---

## 🌟 Executive Summary

**Pet Connect** is built from scratch as a modern, production-grade, capstone Computer Science project. It bridges the critical communication gap across the animal rescue lifecycle: from emergency distress rescue dispatching and lost & found geo-tagging, to explainable AI-driven adoption matchmaking, digital health record passports, and 24/7 rule-backed PetCare triage assistance.

---

## 🚀 Key Highlights & Capabilities

1. **Role-Based Access Control (RBAC):**
   - 6 specialized roles: **Pet Adopter**, **Pet Owner**, **Rescuer / Volunteer**, **NGO / Shelter Organization**, **Veterinarian**, and **System Administrator**.
2. **Explainable AI Pet Matching Engine:**
   - Multi-dimensional algorithm weighting living space, activity stamina, prior canine/feline experience, work schedules, and children in household to compute transparent match percentages (e.g. 96%) with detailed rationales.
3. **Emergency Rescue Dispatch Hub:**
   - Emergency severity tagging (`Low`, `Medium`, `High`, `Critical`), geolocation tracking, volunteer assignment, and real-time status progression (`Reported` → `Assigned` → `In Progress` → `Rescued` → `Treatment` → `Closed`).
4. **Community Lost & Found Geolocation Radar:**
   - Interactive Leaflet map with color-coded pins for reported lost pets (red) and sightings (green), with one-tap *"I Found This Pet"* and *"This May Be My Pet"* claim channels.
5. **PetCare AI Assistant:**
   - Intelligent triage chatbot offering nutrition, vaccination schedules, grooming advice, and distress steps, with prominent veterinary disclaimers and emergency hotline dispatch.
6. **Digital Pet Health Passports:**
   - Lifetime vaccination registries, clinical histories, allergy trackers, and customizable SMS/in-app reminders for deworming, medication, and vet appointments.
7. **Comprehensive Command Centers:**
   - Role-specific dashboards featuring data visualization (Recharts), application triage pipelines, and administrative governance.

---

## 🔑 Quick Demo Access

Pet Connect includes pre-configured, pre-seeded accounts for instant evaluation:

| Role | Email | Password | Key Privileges |
| :--- | :--- | :--- | :--- |
| **System Administrator** | `admin@petconnect.demo` | `Demo@123` | Full control, audit logs, analytics, user & pet management |
| **Partner NGO** | `ngo@petconnect.demo` | `Demo@123` | Adoption approvals, shelter registry, volunteer dispatch |
| **Veterinarian** | `vet@petconnect.demo` | `Demo@123` | Appointment calendar, medical record certification |
| **Pet Adopter** | `user@petconnect.demo` | `Demo@123` | AI matching, applications, health passport, favorites |
| **Volunteer / Rescuer**| `volunteer@petconnect.demo` | `Demo@123` | Case acceptance, emergency rescue logs, field notes |

> **Pro Tip:** Use the **"Demo Accounts"** badge in the top navigation bar for 1-click instant login without manual typing!

---

## 🏗️ Architecture & Technology Stack

```
Pet Connect Ecosystem
├── Frontend (React 19 + TypeScript + Vite + Tailwind CSS)
│   ├── State: Context API (Auth, Notifications, Live Filter)
│   ├── Routing: React Router v7 with protected & role-guarded routes
│   ├── Visuals: Lucide React, Recharts (analytics), Leaflet (interactive maps)
│   └── Networking: Axios with automatic JWT Bearer token interceptor
│
└── Backend (Node.js + Express + TypeScript)
    ├── Security: bcryptjs password hashing, JSON Web Tokens (JWT), CORS, helmet
    ├── Database: High-performance async persistent store with MongoDB-compatible schema
    ├── Services: AI Compatibility Matcher, PetCare AI Knowledge Engine
    └── Seed Engine: Indian localized demo dataset (Pune, Mumbai, Nanded, Nagpur, Sambhajinagar)
```

---

## ⚡ Quick Start & Installation

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)

### 1. Clone & Install Dependencies
```bash
# Navigate to project directory
cd petconnect

# Install root, backend, and frontend dependencies
npm run install:all
```

### 2. Environment Configuration
Backend `.env` is pre-configured with safe local defaults:
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=petconnect_super_secret_jwt_key_2026_final_year_project
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb://localhost:27017/petconnect
DATA_STORAGE=file
```

### 3. Launch Development Environment
```bash
# Run both Backend (Port 5000) and Frontend (Port 5173) simultaneously:
npm run dev
```

Visit **`http://localhost:5173`** in your browser!

---

## 📚 Project Documentation

Explore in-depth design documents located in the [`docs/`](./docs/) directory:

- [Project Overview & Objectives](docs/PROJECT_OVERVIEW.md)
- [Comprehensive Features Specification](docs/FEATURES.md)
- [System Architecture & Data Flow](docs/ARCHITECTURE.md)
- [REST API Reference & Endpoints](docs/API_DOCUMENTATION.md)
- [Database Schema & ER Models](docs/DATABASE_SCHEMA.md)
- [Setup & Deployment Guide](docs/SETUP.md)
- [Contributing Guidelines](docs/CONTRIBUTING.md)

---

## 🎓 Academic Presentation Highlights

- **Zero-Stub Policy:** Every button, tab, search query, filter, and modal triggers operational state changes and API transactions.
- **Explainable Machine Logic:** Transparent calculation weights rather than opaque "black-box" scores.
- **Resilient Fallbacks:** Operates seamlessly offline/locally without requiring paid third-party API keys (OpenAI, Google Maps, or MongoDB Atlas).
- **Indian Regional Relevance:** Pre-loaded with realistic shelters, veterinary clinics, and rescue cases from Maharashtra (Nanded, Pune, Mumbai, Nagpur, Chhatrapati Sambhajinagar).

---

## 📄 License
This project is developed for educational and animal welfare demonstration purposes under the MIT License.
