#!/bin/sh

if [ ! -d "node_modules" ]; then
  npm install --only=production
fi

node "mobile/api/src/main.js"
