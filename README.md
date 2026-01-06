# 🕌 Dualy - Backend + Admin

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-Proprietary-red.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![Docker](https://img.shields.io/badge/docker-required-blue.svg)

[Features](#-features) •
[Quick Start](#-quick-start) •
[API Documentation](#-api-documentation) •
[Troubleshooting](#-troubleshooting)

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Development](#-development)
- [API Documentation](#-api-documentation)
- [Troubleshooting](#-troubleshooting)
- [FAQ](#-faq)
- [Support](#-support)

---

## 🌟 Overview

- **Multi-language Duas**: Arabic text with transliteration and translations (English, Arabic, Urdu)
- **Dhikr Challenges**: Individual and collaborative spiritual challenges
- **Progress Tracking**: Streaks, points, levels, and achievement system
- **Admin Panel**: Complete content management system
- **RESTful API**: Well-documented, production-ready backend

Built with ❤️ using **Claude AI**.

---

## ✨ Features

### 🎯 Core Features

- ✅ **Duas Library**
  - Multi-language support (English, Arabic, Urdu)
  - Arabic text with transliteration
  - Audio recitation support
  - Category organization
  - Favorites system
  - Reading progress tracking
  - Reference to Quran/Hadith

- ✅ **Dhikr Challenges**
  - Individual challenges (personal goals)
  - Collaborative challenges (community-wide)
  - Three difficulty levels (Easy, Medium, Hard)
  - Progress tracking with real-time updates
  - Point and reward system
  - Time-bound and recurring challenges
  - Badge/achievement system

- ✅ **User Management**
  - Email/password authentication
  - JWT tokens (access + refresh)
  - Email verification
  - Password reset flow
  - Multi-device session management
  - Profile customization
  - Timezone support

- ✅ **Analytics & Tracking**
  - Daily activity tracking
  - Streak calculation (current & longest)
  - Points and leveling system
  - Challenge completion history
  - User statistics dashboard

- ✅ **Admin Panel**
  - Role-based access control
  - CRUD for duas and challenges
  - Multi-language content creation
  - Category management
  - User management
  - Audit logging

### 🌍 Multi-Language Support

- **English** (LTR)
- **Arabic** (RTL) - العربية
- **Urdu** (RTL) - اردو

---

## 🛠 Tech Stack

### Backend
- **Framework**: NestJS 10.x (TypeScript)
- **Database**: PostgreSQL 16
- **ORM**: TypeORM 0.3.x
- **Authentication**: JWT (Passport.js)
- **Validation**: class-validator, class-transformer
- **Documentation**: Swagger/OpenAPI
- **Security**: bcryptjs, CORS, JWT

### Frontend (Admin Panel)
- **Framework**: React 18.x
- **Build Tool**: Vite 4.x
- **Routing**: React Router DOM 6.x
- **Styling**: Tailwind CSS 3.x
- **HTTP Client**: Axios
- **Forms**: React Hook Form 7.x
- **UI**: Headless UI, Lucide Icons

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Web Server**: Nginx (for admin panel)
- **Database**: PostgreSQL 16 Alpine

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

### Required Software

1. **Docker Desktop** (v20.10+)
   - Download: https://www.docker.com/products/docker-desktop
   - Includes Docker Compose v2

2. **Git** (for cloning the repository)
   - Download: https://git-scm.com/downloads

### Optional (for local development without Docker)

3. **Node.js** (v18.0.0 or higher)
   - Download: https://nodejs.org/

4. **PostgreSQL** (v16+)
   - Download: https://www.postgresql.org/download/

5. **npm** or **yarn** (comes with Node.js)

### System Requirements

- **OS**: Windows 10/11, macOS 10.15+, or Linux
- **RAM**: Minimum 4GB (8GB recommended)
- **Disk Space**: 2GB free space
- **Ports**: 3000, 5432, 80 (or 5173 for dev)

---

## 🚀 Quick Start

### Using Setup Script

```bash
# 1. Clone the repository
git clone <repository-url>
cd dualy-be

# 2. Copy environment file
cp .env.example .env

# 3. (Optional) Edit .env file with your settings
nano .env

# 4. Make setup script executable
chmod +x setup-docker.sh

# 5. Run the setup script
./setup-docker.sh

# Choose option 1: Build and start all services - Release Builds
# Wait for the setup to complete (5-10 minutes first time)
# Choose option 7: Start DEVELOPMENT mode (hot reload) - Debug Builds

# View logs
docker compose logs -f                    # All services
docker compose logs -f backend            # Backend only
docker compose logs -f admin              # Admin only
docker compose logs -f postgres           # Database only
```

### 🎉 Success!

After successful setup, access:

- **Admin Panel**: (release) http://localhost - (development) http://localhost:5173
- **Backend API**: http://localhost:3000
- **API Documentation Swagger**: http://localhost:3000/api/docs

### 🔑 Default Admin Credentials

```
Email:    admin@dualy.com
Password: Admin@123
```

---

## 📁 Project Structure

```
dualy-be/
├── backend/                    # NestJS Backend API
│   ├── src/
│   │   ├── base/              # Base classes (Entity, Service, Controller)
│   │   ├── common/            # Guards, Decorators, Filters, Interceptors
│   │   ├── config/            # Configuration files
│   │   ├── database/          # Migrations & Seeds
│   │   │   ├── migrations/   # TypeORM migrations
│   │   │   └── seeds/        # Database seed files
│   │   ├── modules/           # Feature modules
│   │   │   ├── admin/        # Admin authentication & management
│   │   │   ├── auth/         # User authentication
│   │   │   ├── challenges/   # Dhikr challenges
│   │   │   ├── duas/         # Duas management
│   │   │   ├── languages/    # Multi-language support
│   │   │   └── users/        # User management
│   │   ├── app.module.ts     # Root module
│   │   └── main.ts           # Application entry point
│   ├── Dockerfile             # Production build
│   ├── Dockerfile.dev         # Development build
│   ├── package.json
│   ├── tsconfig.json
│   ├── .dockerignore
│   ├── .gitignore
│   ├── nest-cli.json
│   ├── API_DOCUMENTATION.md  # comprehensive and well-structured
│   └── README.md             # Backend-specific documentation

│
├── admin/                      # React Admin Panel
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── assets/
│   │   ├── pages/            # Page components
│   │   ├── services/         # API services
│   │   ├── utils/            # Utility functions
│   │   ├── App.jsx           # Root component
│   │   ├── App.css           
│   │   ├── index.css         
│   │   └── main.jsx          # Entry point
│   ├── public/               # Static assets
│   ├── Dockerfile            # Production build
│   ├── Dockerfile.dev        # Development build
│   ├── nginx.conf            # Nginx configuration
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── .dockerignore
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── postcss.config.js
│   └── README.md             # Admin-specific documentation
│
├── docker-compose.yml          # Production orchestration
├── docker-compose.dev.yml      # Development orchestration
├── setup-docker.sh             # Interactive setup script
├── .env.example                # Environment variables template
├── .env                        # Your environment (create from .env.example)
├── .gitignore
└── README.md                   # This file
```

---

## 💻 Development

### Starting Development Environment

#### Option 1: Docker Development Mode (Hot Reload)

```bash
# Start with hot reload (recommended)
./setup-docker.sh
# Choose option 7: Start DEVELOPMENT mode

# Or directly:
docker compose -f docker-compose.dev.yml up --build
```

#### Option 2: Local Development (Without Docker)

**Terminal 1 - Backend:**
```bash
cd backend
npm install
npm run start:dev
```

**Terminal 2 - Admin:**
```bash
cd admin
npm install
npm run dev
```

**Terminal 3 - Database:**
```bash
# Start PostgreSQL (ensure it's running)
# Update backend/.env with localhost DB connection
```

### Useful Development Commands

#### Docker Commands

```bash
# View logs
docker compose logs -f                    # All services
docker compose logs -f backend            # Backend only
docker compose logs -f admin              # Admin only

# Restart services
docker compose restart                    # All services
docker compose restart backend            # Backend only

# Stop services
docker compose down                       # Stop all
docker compose down -v                    # Stop and remove volumes (⚠️ deletes data)

# Rebuild specific service
docker compose up -d --build backend      # Rebuild backend
docker compose up -d --build admin        # Rebuild admin

# Access container shell
docker compose exec backend sh            # Backend shell
docker compose exec postgres psql -U postgres -d dualy  # Database shell

# Check service status
docker compose ps
```

#### Backend Development Commands

```bash
cd backend

# Development
npm run start:dev         # Start with hot reload
npm run start:debug       # Start with debug mode

# Database
npm run migration:run     # Run migrations
npm run migration:revert  # Revert last migration
npm run migration:create --name=MigrationName  # Create migration
npm run seed              # Run seed files

# Code Quality
npm run lint              # Run ESLint
npm run format            # Format with Prettier
npm run build             # Build for production

# Testing
npm run test              # Run tests
npm run test:watch        # Run tests in watch mode
npm run test:cov          # Run tests with coverage
```

#### Admin Development Commands

```bash
cd admin

# Development
npm run dev               # Start Vite dev server (port 5173)
npm run build             # Build for production
npm run preview           # Preview production build

# Linting
npm run lint              # Run ESLint
```

#### Database Backup Commands

```bash
# Backup database
docker compose exec postgres pg_dump -U postgres dualy > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore database
docker compose exec -T postgres psql -U postgres dualy < backup_file.sql
```

---

## 🌐 API Documentation

Full API documentation is available at:

- **Swagger UI**: http://localhost:3000/api/docs
- **Documentation File**: `backend/API_DOCUMENTATION.md`

### Quick API Examples (API_DOCUMENTATION.md)

```bash
# Register a new user
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!",
    "full_name": "John Doe"
  }'

# Login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!"
  }'

# Get duas (requires auth token)
curl -X GET http://localhost:3000/api/v1/duas \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 🔧 Troubleshooting

### Common Issues and Solutions

#### Issue 1: Port Already in Use

**Error:** `Port 3000 is already allocated` or `Port 80 is already in use`

**Solution:**
```bash
# Check what's using the port
sudo lsof -i :3000    # For backend
sudo lsof -i :80      # For admin

# Option 1: Kill the process
kill -9 <PID>

# Option 2: Change port in .env
APP_PORT=3001
ADMIN_PORT=8080
```

#### Issue 2: Docker Build Fails

**Error:** `npm install` fails or build errors

**Solution:**
```bash
# Clear Docker cache
docker compose down
docker system prune -a

# Rebuild from scratch
docker compose build --no-cache
docker compose up -d
```

#### Issue 3: Database Connection Failed

**Error:** `ECONNREFUSED` or `Connection refused`

**Solution:**
```bash
# Check if PostgreSQL is running
docker compose ps

# Check database logs
docker compose logs postgres

# Restart database
docker compose restart postgres

# Wait for database to be ready
docker compose exec postgres pg_isready -U postgres
```

#### Issue 4: Migrations Not Running

**Error:** `Migration failed` or `Table already exists`

**Solution:**
```bash
# Check migration status
docker compose exec backend npm run typeorm migration:show

# Revert last migration
docker compose exec backend npm run migration:revert

# Run migrations again
docker compose exec backend npm run migration:run

# If all else fails, reset database (⚠️ deletes all data)
docker compose down -v
docker compose up -d --build
```

#### Issue 5: Admin Panel Shows White Screen

**Error:** Blank page or errors in browser console

**Solution:**
```bash
# Check admin logs
docker compose logs admin

# Verify environment variables
docker compose exec admin env | grep VITE

# Rebuild admin
docker compose up -d --build admin

# Clear browser cache
# Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
```

#### Issue 6: Cannot Login to Admin Panel

**Error:** Invalid credentials or 401 error

**Solution:**
```bash
# Check if seeds ran successfully
docker compose logs backend | grep -i "seed"

# Re-run seeds
docker compose exec backend npm run seed

# Verify admin user in database
docker compose exec postgres psql -U postgres -d dualy \
  -c "SELECT email, role FROM admin_users;"

# Check default credentials
Email: admin@dualy.com
Password: Admin@123
```

#### Issue 7: CORS Errors

**Error:** `CORS policy: No 'Access-Control-Allow-Origin'`

**Solution:**
1. Check `VITE_API_URL` in .env matches your backend URL
2. Verify backend CORS configuration in `backend/src/main.ts`
3. For production, update allowed origins

#### Issue 8: Permission Denied

**Error:** `Permission denied` when running scripts

**Solution:**
```bash
# Make script executable
chmod +x setup-docker.sh

# Run with sudo if needed
sudo ./setup-docker.sh
```

### Getting Detailed Logs

```bash
# View all logs
docker compose logs -f

# View specific service logs
docker compose logs -f backend
docker compose logs -f admin
docker compose logs -f postgres

# View last 100 lines
docker compose logs --tail=100 backend

# Export logs to file
docker compose logs > logs_$(date +%Y%m%d_%H%M%S).txt
```

### Health Checks

```bash
# Check if backend is responding
curl http://localhost:3000/api/v1/health

# Check if admin panel is accessible
curl http://localhost

# Check database connection
docker compose exec backend npm run typeorm -- query "SELECT NOW();"

# Check all services status
docker compose ps
```

---

## ❓ FAQ

### General Questions

**Q: Can I run this without Docker?**
A: Yes, see the [Local Development](#option-2-local-development-without-docker) section. You'll need Node.js and PostgreSQL installed.

**Q: What ports does the application use?**
A: 
- Backend API: 3000
- Admin Panel: 80 (production) or 5173 (development)
- PostgreSQL: 5432

**Q: How do I change the admin password?**
A: Edit the `ADMIN_PASSWORD` in `.env` file before first run, or update it in the database after setup.

### Development Questions

**Q: How do I add a new language?**
A: Add it to the languages seed file in `backend/src/database/seeds/1-languages.seed.ts` and run migrations.

**Q: How do I reset the database?**
A: Run `docker compose down -v` (⚠️ This deletes all data)

**Q: Where are database backups stored?**
A: Use the backup commands in Development section. Store backups outside the container.

**Q: How do I view the database?**
A: Connect using any PostgreSQL client:
```
Host: localhost
Port: 5432
Database: dualy
Username: postgres
Password: (from .env)
```

### API Questions

**Q: Where is the API documentation?**
A: Access Swagger UI at http://localhost:3000/api/docs or read `backend/API_DOCUMENTATION.md`

**Q: How do I get an API token?**
A: Register a user, then login. You'll receive an access_token in the response.

**Q: How long do tokens last?**
A: Access tokens: 8 hours, Refresh tokens: 7 days (configurable in .env)

---

## 📞 Support

### Getting Help

- **Documentation**: Check the detailed docs in each module's README
- **API Docs**: http://localhost:3000/api/docs & backend/API_DOCUMENTATION.md

### Useful Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [React Documentation](https://react.dev/)
- [TypeORM Documentation](https://typeorm.io/)
- [Docker Documentation](https://docs.docker.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

<div align="center">

[🏠 Home](#-dualy---islamic-companion-app) •
[📖 API Documentation](#-api-documentation) •
[🚀 Quick Start](#-quick-start)

</div>