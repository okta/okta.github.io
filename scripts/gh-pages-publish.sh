#!/bin/bash

set -e

CURRENT_HASH=$(git rev-parse HEAD)

GIT_AUTHOR_EMAIL="deploy-docs@okta.com"
GIT_AUTHOR_NAME="Auto Deploy Docs"

GITHUB_SLUG=okta/okta.github.io
REMOTE_NAME=gh-pages
REMOTE_URL="https://${GITHUB_TOKEN}@github.com/${GITHUB_SLUG}.git"
TARGET_BRANCH="master"
GENERATED_SITE_LOCATION="$(pwd)/${GENERATED_SITE_LOCATION:-"dist"}"

# change to dist
cd ${GENERATED_SITE_LOCATION}

# First make sure we are currently on the target branch, if not FAIL!
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

if [ ${TARGET_BRANCH} != ${CURRENT_BRANCH} ];
then
    echo "Current git branch '${CURRENT_BRANCH}' does not match expected target branch of '${TARGET_BRANCH}'."
    exit 1
fi

# commit
git add .
git commit -m "Deploy site for ${CURRENT_HASH}"

# add the remote
git remote add ${REMOTE_NAME} ${REMOTE_URL}
git push ${REMOTE_NAME} ${TARGET_BRANCH}
