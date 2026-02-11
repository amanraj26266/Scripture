# Scripture AI - Complete Automated Deployment Script
# This script runs all commands needed to deploy the app

Write-Host "========================================" -ForegroundColor Green
Write-Host "Scripture AI - Automated Setup" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# 1. Check if .env.local exists
Write-Host "[1/5] Checking environment files..." -ForegroundColor Cyan
if (Test-Path ".env.local") {
    Write-Host "✓ .env.local found" -ForegroundColor Green
} else {
    Write-Host "✗ .env.local missing" -ForegroundColor Red
    exit 1
}

if (Test-Path "supabase\.env.local") {
    Write-Host "✓ supabase/.env.local found" -ForegroundColor Green
} else {
    Write-Host "✗ supabase/.env.local missing" -ForegroundColor Red
    exit 1
}

# 2. Verify data file
Write-Host ""
Write-Host "[2/5] Checking data files..." -ForegroundColor Cyan
if (Test-Path "data\bhagavad_gita.txt") {
    Write-Host "✓ Bhagavad Gita text found" -ForegroundColor Green
} else {
    Write-Host "✗ Bhagavad Gita text missing" -ForegroundColor Red
    exit 1
}

# 3. Test npm build
Write-Host ""
Write-Host "[3/5] Building React app..." -ForegroundColor Cyan
npm run build 2>&1 | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ React app builds successfully" -ForegroundColor Green
} else {
    Write-Host "✗ React app build failed" -ForegroundColor Red
    exit 1
}

# 4. Run ingestion (needs database to exist first)
Write-Host ""
Write-Host "[4/5] Preparing for ingestion..." -ForegroundColor Cyan
Write-Host "Note: Database tables must be created first in Supabase SQL Editor" -ForegroundColor Yellow
Write-Host "See README_DEPLOYMENT.md for SQL migrations" -ForegroundColor Yellow

# 5. Start dev server
Write-Host ""
Write-Host "[5/5] Starting development server..." -ForegroundColor Cyan
npm run dev
