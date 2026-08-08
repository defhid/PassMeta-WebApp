$dir = Split-Path $MyInvocation.MyCommand.Path
Set-Location "$dir/.."

docker compose create --force-recreate --build
docker compose start uibuilder