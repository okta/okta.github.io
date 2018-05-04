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

# Run External Link Check ONLY on Travis Cron Jobs
if [ "$TRAVIS_EVENT_TYPE" == "cron" ];
then
  if ! bundle exec ./scripts/htmlproofer.rb;
  then
    echo "Failed HTML link validation."
    exit 1;
  else
    echo -e "\xE2\x9C\x94 No broken internal/external links!"
    exit 0;
  fi
fi

# Run Lint checker
fold npm_lint npm run post-build-lint
