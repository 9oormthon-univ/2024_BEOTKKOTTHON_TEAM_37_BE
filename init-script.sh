#!/bin/bash

# Install Chromium
apt-get update
apt-get install -y chromium

# Set Puppeteer executable path
export PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Start your Node.js application
node server.js
