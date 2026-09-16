@echo off
title AETHER OS - Productivity Command Center
echo ========================================================
echo Starting AETHER OS Personal Productivity Cockpit...
echo ========================================================

set NODE_EXEC="C:\Program Files\Adobe\Adobe Creative Cloud Experience\libs\node.exe"
if exist %NODE_EXEC% goto run_custom
set NODE_EXEC=node

:run_custom
echo Launching server on http://localhost:3000 ...
start "" "http://localhost:3000"
%NODE_EXEC% server.mjs
pause
