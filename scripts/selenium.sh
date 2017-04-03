#!/bin/bash 
# selenium.sh
#
# Run Selenium tests for developer.okta.com
#
# Author: Joël Franusic (joel.franusic@okta.com)
# Copyright 2016 Okta, Inc.

source $OKTA_HOME/robo-warrior/setupfiles/google-chrome-stable/google-chrome-stable-setup.sh 53.0.2785.143-1
source $OKTA_HOME/robo-warrior/setupfiles/xvfb/xvfb-entrypoint.sh start
source $OKTA_HOME/$REPO/scripts/setup.sh

export TEST_SUITE_TYPE="junit"
export TEST_RESULT_FILE_DIR="${REPO}/build2/reports/junit"

set -e

# `cd` to the path where Okta's build system has this repository
cd ${OKTA_HOME}/${REPO}

source "${0%/*}/common.sh"

check_for_jekyll_dependencies
check_for_npm_dependencies

# Make a temporary file, then unlink it (-u)
# this gives us a nice name for a temporary file
PIPE=$(mktemp -u)
# Create a named pipe, or FIFO, with the file name we just generated
mkfifo $PIPE

# Start "jekyll serve" in the background
# Send STDERR (2>) to /dev/null to ignore it
# Send STDOUT (>) to our named pipe
bundle exec jekyll serve 2> /dev/null > $PIPE &
# Save the Process ID of Jekyll, for use later
jekyll_pid=$!
# Assume that jekyll has an error by default
jekyll_error=true

# Kill jekyll and delete our named pipe on exit
trap "{ kill $jekyll_pid; rm $PIPE; }" EXIT

interject "'jekyll serve' started on PID '${jekyll_pid}', waiting for bootup"

# For each line in $PIPE, assign that line to a variable named $LINE
while read LINE; do
    echo $LINE
    # Look for a line with "Server running" in it
    if [[ "${LINE}" == *"Server running... press ctrl-c to stop."* ]]; then
        # If we find the line, jekyll booted without error
        jekyll_error=false
        break
    fi
done < $PIPE

if [ "$jekyll_error" = true ]; then
    echo "Error starting 'jekyll serve'."
    echo "Is an instance of 'jekyll serve' running already?"
    exit 1
fi

interject "'jekyll serve' on PID ${jekyll_pid} is ready"

if ! npm test; then
    echo "Error running protractor tests"
    exit $TEST_FAILURE
fi

echo $TEST_SUITE_TYPE > $TEST_SUITE_TYPE_FILE
echo $TEST_RESULT_FILE_DIR > $TEST_RESULT_FILE_DIR_FILE
exit $PUBLISH_TYPE_AND_RESULT_DIR;
