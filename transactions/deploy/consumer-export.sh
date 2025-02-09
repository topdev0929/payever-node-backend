#!/usr/bin/env bash
set -e

NODE_OPTIONS=--max_old_space_size=8192 npm run consume:prod -- --queue=async_events_transactions_export_micro
