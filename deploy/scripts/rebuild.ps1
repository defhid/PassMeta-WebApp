$dir = Split-Path $MyInvocation.MyCommand.Path
Set-Location "$dir/.."

docker compose rm --stop --force --volumes
docker compose down --volumes
docker compose --env-file .env --env-file .env.local create --force-recreate --build