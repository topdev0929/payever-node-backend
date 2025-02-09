# products

## Requirements

- node v18

## Setup

1. Copy your `.npmrc` here 
2. Copy env and update variables in them
```bash
cp .env.dist .env
```
3. Install modules
```bash
npm i
```
4. Migrate db
```bash
npm cli migration:execute up
```
## Startup
```bash
npm run http
npm run ws
```

## Running tests

```bash
npm run test:e2e
npm run test:artillery
```
# Dev Warnings
- There are two product declared schemas. Products and NewProducts. e2e tests fixtures use NewProducts while all controllers and resolvers use just Products.
