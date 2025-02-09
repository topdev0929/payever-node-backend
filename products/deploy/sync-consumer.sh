#!/usr/bin/env bash
set -e

export RABBIT_PRODUCT_QUEUE_NAME="product_${TASK_ID}_${TYPE}"
echo $RABBIT_PRODUCT_QUEUE_NAME
npm run cli:prod rabbit:setup -- --consumerDependent=true
npm run dynamic-consumer:prod -- --queue=$RABBIT_PRODUCT_QUEUE_NAME
