#!/bin/bash

# Start the front-end server
# pip install -r requirements.txt
echo "COMPILING TYPESCRIPT"
npx tsc homePage.ts
npx browserify homePage.js --standalone myBundle > bundle.js
echo "STARTING FRONT-END SERVER"
npx http-server &

# Start the back-end server
echo "STARTING BACK-END SERVER"
python3 back_end.py

