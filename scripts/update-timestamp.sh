#!/bin/bash

# Shell script alternative to update timestamp in Lite app.html
# Usage: ./scripts/update-timestamp.sh

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FILE_PATH="$SCRIPT_DIR/../Lite app.html"

if [ ! -f "$FILE_PATH" ]; then
    echo "Error: Lite app.html not found at $FILE_PATH"
    exit 1
fi

# Get current date and time in dd/mm/yyyy HH:MM:SS format
DATE=$(date +"%d/%m/%Y")
TIME=$(date +"%H:%M:%S")

# Update the file using sed (works on macOS and Linux)
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s/var staticDate = '[^']*';/var staticDate = '$DATE';/" "$FILE_PATH"
    sed -i '' "s/var staticTime = '[^']*';/var staticTime = '$TIME';/" "$FILE_PATH"
else
    # Linux
    sed -i "s/var staticDate = '[^']*';/var staticDate = '$DATE';/" "$FILE_PATH"
    sed -i "s/var staticTime = '[^']*';/var staticTime = '$TIME';/" "$FILE_PATH"
fi

echo "✓ Timestamp updated to: $DATE $TIME"
