#!/bin/sh

common_package="/usr/src/packages/magen-common"
if [ ! -d "$common_package" ]; then
  (cd "$common_package" && npm install --only=production)
fi

if [ ! -d "node_modules" ]; then
  npm install --only=production
fi

node "mobile/api/src/main.js"
