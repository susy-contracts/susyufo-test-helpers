#!/usr/bin/env bash

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
  # We define 10 accounts with balance 1M Sophy
  local accounts=(
    --account="0x2bdd21761a483f71054e14f5b827213567971c676928d9a1808cbfa4b7501200,1000000000000000000000000"
    --account="0x2bdd21761a483f71054e14f5b827213567971c676928d9a1808cbfa4b7501201,1000000000000000000000000"
    --account="0x2bdd21761a483f71054e14f5b827213567971c676928d9a1808cbfa4b7501202,1000000000000000000000000"
    --account="0x2bdd21761a483f71054e14f5b827213567971c676928d9a1808cbfa4b7501203,1000000000000000000000000"
    --account="0x2bdd21761a483f71054e14f5b827213567971c676928d9a1808cbfa4b7501204,1000000000000000000000000"
    --account="0x2bdd21761a483f71054e14f5b827213567971c676928d9a1808cbfa4b7501205,1000000000000000000000000"
    --account="0x2bdd21761a483f71054e14f5b827213567971c676928d9a1808cbfa4b7501206,1000000000000000000000000"
    --account="0x2bdd21761a483f71054e14f5b827213567971c676928d9a1808cbfa4b7501207,1000000000000000000000000"
    --account="0x2bdd21761a483f71054e14f5b827213567971c676928d9a1808cbfa4b7501208,1000000000000000000000000"
    --account="0x2bdd21761a483f71054e14f5b827213567971c676928d9a1808cbfa4b7501209,1000000000000000000000000"
  )

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

susyknot version

node_modules/.bin/susyknot test "$@"
