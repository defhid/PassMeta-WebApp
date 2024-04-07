#!/bin/bash

cd "$(dirname "$0")/.." || exit 1

docker compose --env-file .env --env-file .env.local create --force-recreate --build