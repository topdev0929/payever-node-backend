#!/usr/bin/env bash
set -e

export RABBIT_PAYMENT_NOTIFICATION_QUEUE_NAME='payment_notifications_'$(uuidgen)
echo RABBIT_PAYMENT_NOTIFICATION_QUEUE_NAME
npm run cli:prod rabbit:setup -- --consumerDependent=true
npm run consume:prod -- --queue=$RABBIT_PAYMENT_NOTIFICATION_QUEUE_NAME
