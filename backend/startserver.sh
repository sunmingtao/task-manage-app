#!/bin/bash
source venv/bin/activate
PID=$(lsof -ti :8000)
if [ -n "$PID" ]; then
  kill -9 $PID
fi
python manage.py runserver 8000
