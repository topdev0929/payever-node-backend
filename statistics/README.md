# Statistics

jiraKey: STATM

## Install and run application

1. Run `npm install`
2. Run `cp .env.dist .env`
3. Set up .env file
4. Run `npm run cli migration:latest`
5. Run `npm run cli rabbit:setup`

## Run cubejs server locally

1. Check the cubejs config in .env file
2. Check if MongoDB Connector for BI Components is configured and running correctly
3. Run `npm run cube`
3. Run `npm run cron`
3. Run `npm run ws`

## Running tests

### Running e2e tests

Run `npm run test:e2e`.