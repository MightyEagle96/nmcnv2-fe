#!/bin/bash

if [ -z "$1" ]; then
  echo "❌ Please provide a path."
  echo "Usage: ./generate-page.sh admin/Dashboard"
  exit 1
fi

INPUT_PATH=$1
BASE_DIR="src/pages"

# Extract filename (last part after /)
PAGE_NAME=$(basename "$INPUT_PATH")

# Full directory path
FULL_DIR="$BASE_DIR/$(dirname "$INPUT_PATH")"

# If no subdirectory, dirname returns ".", fix that
if [ "$FULL_DIR" = "$BASE_DIR/." ]; then
  FULL_DIR="$BASE_DIR"
fi

FILE_PATH="$FULL_DIR/$PAGE_NAME.tsx"

# Create directory structure
mkdir -p "$FULL_DIR"

# Check if file already exists
if [ -f "$FILE_PATH" ]; then
  echo "⚠️ Page already exists!"
  exit 1
fi

# Create page file
cat <<EOF > "$FILE_PATH"
import React from "react";

const $PAGE_NAME = () => {
  return (
    <div>
      <h1>$PAGE_NAME Page</h1>
    </div>
  );
};

export default $PAGE_NAME;
EOF

echo "✅ Page created at $FILE_PATH"