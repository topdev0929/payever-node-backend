#!/usr/bin/env bash
set -e

npm run probe-mongo
npm run migrations -- --migrations-dir=dist/migrations up
npm run migrations -- --migrations-dir=node_modules/@pe/folders-plugin/dist/migrations up
npm run cli:prod rabbit:setup
