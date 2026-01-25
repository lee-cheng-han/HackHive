#!/bin/bash

# TurtleTalk ML Service Setup Script

echo "🚀 Setting up TurtleTalk ML Service..."

# Check if we're in the right directory
if [ ! -f "best_model.pth" ]; then
    echo "❌ Error: best_model.pth not found. Please run this script from the ml-service directory."
    exit 1
fi

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "📦 Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install requirements
echo "📚 Installing Python packages..."
pip install --upgrade pip
pip install -r requirements.txt

# Copy environment file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "⚙️ Creating .env file..."
    cp .env.example .env
    echo "✅ Please edit .env file with your settings"
fi

echo "✅ ML Service setup complete!"
echo ""
echo "To start the service:"
echo "1. cd ml-service"
echo "2. source venv/bin/activate"
echo "3. python run.py"
echo ""
echo "The service will be available at: http://localhost:3002"
echo "Health check: http://localhost:3002/health"