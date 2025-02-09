#!/usr/bin/env bash
set -e

export RABBIT_TRANSACTIONS_QUEUE_NAME="async_events_transactions_export_${RABBIT_EXPORT_ID}" # Here ID can be any unique identifier of an entity
echo $RABBIT_TRANSACTIONS_QUEUE_NAME
npm run cli:prod rabbit:setup -- --consumerDependent=true
npm run dynamic-consumer:prod -- --queue=$RABBIT_TRANSACTIONS_QUEUE_NAME