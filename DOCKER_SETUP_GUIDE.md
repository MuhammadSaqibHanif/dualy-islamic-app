# 🐳 DUALY - COMPLETE DOCKER SETUP GUIDE

**Run Everything with ONE Command!** 🚀

---

## 📋 TABLE OF CONTENTS

1. [Prerequisites](#prerequisites)
2. [Quick Start (TL;DR)](#quick-start-tldr)
3. [Project Structure](#project-structure)
4. [Detailed Setup](#detailed-setup)
5. [Usage Commands](#usage-commands)
6. [Accessing Services](#accessing-services)
7. [Development vs Production](#development-vs-production)
8. [Troubleshooting](#troubleshooting)
9. [Environment Variables](#environment-variables)
10. [Advanced Configuration](#advanced-configuration)

---

## ✅ PREREQUISITES

Make sure you have installed:

- **Docker Desktop** (Windows/Mac) or **Docker Engine** (Linux)
  - Download: https://www.docker.com/get-started
  - Minimum version: Docker 20.10+, Docker Compose 2.0+

**Verify installation:**
```bash
docker --version
# Should show: Docker version 20.10.x or higher

docker compose version
# Should show: Docker Compose version 2.x.x or higher
```

---

## 🚀 QUICK START (TL;DR)

**From scratch to running app in 3 steps:**

```bash
# 1. Create project structure
mkdir dualy-be
cd dualy-be

# 2. Copy all files (backend, admin, docker-compose.yml, .env.docker)
# (Files structure shown below)

# 3. Start everything with ONE command
docker compose up -d
```

**That's it!** 🎉

- ✅ Database running on `localhost:5432`
- ✅ Backend API running on `http://localhost:3000`
- ✅ Admin Panel running on `http://localhost:80`

---

## 📁 PROJECT STRUCTURE

Your final project structure should look like this:

```
dualy-be/
├── backend/              # Backend NestJS code
│   ├── src/
│   ├── package.json
│   ├── tsconfig.json
│   ├── Dockerfile              ⭐ NEW
│   ├── .dockerignore           ⭐ NEW
│   └── .env                    (keep your existing one)
│
├── admin/                # Admin React code
│   ├── src/
│   │   └── services/
│   │       └── api.js          ⭐ UPDATE (use api.docker.js)
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   ├── Dockerfile              ⭐ NEW
│   ├── nginx.conf              ⭐ NEW
│   └── .dockerignore           ⭐ NEW
│
├── docker-compose.yml          ⭐ NEW (orchestrates everything)
└── .env.docker                 ⭐ NEW (environment config)
```

---

## 🔧 DETAILED SETUP

### **Step 1: Prepare Backend**

```bash
cd backend

# Copy these files (I've created them for you):
# - Dockerfile
# - .dockerignore

# Your backend is ready! ✅
```

### **Step 2: Prepare Admin Panel**

```bash
cd admin

# Copy these files (I've created them for you):
# - Dockerfile
# - nginx.conf
# - .dockerignore

# Update api.js with environment variable support:
cp ../api.docker.js src/services/api.js

# Your admin is ready! ✅
```

### **Step 3: Set Up Root Directory**

```bash
# Go back to parent directory
cd ..

# Copy these files:
# - docker-compose.yml
# - .env.docker (rename to .env)

# Rename .env.docker to .env
cp .env.docker .env

# Edit .env and change these for production:
# - JWT_SECRET (make it long and random)
# - JWT_REFRESH_SECRET (make it long and random)
# - DB_PASSWORD (make it secure)
# - ADMIN_PASSWORD (change from default)
```

### **Step 4: Build and Start**

```bash
# Build all services (first time only)
docker compose build

# Start all services
docker compose up -d

# Watch logs
docker compose logs -f
```

---

## 📝 USAGE COMMANDS

### **Starting Services**

```bash
# Start all services in background
docker compose up -d

# Start with logs visible
docker compose up

# Start specific service only
docker compose up -d backend
docker compose up -d admin
```

### **Stopping Services**

```bash
# Stop all services (keeps data)
docker compose stop

# Stop and remove containers (keeps data in volumes)
docker compose down

# Stop and remove EVERYTHING including volumes (⚠️ DELETES DATABASE!)
docker compose down -v
```

### **Viewing Logs**

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f backend
docker compose logs -f admin
docker compose logs -f postgres

# Last 100 lines
docker compose logs --tail=100 backend
```

### **Rebuilding**

```bash
# Rebuild after code changes
docker compose build

# Rebuild specific service
docker compose build backend
docker compose build admin

# Rebuild and restart
docker compose up -d --build
```

### **Database Commands**

```bash
# Run migrations manually
docker compose exec backend npm run migration:run

# Run seeds manually
docker compose exec backend npm run seed

# Access PostgreSQL CLI
docker compose exec postgres psql -U postgres -d dualy

# Backup database
docker compose exec postgres pg_dump -U postgres dualy > backup.sql

# Restore database
docker compose exec -T postgres psql -U postgres dualy < backup.sql
```

### **Troubleshooting Commands**

```bash
# Check service status
docker compose ps

# Check service health
docker compose ps -a

# Restart specific service
docker compose restart backend

# Enter backend container shell
docker compose exec backend sh

# Enter admin container shell
docker compose exec admin sh

# View backend environment variables
docker compose exec backend env
```

---

## 🌐 ACCESSING SERVICES

After running `docker compose up -d`:

| Service | URL | Credentials |
|---------|-----|-------------|
| **Admin Panel** | http://localhost:80 | admin@dualy.com / Admin@123 |
| **Backend API** | http://localhost:3000 | - |
| **API Docs (Swagger)** | http://localhost:3000/api/v1 | - |
| **Database** | localhost:5432 | postgres / postgres / dualy |

**Test URLs:**
- Admin: http://localhost
- API Health: http://localhost:3000/api/v1/health
- API Languages: http://localhost:3000/api/v1/languages

---

## 🔄 DEVELOPMENT VS PRODUCTION

### **Development Mode (Current Setup)**

Optimized for: Learning, Testing, Development

**Features:**
- ✅ Source code is built into containers
- ✅ Database data persists in Docker volumes
- ✅ Logs visible via `docker compose logs`
- ✅ Can rebuild after code changes
- ✅ Runs on localhost

**Start:**
```bash
docker compose up -d
```

### **Production Mode (Future Deployment)**

For production deployment, you'll need:

1. **Change environment variables in .env:**
   ```bash
   NODE_ENV=production
   JWT_SECRET=<long-random-string-64-chars>
   JWT_REFRESH_SECRET=<another-long-random-string>
   DB_PASSWORD=<secure-password>
   ADMIN_PASSWORD=<secure-password>
   APP_URL=https://api.yourdomain.com
   VITE_API_URL=https://api.yourdomain.com/api/v1
   ```

2. **Use domain names instead of localhost**

3. **Add SSL/TLS certificates (use Nginx reverse proxy or Traefik)**

4. **Use managed database service** (AWS RDS, Digital Ocean, etc.)

5. **Set up monitoring** (Prometheus, Grafana)

6. **Set up backups** (automated database backups)

---

## 🐛 TROUBLESHOOTING

### **Issue 1: Port Already in Use**

**Error:** 
```
Error: bind: address already in use
```

**Solution:**
```bash
# Check what's using the port
lsof -i :3000  # Backend
lsof -i :80    # Admin
lsof -i :5432  # PostgreSQL

# Change ports in .env file:
APP_PORT=3001
ADMIN_PORT=8080
DB_PORT=5433

# Or stop the conflicting service
```

---

### **Issue 2: Database Connection Failed**

**Error:**
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solution:**
```bash
# Check if postgres is healthy
docker compose ps

# If not healthy, check logs
docker compose logs postgres

# Wait for postgres to be ready
docker compose up -d postgres
sleep 10
docker compose up -d backend
```

---

### **Issue 3: Backend Won't Start**

**Error:**
```
Error: Cannot find module 'dist/main'
```

**Solution:**
```bash
# Rebuild backend
docker compose build backend

# Check build logs
docker compose logs backend

# Force rebuild
docker compose up -d --build backend
```

---

### **Issue 4: Admin Panel Shows Blank Page**

**Solution:**
```bash
# Check admin logs
docker compose logs admin

# Rebuild admin
docker compose build admin

# Check if API URL is correct
docker compose exec admin cat /usr/share/nginx/html/index.html
# Should contain the correct API URL
```

---

### **Issue 5: Migrations Not Running**

**Solution:**
```bash
# Run migrations manually
docker compose exec backend npm run migration:run

# If that fails, check database connection
docker compose exec backend npm run typeorm migration:show

# Check logs
docker compose logs backend
```

---

### **Issue 6: Changes Not Reflecting**

**Solution:**
```bash
# After changing code, rebuild:
docker compose up -d --build

# Or rebuild specific service:
docker compose build backend
docker compose up -d backend
```

---

## 🔐 ENVIRONMENT VARIABLES

### **Database Variables**

```bash
DB_USERNAME=postgres          # Database user
DB_PASSWORD=postgres          # Database password (CHANGE IN PRODUCTION!)
DB_DATABASE=dualy            # Database name
DB_PORT=5432                 # Database port
```

### **JWT Variables**

```bash
JWT_SECRET=<your-secret>             # Min 32 chars, CHANGE IN PRODUCTION!
JWT_EXPIRES_IN=8h                    # Access token lifetime
JWT_REFRESH_SECRET=<your-secret>     # Min 32 chars, CHANGE IN PRODUCTION!
JWT_REFRESH_EXPIRES_IN=7d            # Refresh token lifetime
```

### **Admin Variables**

```bash
ADMIN_EMAIL=admin@dualy.com          # Default admin email
ADMIN_PASSWORD=Admin@123             # Default admin password (CHANGE!)
ADMIN_PORT=80                        # Port for admin panel
```

### **API Variables**

```bash
APP_PORT=3000                        # Backend API port
APP_URL=http://localhost:3000        # Backend URL
VITE_API_URL=http://localhost:3000/api/v1  # API URL for admin panel
```

---

## ⚙️ ADVANCED CONFIGURATION

### **Scaling Services**

```bash
# Run multiple backend instances
docker compose up -d --scale backend=3

# Add load balancer (use nginx or traefik)
```

### **Custom Network**

Edit `docker-compose.yml`:
```yaml
networks:
  dualy-network:
    driver: bridge
    ipam:
      config:
        - subnet: 172.25.0.0/16
```

### **Resource Limits**

Edit `docker-compose.yml`:
```yaml
backend:
  deploy:
    resources:
      limits:
        cpus: '1.0'
        memory: 512M
      reservations:
        cpus: '0.5'
        memory: 256M
```

### **Health Checks**

Already configured! But you can customize:
```yaml
backend:
  healthcheck:
    test: ["CMD", "node", "-e", "..."]
    interval: 30s
    timeout: 10s
    retries: 3
    start_period: 40s
```

---

## 🎯 TESTING CHECKLIST

After `docker compose up -d`, verify:

- [ ] All containers running: `docker compose ps`
- [ ] Postgres healthy: `docker compose ps postgres`
- [ ] Backend healthy: `curl http://localhost:3000/api/v1/health`
- [ ] Admin accessible: Open http://localhost
- [ ] Can login to admin panel
- [ ] Can create/edit/delete duas
- [ ] Can create/edit/delete challenges
- [ ] Database persists after restart

---

## 📊 MONITORING

### **View Resource Usage**

```bash
# Real-time stats
docker stats

# Specific container
docker stats backend
```

### **View Disk Usage**

```bash
# Docker disk usage
docker system df

# Volume sizes
docker volume ls
docker volume inspect dualy-postgres-data
```

---

## 🔄 BACKUP & RESTORE

### **Database Backup**

```bash
# Create backup
docker compose exec postgres pg_dump -U postgres dualy > backup-$(date +%Y%m%d).sql

# Compressed backup
docker compose exec postgres pg_dump -U postgres dualy | gzip > backup-$(date +%Y%m%d).sql.gz
```

### **Database Restore**

```bash
# Restore from backup
docker compose exec -T postgres psql -U postgres dualy < backup-20260103.sql

# From compressed backup
gunzip -c backup-20260103.sql.gz | docker compose exec -T postgres psql -U postgres dualy
```

### **Full System Backup**

```bash
# Stop services
docker compose down

# Backup volumes
docker run --rm -v dualy-postgres-data:/data -v $(pwd):/backup alpine tar czf /backup/postgres-data.tar.gz /data

# Restart services
docker compose up -d
```

---

## 🎓 BEST PRACTICES

### **DO:**

✅ **Change default passwords before production**
✅ **Use environment variables for configuration**
✅ **Regularly backup database**
✅ **Monitor logs for errors**
✅ **Keep Docker images updated**
✅ **Use specific image tags (not `latest`)**
✅ **Run health checks**
✅ **Use Docker secrets for sensitive data in production**

### **DON'T:**

❌ **Commit .env file to git**
❌ **Use default passwords in production**
❌ **Run as root in containers**
❌ **Store data in containers (use volumes)**
❌ **Expose database port in production**
❌ **Skip migrations**
❌ **Delete volumes without backup**

---

## 🆘 GETTING HELP

### **Check Logs**
```bash
docker compose logs -f
```

### **Check Service Status**
```bash
docker compose ps -a
```

### **Test Connectivity**
```bash
# Test backend from admin container
docker compose exec admin wget -O- http://backend:3000/api/v1/health

# Test database from backend container
docker compose exec backend pg_isready -h postgres -U postgres
```

### **Clean Restart**
```bash
# Complete reset (⚠️ DELETES ALL DATA!)
docker compose down -v
docker compose up -d --build
```

---

## 📚 USEFUL DOCKER COMMANDS

```bash
# Remove all stopped containers
docker container prune

# Remove unused images
docker image prune -a

# Remove unused volumes
docker volume prune

# Remove everything (⚠️ CAREFUL!)
docker system prune -a --volumes

# View container logs
docker logs backend

# Execute command in container
docker exec -it backend sh

# Copy files from container
docker cp backend:/app/dist ./dist

# Copy files to container
docker cp ./local-file backend:/app/
```

---

## 🎉 SUCCESS!

If everything is running:

1. ✅ Open http://localhost
2. ✅ Login with `admin@dualy.com` / `Admin@123`
3. ✅ Create some duas and challenges
4. ✅ Test all CRUD operations

**Your Dualy Islamic App is now running in Docker!** 🚀

---

## 📞 QUICK REFERENCE

| Command | Purpose |
|---------|---------|
| `docker compose up -d` | Start all services |
| `docker compose down` | Stop all services |
| `docker compose logs -f` | View logs |
| `docker compose ps` | Check status |
| `docker compose build` | Rebuild images |
| `docker compose restart` | Restart services |
| `docker compose exec backend sh` | Enter backend shell |

---

**Generated:** January 3, 2026  
**Docker Compose Version:** 3.8  
**Services:** PostgreSQL 16 + NestJS + React  

**🎯 One command to rule them all:** `docker compose up -d`
