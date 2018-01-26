#!/bin/bash
set -e

source "${0%/*}/helpers.sh"

if [[ $TRAVIS_EVENT_TYPE != 'push' ]]; then
  export CHROME_HEADLESS=true
fi

# Run the npm install to pull in test dependencies
fold npm_install npm install

# Build site and Run tests
fold npm_test npm test

# Copy assets and previous history into dist
fold npm_postbuild_prod npm run postbuild-prod

# Run Lint checker
fold npm_lint npm run post-build-lint

# Run find-missing-slashes to find links that will redirect to okta.github.io
fold npm_find_missing_slashes npm run find-missing-slashes

# Run htmlproofer to validate links, scripts, and images
#   -  Passing in the argument 'true' to automatically add the '.html' extension to
#      extension-less files. 
fold bundle_exec_htmlproofer bundle exec ./scripts/htmlproofer.rb true
