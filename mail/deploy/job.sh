#!/usr/bin/env bash
set -e

node node_modules/puppeteer/install.js

npm run probe-mongo
npm run migrations:prod up
npm run cli:prod rabbit:setup
