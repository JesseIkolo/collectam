Write-Host "Starting Collectam Phase 1 Backend..." -ForegroundColor Green
Write-Host ""

# Set environment variables for Phase 1
$env:PORT = "5001"
$env:NODE_ENV = "development"
$env:MONGO_URI = "mongodb://localhost:27017/collectam"
$env:JWT_SECRET = "dev-jwt-secret-key-change-in-production"
$env:JWT_REFRESH_SECRET = "dev-refresh-secret-key-change-in-production"
$env:JWT_INVITE_SECRET = "dev-invite-secret-key-change-in-production"
$env:ALLOWED_ORIGINS = "http://localhost:3000,http://localhost:3001"
$env:QR_SECRET = "dev-qr-secret-key-change-in-production"
$env:API_BASE_URL = "http://localhost:5001"

Write-Host "Environment variables set:" -ForegroundColor Yellow
Write-Host "PORT: $env:PORT"
Write-Host "NODE_ENV: $env:NODE_ENV"
Write-Host "MONGO_URI: $env:MONGO_URI"
Write-Host ""

Write-Host "Starting server..." -ForegroundColor Cyan
npm start
