#!/usr/bin/env bash
set -e

npm run ws:prod -- --queue=async_events_notifications_notify_micro
