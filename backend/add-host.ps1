$hostsPath = "$env:SystemRoot\System32\drivers\etc\hosts"
$entry = "127.0.0.1`tcentral.auth.backend"
if (-not (Select-String -Path $hostsPath -Pattern "central\.auth\.backend" -Quiet)) {
    Add-Content -Path $hostsPath -Value "`n$entry"
    Write-Host "Added: $entry"
} else {
    Write-Host "Already present"
}
ipconfig /flushdns | Out-Null
Write-Host "DNS flushed"
