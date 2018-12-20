#!/bin/bash
set -e

source "${0%/*}/helpers.sh"

if [[ $TRAVIS_EVENT_TYPE != 'push' ]]; then
  export CHROME_HEADLESS=true
fi

# Run the npm install to pull in test dependencies
fold yarn_install yarn install

# Build site and Run tests
fold yarn_test yarn test

# Run External Link Check ONLY on Travis Cron Jobs
if [ "$TRAVIS_EVENT_TYPE" == "cron" ];

fi

