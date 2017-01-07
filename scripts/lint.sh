#!/bin/bash 
# lint.sh
#
# "Linting is the process of running a program that will analyse code for potential errors."
#
# Author: Joël Franusic (joel.franusic@okta.com)
# Copyright 2016 Okta, Inc.

# `cd` to the path where Okta's build system has this repository
cd ${OKTA_HOME}/${REPO}

source "scripts/common.sh"

function url_consistency_check() {
    interject "Checking ${GENERATED_SITE_LOCATION} to make sure documentation uses proper prefixes ('/api/v1', '/oauth2', etc) in example URLs"
    if [ ! -d "$GENERATED_SITE_LOCATION" ]; then
       echo "Directory ${GENERATED_SITE_LOCATION} not found";
       return 1;
    fi

    url_consistency_check_file=`mktemp`
    # Search the _site directory for all files (-type f) ending in .html (-iname '*.html')
    find $GENERATED_SITE_LOCATION -type f -iname '*.html' | \
        # 'grep' all found files for 'api-uri-template', printing line numbers on output
        xargs grep --line-number api-uri-template | \
        # Search for the 'api/v' string, so we match "api/v1", "api/v2", etc
        grep -v api/v | grep -v oauth2 | grep -v .well-known | \
        # The 'sed' command below pulls out the filename (\1), the line number (\2) and the URL path (\3)
        # For example, this:
        # _site/docs/api/resources/authn.html:2278:<p><span class="api-uri-template api-uri-post"><span class="api-label">POST</span> /api/v1/authn</span></p>
        # becomes this:
        # _site/docs/api/resources/authn.html:2278:/api/v1/authn
        sed -e 's/^\([^:]*\):\([^:]*\).*<\/span> \(.*\)<\/span>.*/\1:\2:\3/' | \
        # Write the results to STDOUT and the $url_consistency_check_file
        tee $url_consistency_check_file
    interject "Done checking $GENERATED_SITE_LOCATION for proper prefixes in URLs"
    # Return "True" if the file is empty
    return `[ ! -s $url_consistency_check_file ]`
}

function duplicate_slug_in_url() {
    output_file=`mktemp`
    find $GENERATED_SITE_LOCATION -iname '*.html' | xargs grep '/api/v1/api/v1' | tee $output_file
    # Return "True" if the file is empty
    return `[ ! -s $url_consistency_check_file ]`
    }

interject "Running lint.sh in $(pwd)"
if ! generate_html;
then
    echo "Error building site"
    exit $BUILD_FAILURE;
fi

if ! url_consistency_check && duplicate_slug_in_url;
then
    echo "FAILURE!"
    exit $BUILD_FAILURE;
fi

exit $SUCCESS;
