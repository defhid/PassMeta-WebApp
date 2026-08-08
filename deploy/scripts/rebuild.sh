#!/bin/bash

cd "$(dirname "$0")/.." || exit 1

docker compose create --force-recreate --build
docker compose start uibuilder
