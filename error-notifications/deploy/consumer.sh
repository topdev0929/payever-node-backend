#!/usr/bin/env bash
set -e

npm run consume:prod -- --queue=async_events_error_notifications_micro
