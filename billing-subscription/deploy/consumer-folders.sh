#!/usr/bin/env bash
set -e

npm run consume:prod -- --queue=async_events_billing_subscription_folders_micro
