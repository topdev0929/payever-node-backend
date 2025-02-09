#!/usr/bin/env bash
set -e

npm run consumer:prod -- --queue=async_events_shipping_folders_export_micro
