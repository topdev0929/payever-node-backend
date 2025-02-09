#!/usr/bin/env bash
set -e

pip install -r /payever/model/requirements.txt
python /payever/model/app.py
