@echo off
echo Starting Collectam Phase 1 Backend...
echo.

REM Set environment variables for Phase 1
set PORT=5001
set NODE_ENV=development
set MONGO_URI=mongodb://localhost:27017/collectam
set JWT_SECRET=dev-jwt-secret-key-change-in-production
set JWT_REFRESH_SECRET=dev-refresh-secret-key-change-in-production
set JWT_INVITE_SECRET=dev-invite-secret-key-change-in-production
set ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
set QR_SECRET=dev-qr-secret-key-change-in-production
set API_BASE_URL=http://localhost:5001

echo Environment variables set:
echo PORT=%PORT%
echo NODE_ENV=%NODE_ENV%
echo MONGO_URI=%MONGO_URI%
echo.

echo Starting server...
npm start

pause
