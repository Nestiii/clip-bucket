#!/bin/bash

# ClipBucket Quarantine Removal Script
# This script removes the macOS quarantine attribute from ClipBucket.app

echo "🍎 ClipBucket Quarantine Removal"
echo "================================="
echo ""

# Check if running on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    echo "❌ This script is only for macOS"
    exit 1
fi

# Find ClipBucket.app in common locations
APP_PATHS=(
    "/Applications/ClipBucket.app"
    "$HOME/Applications/ClipBucket.app"
    "$HOME/Desktop/ClipBucket.app"
    "$HOME/Downloads/ClipBucket.app"
)

FOUND_APP=""
for path in "${APP_PATHS[@]}"; do
    if [[ -d "$path" ]]; then
        FOUND_APP="$path"
        break
    fi
done

if [[ -z "$FOUND_APP" ]]; then
    echo "❌ ClipBucket.app not found in common locations"
    echo "Please drag ClipBucket.app to this script or specify the path:"
    echo "   ./remove-quarantine.sh /path/to/ClipBucket.app"
    exit 1
fi

# If path provided as argument, use that instead
if [[ $# -eq 1 ]]; then
    if [[ -d "$1" ]]; then
        FOUND_APP="$1"
    else
        echo "❌ Path not found: $1"
        exit 1
    fi
fi

echo "📍 Found ClipBucket at: $FOUND_APP"
echo ""

# Remove quarantine attribute
echo "🔓 Removing quarantine attribute..."
if xattr -d com.apple.quarantine "$FOUND_APP" 2>/dev/null; then
    echo "✅ Quarantine removed successfully!"
    echo ""
    echo "🚀 ClipBucket should now launch without warnings"
    echo "You can now open ClipBucket normally from Applications or Spotlight"
else
    echo "⚠️  No quarantine attribute found or already removed"
    echo "ClipBucket should already be ready to use"
fi

echo ""
echo "💡 If you still have issues, try right-clicking ClipBucket and selecting 'Open'"