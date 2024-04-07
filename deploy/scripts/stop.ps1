$dir = Split-Path $MyInvocation.MyCommand.Path
Set-Location "$dir/.."

docker compose stop uiserver
