#!/usr/bin/env bash
set -e

npm run consume:prod -- --queue=async_events_checkout_analytics_app_micro
