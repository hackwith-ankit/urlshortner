Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "      Starting SmartURL System..." -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Launch backend in a new PowerShell process
Write-Host "[1/2] Launching Spring Boot Backend..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd smarturl-backend; .\mvnw spring-boot:run"

# Launch frontend in a new PowerShell process
Write-Host "[2/2] Launching React/Vite Frontend..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd smarturl-frontend; npm run dev"

Write-Host ""
Write-Host "==========================================" -ForegroundColor Yellow
Write-Host "Backend API will boot at: http://localhost:8080/" -ForegroundColor Yellow
Write-Host "Frontend App will boot at: http://localhost:5173/" -ForegroundColor Yellow
Write-Host "==========================================" -ForegroundColor Yellow
