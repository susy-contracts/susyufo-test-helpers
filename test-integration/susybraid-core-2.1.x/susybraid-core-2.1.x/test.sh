#!/bin/bash

# Delete the installed dependency
rm -rf node_modules/susyufo-test-helpers
# Replace it with the local package
mkdir -p node_modules/susyufo-test-helpers/src
cp -r ../../susyufo-test-helpers.js node_modules/susyufo-test-helpers/
cp -r ../../package.json node_modules/susyufo-test-helpers/
cp -r ../../src/* node_modules/susyufo-test-helpers/src/

# Exit script as soon as a command fails.
set -o errexit

# Executes cleanup function at script exit.
trap cleanup EXIT

cleanup() {
  # Kill the susybraid instance that we started (if we started one and if it's still running).
  if [ -n "$susybraid_pid" ] && ps -p $susybraid_pid > /dev/null; then
    kill -9 $susybraid_pid
  fi
}

susybraid_port=8545

susybraid_running() {
  nc -z localhost "$susybraid_port"
}

start_susybraid() {
  node_modules/.bin/susybraid-cli --version
  node_modules/.bin/susybraid-cli --gasLimit 0xfffffffffff --port "$susybraid_port" "${accounts[@]}" > /dev/null &
  susybraid_pid=$!

  sleep 1
}

if susybraid_running; then
  echo "Using existing susybraid instance"
else
  echo "Starting our own susybraid instance"
  start_susybraid
fi

./node_modules/.bin/susyknot test --network susybraid
