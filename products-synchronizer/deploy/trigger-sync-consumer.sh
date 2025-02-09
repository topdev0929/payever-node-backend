#!/usr/bin/env bash
set -e

export RABBIT_PRODUCT_SYNC_QUEUE_NAME="product_sync_${TASK_ID}_${TYPE}"
export RABBIT_ROUTING_KEY="$(( ( 1000 + RANDOM % 9000 ) ))"
echo $RABBIT_PRODUCT_SYNC_QUEUE_NAME
npm run cli:prod rabbit:setup -- --consumerDependent=true
npm run dynamic-consumer:prod -- --queue=$RABBIT_PRODUCT_SYNC_QUEUE_NAME
