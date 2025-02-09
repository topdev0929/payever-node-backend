#!/usr/bin/env bash
set -e

npm run http:prod
npm run cli:prod rabbit:setup
