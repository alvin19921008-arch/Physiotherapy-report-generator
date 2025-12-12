#!/bin/bash

# Shell script alternative to update-version.js
# Updates version information before building (works without Node.js)

# Get the directory of this script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FULL_APP_DIR="$(dirname "$SCRIPT_DIR")"

# Get current timestamp for build
BUILD_TIMESTAMP=$(date +%s)000  # Convert to milliseconds
BUILD_DATE=$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")

# Read package.json to get version
PACKAGE_JSON_PATH="$FULL_APP_DIR/package.json"
if [ ! -f "$PACKAGE_JSON_PATH" ]; then
    echo "Error: package.json not found at $PACKAGE_JSON_PATH"
    exit 1
fi

# Extract version from package.json (works with both JSON and simple formats)
VERSION=$(grep -o '"version"[[:space:]]*:[[:space:]]*"[^"]*"' "$PACKAGE_JSON_PATH" | sed 's/.*"version"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/')

if [ -z "$VERSION" ]; then
    echo "Error: Could not extract version from package.json"
    exit 1
fi

# Parse version components
IFS='.' read -r MAJOR MINOR PATCH <<< "$VERSION"
BUILD_DATE_ONLY=$(echo "$BUILD_DATE" | cut -d'T' -f1)

# Update version.ts file
VERSION_TS_PATH="$FULL_APP_DIR/src/config/version.ts"

cat > "$VERSION_TS_PATH" << EOF
// Centralized version configuration
export const APP_VERSION = {
  major: ${MAJOR},
  minor: ${MINOR},
  patch: ${PATCH},
  build: ${BUILD_TIMESTAMP}, // Unique build identifier
  
  // Full version string
  get full() {
    return \`v\${this.major}.\${this.minor}.\${this.patch}\`;
  },
  
  // Version with build info
  get fullWithBuild() {
    return \`\${this.full} (Build: \${this.build})\`;
  },
  
  // Legacy format for compatibility
  get legacy() {
    return \`V\${this.major}\${this.minor}\${this.patch}\`;
  },
  
  // Display version for UI
  get display() {
    return this.full;
  }
};

// Version history for reference
export const VERSION_HISTORY = [
  { version: 'v1.4.7', date: '2024-11-27', description: 'Mock data corrections and improvements' },
  { version: 'v${VERSION}', date: '${BUILD_DATE_ONLY}', description: 'Version control system implementation' }
];

// Build information
export const BUILD_INFO = {
  timestamp: '${BUILD_DATE}',
  environment: import.meta.env.MODE || 'development',
  commit: import.meta.env.VITE_GIT_COMMIT || 'unknown'
};
EOF

# Update index.html title
INDEX_HTML_PATH="$FULL_APP_DIR/index.html"
if [ -f "$INDEX_HTML_PATH" ]; then
    # Use sed to replace title (works on both macOS and Linux)
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS sed requires -i '' for in-place editing
        sed -i '' "s/<title>.*<\/title>/<title>Physiotherapy Medical Report Generator v${VERSION} - Tuen Mun Hospital<\/title>/" "$INDEX_HTML_PATH"
    else
        # Linux sed
        sed -i "s/<title>.*<\/title>/<title>Physiotherapy Medical Report Generator v${VERSION} - Tuen Mun Hospital<\/title>/" "$INDEX_HTML_PATH"
    fi
fi

echo "✅ Version updated to v${VERSION} (Build: ${BUILD_TIMESTAMP})"
echo "📅 Build date: ${BUILD_DATE}"
echo "📁 Updated files: version.ts, index.html"

