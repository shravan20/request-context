#!/bin/bash

# Colors for better output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_message() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

# Function to validate version type
validate_version_type() {
    local version_type=$1
    if [[ ! "$version_type" =~ ^(major|minor|patch)$ ]]; then
        print_message "$RED" "Error: Version type must be one of: major, minor, patch"
        exit 1
    fi
}

# Check if version type is provided
if [ -z "$1" ]; then
    print_message "$YELLOW" "Usage: $0 <version_type>"
    print_message "$YELLOW" "Version type must be one of: major, minor, patch"
    exit 1
fi

VERSION_TYPE=$1

# Validate version type
validate_version_type "$VERSION_TYPE"

# Ensure we're in a clean state
if [ -n "$(git status --porcelain)" ]; then
    print_message "$RED" "Error: Working directory is not clean. Please commit or stash changes first."
    exit 1
fi

# Login to npm
print_message "$YELLOW" "Logging in to npm..."
npm login

# Check if login was successful
if [ $? -ne 0 ]; then
    print_message "$RED" "Error: npm login failed"
    exit 1
fi

# Run tests if they exist
# if grep -q "\"test\":" package.json; then
#     print_message "$YELLOW" "Running tests..."
#     npm test
#     if [ $? -ne 0 ]; then
#         print_message "$RED" "Error: Tests failed"
#         exit 1
#     fi
# fi

# Bump version
print_message "$YELLOW" "Bumping $VERSION_TYPE version..."
npm version "$VERSION_TYPE" -m "chore(release): bump version to %s"

if [ $? -ne 0 ]; then
    print_message "$RED" "Error: Version bump failed"
    exit 1
fi

# Publish to npm
print_message "$YELLOW" "Publishing to npm..."
npm publish

if [ $? -ne 0 ]; then
    print_message "$RED" "Error: Publishing failed"
    exit 1
fi

# Push changes and tags to remote
print_message "$YELLOW" "Pushing changes and tags to remote..."
git push && git push --tags

if [ $? -ne 0 ]; then
    print_message "$RED" "Error: Failed to push changes to remote"
    exit 1
fi

print_message "$GREEN" "✨ Successfully published new $VERSION_TYPE version! ✨"