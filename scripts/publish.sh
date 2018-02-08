#!/bin/bash -vx

DEPLOY_BRANCH="weekly"
DEPLOY_ENVIRONMENT=""
TARGET_S3_BUCKET="s3://developer.okta.com-staging"
REGISTRY="${ARTIFACTORY_URL}/api/npm/npm-okta"

declare -A branch_environment_map
branch_environment_map[source]=developer-okta-com-prod
branch_environment_map[weekly]=developer-okta-com-preprod

source "${0%/*}/setup.sh"
source "${0%/*}/helpers.sh"

require_env_var "OKTA_HOME"
require_env_var "BRANCH"
require_env_var "REPO"

# Get the Runscope trigger ID
get_secret prod/tokens/runscope_trigger_id RUNSCOPE_TRIGGER_ID

STAGING_BASE_URL_RUNSCOPE="https://dq3iyfxeowfmd.cloudfront.net"

export TEST_SUITE_TYPE="build"

# `cd` to the path where Okta's build system has this repository
cd ${OKTA_HOME}/${REPO}

interject "Building HTML in $(pwd)"
if ! generate_html;
then
    echo "Error building site"
    exit ${BUILD_FAILURE};
fi

# Copy assets and previous history into dist
if ! npm run postbuild-prod;
then
    exit ${BUILD_FAILURE};
fi

if ! removeHTMLExtensions;
then
    echo "Failed removing .html extensions"
    exit ${BUILD_FAILURE};
fi

# Run Lint checker
if ! npm run post-build-lint;
then
    exit ${BUILD_FAILURE}
fi

# Run find-missing-slashes to find links that will redirect to okta.github.io
if ! npm run find-missing-slashes;
then
    exit ${BUILD_FAILURE}
fi

# Run htmlproofer to validate links, scripts, and images
#   -  Passing in the argument 'false' to prevent adding an '.html' extension to
#      extension-less files. 
if ! bundle exec ./scripts/htmlproofer.rb false;
then
    exit ${BUILD_FAILURE}
fi

# Check if we are in one of our publish branches
if [[ -z "${branch_environment_map[$BRANCH]+unset}" ]]; then
    echo "Current branch is not a publish branch"
    exit $SUCCESS
else
    DEPLOY_ENVIRONMENT=${branch_environment_map[$BRANCH]}
fi

interject "Generating conductor file in $(pwd)"
if ! generate_conductor_file;
then
    echo "Error generating conductor file"
    exit ${BUILD_FAILURE};
fi

# ----- Start (Temporary) Deploy to S3 -----
if [[ "${BRANCH}" == "${DEPLOY_BRANCH}" ]];
then
    interject "Uploading HTML from '${GENERATED_SITE_LOCATION}' to '${TARGET_S3_BUCKET}'"
    if ! aws s3 cp ${GENERATED_SITE_LOCATION} ${TARGET_S3_BUCKET} --recursive;
    then
        echo "Error uploading HTML to S3"
        exit ${BUILD_FAILURE}
    fi
fi
# ----- End (Temporary) Deploy to S3 -----

# Create NPM package
# ------------------
if [ -n "$action_branch" ];
then
  echo "Publishing from bacon task using branch $action_branch"
  TARGET_BRANCH=$action_branch
else
  echo "Publishing from bacon testSuite using branch $BRANCH"
  TARGET_BRANCH=$BRANCH
fi

if ! ci-update-package --branch ${TARGET_BRANCH}; then
  echo "ci-update-package failed! Exiting..."
  exit $FAILED_SETUP
fi

if ! npm publish --registry ${REGISTRY}; then
  echo "npm publish failed! Exiting..."
  exit $PUBLISH_ARTIFACTORY_FAILURE
fi

DATALOAD=$(ci-pkginfo -t dataload)
if ! artifactory_curl -X PUT -u ${ARTIFACTORY_CREDS} ${DATALOAD} -v -f; then
  echo "artifactory_curl failed! Exiting..."
  exit $PUBLISH_ARTIFACTORY_FAILURE
fi

ARTIFACT_FILE="$([[ $DATALOAD =~ okta\.github\.io-(.*)\.tgz ]] && echo $BASH_REMATCH)"
DEPLOY_VERSION="$([[ $ARTIFACT_FILE =~ okta\.github\.io-(.*)\.tgz ]] && echo ${BASH_REMATCH[1]})"
ARTIFACT="@okta/okta.github.io/-/@okta/${ARTIFACT_FILE}"

if ! send_promotion_message "${DEPLOY_ENVIRONMENT}" "${ARTIFACT}" "${DEPLOY_VERSION}" ; then
  echo "Error sending promotion event to aperture"
  exit ${BUILD_FAILURE};
fi

# Trigger Runscope tests
curl -I -X GET "https://api.runscope.com/radar/bucket/$RUNSCOPE_TRIGGER_ID/trigger?base_url=$STAGING_BASE_URL_RUNSCOPE"

exit $SUCCESS
