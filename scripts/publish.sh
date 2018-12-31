#!/bin/bash

source ${OKTA_HOME}/${REPO}/scripts/setup.sh
interject "REGISTRY URL"
echo ${REGISTRY}
intterject "END REGISTRY URL"

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

if ! npm publish packages/vuepress-site --registry ${REGISTRY}; then
  echo "npm publish failed! Exiting..."
  exit ${BUILD_FAILURE}
fi

DATALOAD=$(ci-pkginfo -t dataload)
if ! artifactory_curl -X PUT -u ${ARTIFACTORY_CREDS} ${DATALOAD} -v -f; then
  echo "artifactory_curl failed! Exiting..."
  exit $PUBLISH_ARTIFACTORY_FAILURE
fi

exit ${SUCCESS}
