# 🕌 Dualy - App

A comprehensive app featuring duas (supplications), dhikr challenges, and daily spiritual practices.

## 🌟 Features

- ✅ **Duas Library**: Multi-language duas with Arabic text, transliteration, and translations
- ✅ **Dhikr Challenges**: Individual and collaborative challenges with progress tracking
- ✅ **Admin Panel**: Full CRUD management for content
- ✅ **Multi-language**: Support for English, Arabic, and Urdu
- ✅ **Docker Ready**: One-command deployment

## 🏗️ Architecture

- **Backend**: NestJS (TypeScript)
- **Admin Panel**: React (Vite)
- **Database**: PostgreSQL
- **Deployment**: Docker Compose

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/dualy-be.git
cd dualy-be
```

2. **Set up environment**
```bash
cp .env.example .env
# Edit .env with your settings
```

3. **Start with Docker**
```bash
docker compose up -d
```

4. **Access the application**
- Admin Panel: http://localhost
- Backend API: http://localhost:3000
- API Docs: http://localhost:3000/api/docs

### Default Credentials
- Email: `admin@dualy.com`
- Password: `Admin@123`

## 📁 Project Structure
```
dualy-be/
├── backend/           # NestJS backend API
│   ├── src/
│   ├── Dockerfile
│   └── package.json
├── admin/             # React admin panel
│   ├── src/
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml # Docker orchestration
└── README.md
```

## 🛠️ Development

### Backend Development
```bash
cd backend
npm install
npm run start:dev
```

### Admin Development
```bash
cd admin
npm install
npm run dev
```

## 📊 Database

- **PostgreSQL 16**
- Auto migrations on startup
- Sample data seeding included

## 🔒 Security

- JWT authentication
- Role-based access control
- CORS configured
- Soft deletes for data retention

## 📝 API Documentation

Swagger docs available at: `http://localhost:3000/api/docs`

## 📄 License

Copyright © 2026 Dualy Team
