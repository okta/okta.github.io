#!/bin/bash

DEPLOY_ENVIRONMENT=""
REGISTRY="${ARTIFACTORY_URL}/api/npm/npm-okta"

declare -A branch_environment_map
branch_environment_map[source]=developer-okta-com-prod
branch_environment_map[weekly]=developer-okta-com-preprod
branch_environment_map[VuePress]=vuepress-site

source "${0%/*}/setup.sh"
source "${0%/*}/helpers.sh"

require_env_var "OKTA_HOME"
require_env_var "BRANCH"
require_env_var "REPO"

# Get the Runscope trigger ID
get_secret prod/tokens/runscope_trigger_id RUNSCOPE_TRIGGER_ID

export TEST_SUITE_TYPE="build"

# `cd` to the path where Okta's build system has this repository
cd ${OKTA_HOME}/${REPO}

# Check if we are in one of our publish branches
if [[ -z "${branch_environment_map[$BRANCH]+unset}" ]]; then
    echo "Current branch is not a publish branch"
    exit ${SUCCESS}
else
    DEPLOY_ENVIRONMENT=${branch_environment_map[$BRANCH]}
fi

interject "Generating conductor file in $(pwd)"
if ! generate_conductor_file; then
    echo "Error generating conductor file"
    exit ${BUILD_FAILURE}
fi


# Create NPM package
# ------------------
if [ -n "$action_branch" ]; then
  echo "Publishing from bacon task using branch ${action_branch}"
  TARGET_BRANCH=${action_branch}
else
  echo "Publishing from bacon testSuite using branch ${BRANCH}"
  TARGET_BRANCH=${BRANCH}
fi

if ! ci-update-package --branch ${TARGET_BRANCH}; then
  echo "ci-update-package failed! Exiting..."
  exit ${FAILED_SETUP}
fi

if ! yarn publish --registry ${REGISTRY}; then
  echo "npm publish failed! Exiting..."
  exit ${PUBLISH_ARTIFACTORY_FAILURE}
fi

DATALOAD=$(ci-pkginfo -t dataload)
if ! artifactory_curl -X PUT -u ${ARTIFACTORY_CREDS} ${DATALOAD} -v -f; then
  echo "artifactory_curl failed! Exiting..."
  exit ${PUBLISH_ARTIFACTORY_FAILURE}
fi

ARTIFACT_FILE="$([[ ${DATALOAD} =~ okta\.github\.io-(.*)\.tgz ]] && echo ${BASH_REMATCH})"
DEPLOY_VERSION="$([[ ${ARTIFACT_FILE} =~ okta\.github\.io-(.*)\.tgz ]] && echo ${BASH_REMATCH[1]})"
ARTIFACT="@okta/okta.github.io/-/@okta/${ARTIFACT_FILE}"

if ! send_promotion_message "${DEPLOY_ENVIRONMENT}" "${ARTIFACT}" "${DEPLOY_VERSION}"; then
  echo "Error sending promotion event to aperture"
  exit ${BUILD_FAILURE}
fi

# Trigger Runscope tests
if [[ "${BRANCH}" == "${DEPLOY_BRANCH}" ]]; then
    STAGING_BASE_URL_RUNSCOPE="https://developer.trexcloud.com"
else
    STAGING_BASE_URL_RUNSCOPE="https://developer.okta.com"
fi

curl -I -X GET "https://api.runscope.com/radar/bucket/${RUNSCOPE_TRIGGER_ID}/trigger?base_url=${STAGING_BASE_URL_RUNSCOPE}"

exit ${SUCCESS}

