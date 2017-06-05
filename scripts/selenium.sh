#!/bin/bash -x
# selenium.sh
#
# Run Selenium tests for developer.okta.com
#
# Author: Joël Franusic (joel.franusic@okta.com)
# Copyright 2016 Okta, Inc.

source $OKTA_HOME/okta-core/scripts/common_setup_service.sh
# setup chrome
setup_service google-chrome-stable 58.0.3029.81
# setup xvfb
setup_service xvfb start

export TEST_SUITE_TYPE="junit"
export TEST_RESULT_FILE_DIR="${REPO}/build2/reports/junit"
export CI=true

set -e

# `cd` to the path where Okta's build system has this repository
cd ${OKTA_HOME}/${REPO}

# Bacon runs on an older chrome and NPM version, so we need to revert back
# to the old protractor
npm install -g npm@4.0.2
npm install protractor@4.0.4 --save-dev

source "${0%/*}/setup.sh"

check_for_jekyll_dependencies
check_for_npm_dependencies

npm list

if ! npm test; then
    echo "Error running protractor tests"
    exit $TEST_FAILURE
fi

echo $TEST_SUITE_TYPE > $TEST_SUITE_TYPE_FILE
echo $TEST_RESULT_FILE_DIR > $TEST_RESULT_FILE_DIR_FILE
exit $PUBLISH_TYPE_AND_RESULT_DIR;
