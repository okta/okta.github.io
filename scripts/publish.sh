#!/bin/bash

DEPLOY_BRANCH="source"
TARGET_S3_BUCKET="s3://developer.okta.com-production"

source "${0%/*}/setup.sh"
source "${0%/*}/helpers.sh"

# Don't attempt to publish pull requests
if [[ "${TRAVIS_PULL_REQUEST}" != "false" ]]; then
  exit ${BUILD_FAILURE}
fi

interject "Building HTML in $(pwd)"
if ! generate_html;
then
    echo "Error building site"
    exit ${BUILD_FAILURE}
fi

# Run markdown lint checker
if ! npm run markdown-lint;
then
    echo "Failed markdown lint"
    exit ${BUILD_FAILURE}
fi

# Run /dist lint checker
if ! npm run post-build-lint;
then
    echo "Failed post-build-lint"
    exit ${BUILD_FAILURE}
fi

# ----- Start (Permanent) Deploy to S3 -----
if [[ "${TRAVIS_BRANCH}" == "${DEPLOY_BRANCH}" ]]; then
    interject "Uploading HTML from '${GENERATED_SITE_LOCATION}' to '${TARGET_S3_BUCKET}'"
    if ! ./scripts/publish-s3.sh; then
        echo "Error uploading HTML to S3"
        exit ${BUILD_FAILURE}
    fi
fi
# ----- End (Permanent) Deploy to S3 -----

exit ${SUCCESS}
