#!/bin/bash

# 1. Stop old script
echo "Stopping old msg.py process..."
PID=$(ps aux | grep msg.py | grep -v grep | awk '{print $2}')
if [ -n "$PID" ]; then
  kill $PID
  echo "Stopped process $PID"
else
  echo "No old process found"
fi

# 2. Pull latest code
echo "Pulling latest code from Git..."
git pull

# 3. Start new script
echo "Starting new msg.py script..."
nohup python3 msg.py > output.log 2>&1 &

echo "Done. Check output.log for logs."
