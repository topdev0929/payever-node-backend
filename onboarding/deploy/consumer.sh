#!/usr/bin/env bash
set -e

npm run consumer:prod -- --queue=async_events_onboarding_created_micro
