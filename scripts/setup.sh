#!/bin/bash

[[ -s "${HOME}/.rvm/scripts/rvm" ]] && source "${HOME}/.rvm/scripts/rvm"

# Where the generated Jekyll site will be placed
GENERATED_SITE_LOCATION="dist"

# Define these ENV vars if they aren't defined already,
# so these scripts can be run outside of CI
if [[ -z "${BUILD_FAILURE}" ]]; then
    export BUILD_FAILURE=1
fi

if [[ -z "${SUCCESS}" ]]; then
    export SUCCESS=0
fi

# Use latest version of Node
setup_service node v10.7.0

export PATH="${PATH}:$(yarn global bin)"

# Install required dependencies
npm install -g @okta/ci-update-package
npm install -g @okta/ci-pkginfo

