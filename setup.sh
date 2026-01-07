#!/bin/bash
# HustleHub Setup Script for macOS/Linux

echo "========================================"
echo "HustleHub Setup Script"
echo "========================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo ""
    echo "[ERROR] Node.js is not installed!"
    echo ""
    echo "Please download and install Node.js from:"
    echo "https://nodejs.org (LTS version recommended)"
    echo ""
    exit 1
fi

NODE_VERSION=$(node --version)
echo "[OK] Node.js $NODE_VERSION is installed"

# Check npm
if ! command -v npm &> /dev/null; then
    echo "[ERROR] npm is not found!"
    exit 1
fi

NPM_VERSION=$(npm --version)
echo "[OK] npm $NPM_VERSION is installed"

echo ""
echo "Installing dependencies..."
echo ""

# Install dependencies
npm install

if [ $? -eq 0 ]; then
    echo ""
    echo "========================================"
    echo "[SUCCESS] Setup complete!"
    echo "========================================"
    echo ""
    echo "Next steps:"
    echo "1. Set up Supabase database (run SQL in sql/seed.sql)"
    echo "2. Create storage buckets (products, avatars)"
    echo "3. Run: npm run dev"
    echo "4. Visit: http://localhost:3000"
    echo ""
else
    echo ""
    echo "[ERROR] npm install failed!"
    echo "Please check the errors above."
    echo ""
    exit 1
fi
