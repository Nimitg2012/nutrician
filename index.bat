@echo off
setlocal EnableExtensions
cd /d "%~dp0"

if "%PORT%"=="" set PORT=3000
set URL=http://127.0.0.1:%PORT%

echo.
echo ================================
echo        NUTRICIAN
echo   Nutrition on Autopilot
echo ================================
echo.

if not exist "package.json" (
  echo X Open index.bat from the Nutrician project folder.
  pause
  exit /b 1
)
if not exist "src" (
  echo X src\ not found. This does not look like the Nutrician project.
  pause
  exit /b 1
)
echo + Project found

where node >nul 2>&1
if errorlevel 1 (
  echo X Install Node.js 18 or later from https://nodejs.org
  pause
  exit /b 1
)
where npm >nul 2>&1
if errorlevel 1 (
  echo X npm is not installed. Reinstall Node.js from https://nodejs.org
  pause
  exit /b 1
)
echo + Node and npm found

if not exist "node_modules\" goto INSTALL
if not exist "node_modules\.bin\next.cmd" goto INSTALL
if not exist "node_modules\.bin\next" goto CHECK_NEXT_OK
goto DEPS_OK

:CHECK_NEXT_OK
if exist "node_modules\.bin\next.cmd" goto DEPS_OK

:INSTALL
echo ... Installing npm packages (first run)
call npm install
if errorlevel 1 (
  echo X npm install failed. Check your network and try again.
  pause
  exit /b 1
)

:DEPS_OK
if not exist "node_modules\.bin\next.cmd" (
  if not exist "node_modules\.bin\next" (
    echo X Next.js is still missing. Delete the node_modules folder and double-click index.bat again.
    pause
    exit /b 1
  )
)
echo + Ready
echo + Opening Nutrician in Chrome
echo.
echo Leave this window open. Press Ctrl+C to stop.
echo.

set NODE_ENV=development
set NEXT_TELEMETRY_DISABLED=1
start "" chrome "%URL%" 2>nul
if errorlevel 1 start "" "%URL%"
call "%~dp0node_modules\.bin\next.cmd" dev --hostname 127.0.0.1 --port %PORT%
if errorlevel 1 call npm run dev -- --hostname 127.0.0.1 --port %PORT%
endlocal
