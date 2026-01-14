# Iskolar-Hub

🎓 **Scholarship Matching Engine for the 2026 Philippine Academic Cycle**

A comprehensive platform that matches Filipino students with scholarship opportunities based on their academic profile, financial status, and location.

## 🏗️ Monorepo Structure

This project uses **NPM Workspaces** to manage a monorepo with three packages:

```
4-iskolarhub/
├── frontend/          # Next.js 16 (React 19) - UI Application
├── backend/           # Node.js/Express - API Server
├── shared/            # @iskolarhub/shared - Types & Constants
├── package.json       # Root workspace configuration
└── tsconfig.base.json # Shared TypeScript config
```

## 📦 Workspaces

| Package | Name | Description |
|---------|------|-------------|
| frontend | `@iskolarhub/frontend` | Next.js application with Tailwind CSS |
| backend | `@iskolarhub/backend` | Express API with PostgreSQL |
| shared | `@iskolarhub/shared` | Shared TypeScript types and constants |

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- PostgreSQL 15+
- npm >= 7.0.0 (for workspaces support)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd 4-iskolarhub

# Install all dependencies (root + all workspaces)
npm install

# Setup the database
psql -U postgres -c "CREATE DATABASE iskolarhub;"
psql -U postgres -d iskolarhub -f backend/src/database/schema.sql
psql -U postgres -d iskolarhub -f backend/src/database/seed.sql
```

### Development

```bash
# Run both frontend and backend concurrently
npm run dev

# Run frontend only (port 3000)
npm run dev:frontend

# Run backend only (port 3001)
npm run dev:backend
```

### Building

```bash
# Build shared package and frontend
npm run build

# Build frontend only
npm run build:frontend
```

### Type Checking

```bash
# Run TypeScript checks on all workspaces
npm run typecheck
```

## 🔗 Shared Package Usage

The `@iskolarhub/shared` package exports types and constants that are used by both frontend and backend:

### Importing Types

```typescript
// In frontend or backend
import { Scholarship, StudentProfile, QuickScanProfile } from '@iskolarhub/shared';
import { DEGREE_PROGRAMS, STRAND_INFO, LGU_PROVIDERS } from '@iskolarhub/shared';
```

### Available Exports

**Types:**
- `Scholarship`, `ScholarshipEligibility`, `ScholarshipBenefits`
- `StudentProfile`, `QuickScanProfile`
- `DocumentType`, `DocumentStatus`, `StudentDocument`
- `ScholarshipMatch`, `ScoringBreakdown`, `MatchResponse`
- `ValidationResult`, `ValidationError`
- And more...

**Constants:**
- `DEGREE_PROGRAMS` - 100+ standardized Philippine degree programs
- `STRAND_INFO` - SHS strand details
- `LGU_PROVIDERS` - Cities with LGU scholarship programs
- `CITY_COORDINATES` - Coordinates for reverse geocoding
- `VALIDATION_RULES` - Input validation constraints
- `SCORING_WEIGHTS` - Matching algorithm weights

## 🗃️ Database

The backend uses PostgreSQL with the following main tables:

- `scholarships` - Scholarship data with JSONB eligibility
- `students` - Student profiles
- `student_documents` - Document vault (Big 4)
- `regions`, `provinces`, `cities_municipalities` - Philippine geography

## 📡 API Endpoints

| Endpoint | Description |
|----------|-------------|
| `POST /api/match` | Full scholarship matching |
| `POST /api/match/quick` | 1-Minute Scan matching |
| `GET /api/deadlines` | Scholarship deadlines |
| `POST /api/vault/status` | Document status update |
| `POST /api/location/detect` | Reverse geocoding |
| `POST /api/validate/quick-scan` | Input validation |

See `backend/API_DOCUMENTATION.md` for full API documentation.

## 🛠️ Tech Stack

**Frontend:**
- Next.js 16
- React 19
- Tailwind CSS 4
- Framer Motion
- Lucide Icons

**Backend:**
- Node.js
- Express.js
- PostgreSQL
- CORS

**Shared:**
- TypeScript
- Type definitions
- Constants

## 📄 License

MIT
