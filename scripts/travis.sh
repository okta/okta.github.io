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

ASSUME_EXTENSION=true

# (Weekly Only) Update file extensions and create redirects
if [ $TRAVIS_BRANCH == 'weekly' ]; then
  if ! removeHTMLExtensions;
  then
    echo "Failed removing .html extensions"
    exit 1;
  else
    echo -e "\xE2\x9C\x94 Removed .html extensions and setup redirects"
    ASSUME_EXTENSION=false
  fi
fi

# Run htmlproofer to validate links, scripts, and images
#   -  Passing in the argument 'true' to automatically add the '.html' extension to
#      extension-less files. 
fold bundle_exec_htmlproofer bundle exec ./scripts/htmlproofer.rb $ASSUME_EXTENSION
