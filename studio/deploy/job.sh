#!/usr/bin/env bash
set -e

npm run cli:prod migration:execute up dist/migrations
npm run cli:prod rabbit:setup
