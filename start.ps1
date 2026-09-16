# AETHER OS Launcher Script
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "🚀 Launching AETHER OS Personal Productivity Cockpit" -ForegroundColor White
Write-Host "========================================================" -ForegroundColor Cyan

$nodePath = "C:\Program Files\Adobe\Adobe Creative Cloud Experience\libs\node.exe"
if (-not (Test-Path $nodePath)) {
    $nodeCmd = Get-Command node -ErrorAction SilentlyContinue
    if ($nodeCmd) { $nodePath = $nodeCmd.Source }
}

Start-Process "http://localhost:3000"
& $nodePath server.mjs
