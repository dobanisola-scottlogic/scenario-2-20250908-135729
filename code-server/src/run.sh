#!/usr/bin/env bash

cd python-contestant || exit
python3 setup.py html

dumb-init code-server -p "${CODE_SERVER_PORT:-8443}"