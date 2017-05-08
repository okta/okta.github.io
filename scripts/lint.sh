#!/bin/bash
# lint.sh
#
# "Linting is the process of running a program that will analyse code for potential errors."
#
# Author: Joël Franusic (joel.franusic@okta.com)
# Copyright 2016 Okta, Inc.

source "${0%/*}/setup.sh"

require_env_var "OKTA_HOME"
require_env_var "REPO"

# `cd` to the path where Okta's build system has this repository
cd ${OKTA_HOME}/${REPO}

interject "Running lint.sh in $(pwd)"
if ! generate_html;
then
    echo "Error building site"
    exit $BUILD_FAILURE;
fi

if ! url_consistency_check || ! duplicate_slug_in_url;
then
    echo "FAILURE!"
    exit $BUILD_FAILURE;
fi

exit $SUCCESS;
