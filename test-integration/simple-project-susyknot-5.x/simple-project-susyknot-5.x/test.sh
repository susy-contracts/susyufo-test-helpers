#!/bin/bash

# Delete the installed dependency
rm -rf node_modules/susyufo-test-helpers

# Replace it with the local package
mkdir -p node_modules/susyufo-test-helpers/src
cp -r ../../susyufo-test-helpers.js node_modules/susyufo-test-helpers/
cp -r ../../package.json node_modules/susyufo-test-helpers/
cp -r ../../src/* node_modules/susyufo-test-helpers/src/

npx susyknot test
