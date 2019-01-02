#!/bin/bash

source ${OKTA_HOME}/${REPO}/scripts/setup.sh
cd ${OKTA_HOME}/${REPO}/packages/@okta/vuepress-site
REGISTRY="${ARTIFACTORY_URL}/api/npm/npm-okta"

if ! yarn build;
then
    echo "Error building site"
    exit ${BUILD_FAILURE}
fi

if [ -n "$action_branch" ];
then
  interject "Publishing from bacon task using branch $action_branch"
  TARGET_BRANCH=$action_branch
else
  interject "Publishing from bacon testSuite using branch $BRANCH"
  TARGET_BRANCH=$BRANCH
fi

if ! ci-update-package --branch ${TARGET_BRANCH}; then
  echo "ci-update-package failed! Exiting..."
  exit ${BUILD_FAILURE}
fi



if ! npm publish --registry ${REGISTRY}; then
  echo "npm publish failed! Exiting..."
  exit ${BUILD_FAILURE}
fi

DATALOAD=$(ci-pkginfo -t dataload)
interject artifactory_curl -X PUT -u ${ARTIFACTORY_CREDS} ${DATALOAD} -v -f
if ! artifactory_curl -X PUT -u ${ARTIFACTORY_CREDS} ${DATALOAD} -v -f; then
  echo "artifactory_curl failed! Exiting..."
  exit $PUBLISH_ARTIFACTORY_FAILURE
fi

ARTIFACT_FILE="$([[ ${DATALOAD} =~ vuepress-site-(.*)\.tgz ]] && echo ${BASH_REMATCH})"
DEPLOY_VERSION="$([[ ${ARTIFACT_FILE} =~ vuepress-site-(.*)\.tgz ]] && echo ${BASH_REMATCH[1]})"
ARTIFACT="@okta/vuepress-site/-/@okta/${ARTIFACT_FILE}"

if ! send_promotion_message "vuepress-site-preprod" "${ARTIFACT}" "${DEPLOY_VERSION}"; then
  echo "Error sending promotion event to aperture"
  exit ${BUILD_FAILURE}
fi

exit ${SUCCESS}
