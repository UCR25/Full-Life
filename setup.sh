#!/usr/bin/env bash
set -eu

#Stop & remove orphaned containers just to make sure its closed and old version gone
docker-compose down --remove-orphans --volumes

#Build with no cahce because we want to make sure we are using the latest version of the base image
docker-compose build --no-cache
