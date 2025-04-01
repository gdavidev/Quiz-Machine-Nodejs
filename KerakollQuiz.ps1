# Check for process on port 3000
$process = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue |
           Where-Object { $_.State -eq "Listen" }

if ($process) {
    $pidToKill = $process.OwningProcess
    $processName = (Get-Process -Id $pidToKill).ProcessName

    # Verify it's a Node.js process
    if ($processName -eq "node") {
        Write-Host "Found Node.js process running on port 3000 (PID: $pidToKill), killing it..."
        Stop-Process -Id $pidToKill -Force
    } else {
        Write-Host "Found non-Node.js process running on port 3000 (PID: $pidToKill), not killing it."
        exit 1
    }
} else {
    Write-Host "No process found running on port 3000"
}

# Start npm processes
Write-Host "Starting npm processes..."
Start-Process -NoNewWindow -FilePath "npm" -ArgumentList "i"
Start-Process -NoNewWindow -FilePath "npm" -ArgumentList "run node:start"
Start-Process -NoNewWindow -FilePath "npm" -ArgumentList "run webpack:start"

# Wait a moment for the server to start
Start-Sleep -Seconds 3

# Open default browser
Start-Process "http://localhost:3000"

Write-Host "Done!"