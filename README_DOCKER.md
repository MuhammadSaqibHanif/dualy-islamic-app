# 🐳 Dualy Docker Setup - Quick Reference

**Run Everything with ONE Command!** 🚀

---

## ⚡ QUICK START

```bash
# 1. Make sure Docker is installed
docker --version
docker compose version

# 2. Copy all files to your project

# 3. Run ONE command to start everything
docker compose up -d
```

**That's it!** 🎉

- ✅ PostgreSQL Database
- ✅ NestJS Backend API  
- ✅ React Admin Panel

All running in Docker! 🚀

---

## 📦 FILES YOU NEED

### **Root Directory:**
```
dualy-be/
├── backend/          (your existing backend code)
├── admin/            (your existing admin code)
├── docker-compose.yml      ⭐ NEW
└── .env                    ⭐ NEW (copy from .env.docker)
```

### **Backend Files (backend/):**
```
backend/
├── Dockerfile              ⭐ NEW
├── .dockerignore           ⭐ NEW
└── (rest of your code)
```

### **Admin Files (admin/):**
```
admin/
├── Dockerfile              ⭐ NEW
├── nginx.conf              ⭐ NEW
├── .dockerignore           ⭐ NEW
├── src/services/
│   └── api.js              ⭐ UPDATE (use api.docker.js)
└── (rest of your code)
```

---

## 🚀 USAGE

### **Start Everything:**
```bash
docker compose up -d
```

### **Stop Everything:**
```bash
docker compose down
```

### **View Logs:**
```bash
docker compose logs -f
```

### **Restart After Code Changes:**
```bash
docker compose up -d --build
```

---

## 🌐 ACCESS

After starting:

| Service | URL | Login |
|---------|-----|-------|
| Admin Panel | http://localhost | admin@dualy.com / Admin@123 |
| Backend API | http://localhost:3000 | - |
| Database | localhost:5432 | postgres / postgres / dualy |

---

## 📋 USEFUL COMMANDS

```bash
# Check status
docker compose ps

# View logs
docker compose logs -f backend
docker compose logs -f admin
docker compose logs -f postgres

# Restart service
docker compose restart backend

# Rebuild service
docker compose build backend

# Run migrations manually
docker compose exec backend npm run migration:run

# Run seeds manually
docker compose exec backend npm run seed

# Access database
docker compose exec postgres psql -U postgres -d dualy

# Backup database
docker compose exec postgres pg_dump -U postgres dualy > backup.sql

# Stop and remove everything (⚠️ deletes data)
docker compose down -v
```

---

## 🔧 SETUP SCRIPTS

### **For Mac/Linux:**
```bash
chmod +x setup-docker.sh
./setup-docker.sh
```

### **For Windows:**
```powershell
.\setup-docker.ps1
```

Interactive menu to:
1. Build and start
2. Build only
3. Start
4. Stop
5. View logs
6. Reset everything

---

## 📁 FILE DESCRIPTIONS

| File | Purpose |
|------|---------|
| `docker-compose.yml` | Orchestrates all 3 services (DB, Backend, Admin) |
| `.env` | Environment variables (database passwords, JWT secrets, etc.) |
| `backend/Dockerfile` | Builds backend Docker image |
| `admin/Dockerfile` | Builds admin panel Docker image |
| `admin/nginx.conf` | Nginx configuration for serving React app |
| `.dockerignore` | Files to exclude from Docker build |
| `api.docker.js` | Updated API service with environment variable support |
| `setup-docker.sh` | Interactive setup script (Mac/Linux) |
| `setup-docker.ps1` | Interactive setup script (Windows) |
| `DOCKER_SETUP_GUIDE.md` | Complete 500+ line documentation |

---

## ⚙️ CUSTOMIZATION

### **Change Ports:**

Edit `.env` file:
```bash
APP_PORT=3001       # Backend port
ADMIN_PORT=8080     # Admin port
DB_PORT=5433        # Database port
```

### **Change Passwords:**

Edit `.env` file (⚠️ **IMPORTANT for production!**):
```bash
DB_PASSWORD=your-secure-password
JWT_SECRET=your-long-random-secret-min-64-chars
JWT_REFRESH_SECRET=another-long-random-secret
ADMIN_PASSWORD=YourSecurePassword123!
```

### **Change API URL for Production:**

Edit `.env` file:
```bash
APP_URL=https://api.yourdomain.com
VITE_API_URL=https://api.yourdomain.com/api/v1
```

---

## 🐛 TROUBLESHOOTING

### **Port Already in Use:**
```bash
# Change port in .env
APP_PORT=3001
```

### **Database Connection Failed:**
```bash
# Wait for postgres to be ready
docker compose up -d postgres
sleep 10
docker compose up -d backend
```

### **Changes Not Showing:**
```bash
# Rebuild
docker compose up -d --build
```

### **Complete Reset:**
```bash
# ⚠️ Deletes all data!
docker compose down -v
docker compose up -d --build
```

---

## 📖 DETAILED DOCUMENTATION

For complete documentation, see **DOCKER_SETUP_GUIDE.md** which includes:
- Step-by-step setup instructions
- Architecture explanation
- Development vs Production modes
- Advanced configuration
- Security best practices
- Monitoring and backup strategies
- 50+ troubleshooting scenarios

---

## ✅ PREREQUISITES

- Docker 20.10+ installed
- Docker Compose 2.0+ installed
- 4GB RAM minimum
- 10GB disk space

**Install Docker:**
- Mac/Windows: https://www.docker.com/get-started
- Linux: `curl -fsSL https://get.docker.com | sh`

---

## 🎯 PROJECT STRUCTURE AFTER SETUP

```
dualy-be/
│
├── backend/              # NestJS Backend
│   ├── src/
│   ├── Dockerfile              ⭐
│   ├── .dockerignore           ⭐
│   └── package.json
│
├── admin/                # React Admin
│   ├── src/
│   ├── Dockerfile              ⭐
│   ├── nginx.conf              ⭐
│   ├── .dockerignore           ⭐
│   └── package.json
│
├── docker-compose.yml          ⭐ Main orchestration file
├── .env                        ⭐ Environment variables
├── setup-docker.sh             ⭐ Setup script (Mac/Linux)
├── setup-docker.ps1            ⭐ Setup script (Windows)
└── DOCKER_SETUP_GUIDE.md       ⭐ Complete documentation
```

---

## 🎓 LEARNING RESOURCES

- Docker Documentation: https://docs.docker.com
- Docker Compose: https://docs.docker.com/compose
- NestJS in Docker: https://docs.nestjs.com
- React + Docker: https://create-react-app.dev/docs/deployment

---

## 🔒 SECURITY NOTES

Before deploying to production:

1. ✅ Change all default passwords
2. ✅ Generate strong JWT secrets (64+ characters)
3. ✅ Use environment-specific .env files
4. ✅ Enable SSL/TLS
5. ✅ Use Docker secrets instead of .env in production
6. ✅ Set up firewall rules
7. ✅ Regular security updates
8. ✅ Implement rate limiting
9. ✅ Set up monitoring and alerts
10. ✅ Regular database backups

---

## 📞 QUICK HELP

### **Service won't start?**
```bash
docker compose logs <service-name>
```

### **Want to see what's running?**
```bash
docker compose ps
```

### **Need to restart everything?**
```bash
docker compose restart
```

### **Want to access a container?**
```bash
docker compose exec backend sh
```

---

## 🎉 SUCCESS CHECKLIST

After running `docker compose up -d`, you should be able to:

- [ ] Visit http://localhost and see admin login page
- [ ] Login with admin@dualy.com / Admin@123
- [ ] Create a new dua
- [ ] Edit an existing dua
- [ ] Delete a dua
- [ ] Create a new challenge
- [ ] See API docs at http://localhost:3000/api/v1
- [ ] Database persists data after restart

If all checked ✅ - **Congratulations!** 🎊

---

## 📊 ARCHITECTURE

```
┌─────────────────────────────────────────────┐
│           Docker Compose Network            │
│                                             │
│  ┌──────────────┐  ┌──────────────┐       │
│  │   Admin      │  │   Backend    │       │
│  │   (React)    │  │   (NestJS)   │       │
│  │   Port: 80   │  │  Port: 3000  │       │
│  └──────┬───────┘  └──────┬───────┘       │
│         │                  │                │
│         └─────────┬────────┘                │
│                   │                         │
│         ┌─────────▼─────────┐              │
│         │    PostgreSQL     │              │
│         │    Port: 5432     │              │
│         └───────────────────┘              │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 🚀 DEPLOYMENT OPTIONS

### **Option 1: Docker Compose (Current)**
- ✅ Good for: Development, Testing, Small deployments
- ✅ Single server deployment
- ✅ Easy to manage

### **Option 2: Kubernetes** (Future)
- ✅ Good for: Production, High availability, Scaling
- ✅ Multi-server deployment
- ✅ Auto-scaling, Load balancing

### **Option 3: Cloud Services**
- AWS ECS/Fargate
- Google Cloud Run
- Azure Container Instances
- DigitalOcean App Platform

---

**Generated:** January 3, 2026  
**Version:** 1.0  
**Status:** Production Ready 🎉

**One Command to Rule Them All:**
```bash
docker compose up -d
```

**May your containers always be healthy!** 🐳✨