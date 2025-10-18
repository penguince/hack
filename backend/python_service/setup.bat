@echo off
echo ================================
echo Python OpenCV Service Setup
echo ================================
echo.

cd /d "%~dp0"

echo Checking Python installation...
python --version
if errorlevel 1 (
    echo ERROR: Python not found! Please install Python 3.8 or higher.
    pause
    exit /b 1
)

echo.
echo Installing Python dependencies...
pip install -r requirements.txt

if errorlevel 1 (
    echo.
    echo ERROR: Failed to install dependencies.
    pause
    exit /b 1
)

echo.
echo ================================
echo Setup Complete!
echo ================================
echo.
echo To start the service, run:
echo     python app.py
echo.
echo Or with auto-reload:
echo     uvicorn app:app --reload --host 0.0.0.0 --port 8788
echo.
pause
