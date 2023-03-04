#!/bin/bash

# Start the front-end server
pip install -r requirements.txt
echo "COMPILING TYPESCRIPT"
npx tsc index.ts
echo "STARTING FRONT-END SERVER"
npx http-server &

# Wait for the front-end server to start
sleep 10

# Start the back-end server
echo "STARTING BACK-END SERVER"
echo "URL to start uploading: http://127.0.0.1:8080/display.html"
python3 back_end.py
