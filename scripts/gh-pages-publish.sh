#!/bin/bash

set -e

CURRENT_HASH=$(git rev-parse HEAD)

# this directory is already setup as part of `npm run build-prod`
GENERATED_SITE_LOCATION=${GENERATED_SITE_LOCATION:-"dist"}
pushd "${GENERATED_SITE_LOCATION}"

GIT_AUTHOR_EMAIL="deploy-docs@okta.com"
GIT_AUTHOR_NAME="Auto Deploy Docs"


GITHUB_SLUG=okta/okta.github.io
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

REMOTE_NAME=gh-pages
REMOTE_URL="https://${GITHUB_TOKEN}@github.com/${GITHUB_SLUG}.git"

#Add the remote
git remote add ${REMOTE_NAME} ${REMOTE_URL} || (echo "Updating remote URL" && git remote set-url ${REMOTE_NAME} ${REMOTE_URL})
#Add the diffs
git add .
git commit -m "Deploy site for ${CURRENT_HASH}"
git push gh-pages ${CURRENT_BRANCH}
