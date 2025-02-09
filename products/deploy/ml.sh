#!/usr/bin/env bash
set -e

nvidia-smi -a

pip index versions tensorflow

cat /usr/local/cuda/version.txt || echo "no file /usr/local/cuda/version.txt"

python /payever/model/main.py
