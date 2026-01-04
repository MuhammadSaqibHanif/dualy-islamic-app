# Dualy Docker Setup Script for Windows
# Run this script in PowerShell

Write-Host "🚀 Dualy Docker Setup Script" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check if Docker is installed
try {
    $dockerVersion = docker --version
    Write-Host "✅ Docker installed: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not installed!" -ForegroundColor Red
    Write-Host "Please install Docker Desktop from https://www.docker.com/get-started" -ForegroundColor Yellow
    exit 1
}

# Check if Docker Compose is installed
try {
    $composeVersion = docker compose version
    Write-Host "✅ Docker Compose installed: $composeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker Compose is not installed!" -ForegroundColor Red
    Write-Host "Please install Docker Compose v2+" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Check if .env file exists
if (-Not (Test-Path ".env")) {
    if (Test-Path ".env.docker") {
        Write-Host "📝 Creating .env file from .env.docker..." -ForegroundColor Yellow
        Copy-Item ".env.docker" ".env"
        Write-Host "✅ .env file created" -ForegroundColor Green
    } else {
        Write-Host "⚠️  No .env file found. Using default values." -ForegroundColor Yellow
        Write-Host "   Consider creating .env file for production use." -ForegroundColor Yellow
    }
} else {
    Write-Host "✅ .env file exists" -ForegroundColor Green
}

Write-Host ""
Write-Host "🔍 Checking project structure..." -ForegroundColor Cyan

# Check if required directories exist
if (-Not (Test-Path "dualy-backend")) {
    Write-Host "❌ dualy-backend directory not found!" -ForegroundColor Red
    Write-Host "   Please make sure you're in the correct directory." -ForegroundColor Yellow
    exit 1
}

if (-Not (Test-Path "dualy-admin")) {
    Write-Host "❌ dualy-admin directory not found!" -ForegroundColor Red
    Write-Host "   Please make sure you're in the correct directory." -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ dualy-backend directory found" -ForegroundColor Green
Write-Host "✅ dualy-admin directory found" -ForegroundColor Green

# Check if Dockerfiles exist
if (-Not (Test-Path "dualy-backend/Dockerfile")) {
    Write-Host "⚠️  Backend Dockerfile not found!" -ForegroundColor Yellow
    Write-Host "   Please copy Dockerfile to dualy-backend/" -ForegroundColor Yellow
}

if (-Not (Test-Path "dualy-admin/Dockerfile")) {
    Write-Host "⚠️  Admin Dockerfile not found!" -ForegroundColor Yellow
    Write-Host "   Please copy Dockerfile to dualy-admin/" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🎯 Setup Options:" -ForegroundColor Cyan
Write-Host "1) Build and start all services"
Write-Host "2) Build only (without starting)"
Write-Host "3) Start existing containers"
Write-Host "4) Stop all services"
Write-Host "5) View logs"
Write-Host "6) Reset everything (⚠️  deletes all data)"
Write-Host "7) Exit"
Write-Host ""

$choice = Read-Host "Choose an option (1-7)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "🏗️  Building Docker images..." -ForegroundColor Cyan
        docker compose build
        
        Write-Host ""
        Write-Host "🚀 Starting all services..." -ForegroundColor Cyan
        docker compose up -d
        
        Write-Host ""
        Write-Host "⏳ Waiting for services to be ready..." -ForegroundColor Yellow
        Start-Sleep -Seconds 10
        
        Write-Host ""
        Write-Host "📊 Service Status:" -ForegroundColor Cyan
        docker compose ps
        
        Write-Host ""
        Write-Host "✅ Setup Complete!" -ForegroundColor Green
        Write-Host ""
        Write-Host "🌐 Access Points:" -ForegroundColor Cyan
        Write-Host "   Admin Panel: http://localhost"
        Write-Host "   Backend API: http://localhost:3000"
        Write-Host "   API Docs:    http://localhost:3000/api/v1"
        Write-Host ""
        Write-Host "📝 Default Login:" -ForegroundColor Cyan
        Write-Host "   Email:    admin@dualy.com"
        Write-Host "   Password: Admin@123"
        Write-Host ""
        Write-Host "📋 Useful Commands:" -ForegroundColor Cyan
        Write-Host "   View logs:    docker compose logs -f"
        Write-Host "   Stop:         docker compose down"
        Write-Host "   Restart:      docker compose restart"
    }
    
    "2" {
        Write-Host ""
        Write-Host "🏗️  Building Docker images..." -ForegroundColor Cyan
        docker compose build
        Write-Host "✅ Build complete!" -ForegroundColor Green
    }
    
    "3" {
        Write-Host ""
        Write-Host "🚀 Starting services..." -ForegroundColor Cyan
        docker compose up -d
        docker compose ps
        Write-Host "✅ Services started!" -ForegroundColor Green
    }
    
    "4" {
        Write-Host ""
        Write-Host "🛑 Stopping services..." -ForegroundColor Cyan
        docker compose down
        Write-Host "✅ Services stopped!" -ForegroundColor Green
    }
    
    "5" {
        Write-Host ""
        Write-Host "📋 Showing logs (Ctrl+C to exit)..." -ForegroundColor Cyan
        docker compose logs -f
    }
    
    "6" {
        Write-Host ""
        $confirm = Read-Host "⚠️  This will delete all data! Are you sure? (yes/no)"
        if ($confirm -eq "yes") {
            Write-Host "🗑️  Removing all containers and volumes..." -ForegroundColor Yellow
            docker compose down -v
            Write-Host "✅ Everything removed!" -ForegroundColor Green
        } else {
            Write-Host "❌ Cancelled" -ForegroundColor Yellow
        }
    }
    
    "7" {
        Write-Host "👋 Goodbye!" -ForegroundColor Cyan
        exit 0
    }
    
    default {
        Write-Host "❌ Invalid option" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "🎉 Done!" -ForegroundColor Green
