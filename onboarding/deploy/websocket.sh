#!/usr/bin/env bash
set -e

npm run ws:prod -- --queue=async_events_onboarding_processed_micro
