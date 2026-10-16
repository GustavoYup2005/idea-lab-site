@echo off
cd /d "%~dp0"
echo.
echo IDEA Lab website - build for https://ce.nau.edu/me/idealab/
echo.
echo Pulling the latest site from GitHub...
git pull
if errorlevel 1 goto fail
echo.
echo Installing...
call npm ci
if errorlevel 1 goto fail
echo.
echo Building the files IT will host...
call npm run build:nau
if errorlevel 1 goto fail
echo.
echo Build finished.
echo.
echo NEXT: copy everything INSIDE the "out" folder into
echo \\arshares.ucc.nau.edu\Web\ce.nau.edu\me\idealab
echo.
echo Do not copy the out folder itself.
echo index.html must sit directly in the idealab folder.
echo.
echo Two folders will open. Copy from "out" into the idealab share.
echo.
start "" explorer "%~dp0out"
start "" explorer "\\arshares.ucc.nau.edu\Web\ce.nau.edu\me\idealab"
pause
exit /b 0

:fail
echo.
echo Something failed. Leave this window open and send a screenshot to Gustavo.
pause
exit /b 1
