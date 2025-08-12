#!/bin/bash

echo "🚀 Setting up E-Commerce Platform..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js (v16 or higher) and try again."
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Setup Backend
echo "📦 Setting up backend..."
cd backend
if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
else
    echo "Backend dependencies already installed"
fi
cd ..

# Setup Frontend
echo "📦 Setting up frontend..."
cd frontend
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
else
    echo "Frontend dependencies already installed"
fi
cd ..

echo "✅ Setup complete!"
echo ""
echo "🚀 To start the application:"
echo "1. Start the backend server:"
echo "   cd backend && npm run dev"
echo ""
echo "2. In a new terminal, start the frontend:"
echo "   cd frontend && npm run dev"
echo ""
echo "🌐 Access the application at http://localhost:3000"
echo "🔐 Login credentials:"
echo "   Regular user: test / pass123"
echo "   Admin user:   admin / admin123"
echo ""
echo "🐛 This application contains intentional bugs for testing purposes!"
echo "   Check README.md for details about the bugs."