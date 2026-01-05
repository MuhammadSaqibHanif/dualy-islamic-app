#!/bin/bash

# Dualy Docker Setup Script
# This script sets up the Docker environment for Dualy App

set -e  # Exit on error

echo "🚀 Dualy Docker Setup Script"
echo "================================"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed!"
    echo "Please install Docker from https://www.docker.com/get-started"
    exit 1
fi

# Check if Docker Compose is installed
if ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose is not installed!"
    echo "Please install Docker Compose v2+"
    exit 1
fi

echo "✅ Docker installed: $(docker --version)"
echo "✅ Docker Compose installed: $(docker compose version)"
echo ""

# Check if .env file exists
if [ ! -f ".env" ]; then
    if [ -f ".env.docker" ]; then
        echo "📝 Creating .env file from .env.docker..."
        cp .env.docker .env
        echo "✅ .env file created"
    else
        echo "⚠️  No .env file found. Using default values."
        echo "   Consider creating .env file for production use."
    fi
else
    echo "✅ .env file exists"
fi

echo ""
echo "🔍 Checking project structure..."

# Check if required directories exist
if [ ! -d "backend" ]; then
    echo "❌ backend directory not found!"
    echo "   Please make sure you're in the correct directory."
    exit 1
fi

if [ ! -d "admin" ]; then
    echo "❌ admin directory not found!"
    echo "   Please make sure you're in the correct directory."
    exit 1
fi

echo "✅ backend directory found"
echo "✅ admin directory found"

# Check if Dockerfiles exist
if [ ! -f "backend/Dockerfile" ]; then
    echo "⚠️  Backend Dockerfile not found!"
    echo "   Please copy Dockerfile to backend/"
fi

if [ ! -f "admin/Dockerfile" ]; then
    echo "⚠️  Admin Dockerfile not found!"
    echo "   Please copy Dockerfile to admin/"
fi

echo ""
echo "🎯 Setup Options:"
echo "1) Build and start all services"
echo "2) Build only (without starting)"
echo "3) Start existing containers"
echo "4) Stop all services"
echo "5) View logs"
echo "6) Reset everything (⚠️  deletes all data)"
echo "7) Start DEVELOPMENT mode (hot reload)"
echo "8) Exit"
echo ""

read -p "Choose an option (1-8): " choice

case $choice in
    1)
        echo ""
        echo "🏗️  Building Docker images..."
        docker compose build
        
        echo ""
        echo "🚀 Starting all services..."
        docker compose up -d
        
        echo ""
        echo "⏳ Waiting for services to be ready..."
        sleep 10
        
        echo ""
        echo "📊 Service Status:"
        docker compose ps
        
        echo ""
        echo "✅ Setup Complete!"
        echo ""
        echo "🌐 Access Points:"
        echo "   Admin Panel: http://localhost"
        echo "   Backend API: http://localhost:3000"
        echo "   API Docs:    http://localhost:3000/api/v1"
        echo ""
        echo "📝 Default Login:"
        echo "   Email:    admin@dualy.com"
        echo "   Password: Admin@123"
        echo ""
        echo "📋 Useful Commands:"
        echo "   View logs:    docker compose logs -f"
        echo "   Stop:         docker compose down"
        echo "   Restart:      docker compose restart"
        ;;
    
    2)
        echo ""
        echo "🏗️  Building Docker images..."
        docker compose build
        echo "✅ Build complete!"
        ;;
    
    3)
        echo ""
        echo "🚀 Starting services..."
        docker compose up -d
        docker compose ps
        echo "✅ Services started!"
        ;;
    
    4)
        echo ""
        echo "🛑 Stopping services..."
        docker compose down
        echo "✅ Services stopped!"
        ;;
    
    5)
        echo ""
        echo "📋 Showing logs (Ctrl+C to exit)..."
        docker compose logs -f
        ;;
    
    6)
        echo ""
        read -p "⚠️  This will delete all data! Are you sure? (yes/no): " confirm
        if [ "$confirm" = "yes" ]; then
            echo "🗑️  Removing all containers and volumes..."
            docker compose down -v
            echo "✅ Everything removed!"
        else
            echo "❌ Cancelled"
        fi
        ;;

    7)
        echo ""
        echo "🔥 Starting DEVELOPMENT mode with hot reload..."
        docker compose -f docker-compose.dev.yml up --build
        ;;
    
    8)
        echo "👋 Goodbye!"
        exit 0
        ;;
    
    *)
        echo "❌ Invalid option"
        exit 1
        ;;
esac

echo ""
echo "🎉 Done!"