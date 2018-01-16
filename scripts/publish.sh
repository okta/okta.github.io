#!/bin/bash -vx

DEPLOY_BRANCH="weekly"
DEPLOY_ENVIRONMENT=""
TARGET_S3_BUCKET="s3://developer.okta.com-staging"
REGISTRY="${ARTIFACTORY_URL}/api/npm/npm-okta"

declare -A branch_environment_map
branch_environment_map[source]=developer-okta-com-prod
branch_environment_map[weekly]=developer-okta-com-preprod

# Check if we are in one of our publish branches
if [[ -z "${branch_environment_map[$BRANCH]+unset}" ]]; then
    echo "Current branch is not a publish branch"
    exit $SUCCESS
else
    DEPLOY_ENVIRONMENT=${branch_environment_map[$BRANCH]}
fi

source "${0%/*}/setup.sh"
source "${0%/*}/helpers.sh"

require_env_var "OKTA_HOME"
require_env_var "BRANCH"
require_env_var "REPO"

export TEST_SUITE_TYPE="build"

npm install -g @okta/ci-update-package
npm install -g @okta/ci-pkginfo

# `cd` to the path where Okta's build system has this repository
cd ${OKTA_HOME}/${REPO}

interject "Building HTML in $(pwd)"
if ! generate_html;
then
    echo "Error building site"
    exit ${BUILD_FAILURE};
else
    echo -e "\xE2\x9C\x94 Successfully built site into ./dist"
fi

interject "Generating conductor file in $(pwd)"
if ! generate_conductor_file;
then
    echo "Error generating conductor file"
    exit ${BUILD_FAILURE};
else
    echo -e "\xE2\x9C\x94 Generated conductor file"
fi

if ! removeHTMLExtensions;
then
    echo "Failed removing .html extensions"
    exit ${BUILD_FAILURE};
else
    echo -e "\xE2\x9C\x94 Removed HTML Extensions"
fi

# ----- Start (Temporary) Deploy to S3 -----
if [[ "${BRANCH}" == "${DEPLOY_BRANCH}" ]];
then
    interject "Uploading HTML from '${GENERATED_SITE_LOCATION}' to '${TARGET_S3_BUCKET}'"
    if ! aws s3 cp ${GENERATED_SITE_LOCATION} ${TARGET_S3_BUCKET} --content-type text/html --recursive --exclude "*.*";
    then
        echo "Error uploading extension-less files to S3"
        exit ${BUILD_FAILURE}
    fi

    # Copy the rest of the files
    if ! aws s3 cp ${GENERATED_SITE_LOCATION} ${TARGET_S3_BUCKET} --recursive --exclude "*" --include "*.*";
    then
        echo "Error uploading extensioned files to S3"
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

exit $SUCCESS
