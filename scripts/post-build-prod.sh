#!/bin/bash

set -ex

# get the current hash of the repo for use later
CURRENT_HASH=$(git rev-parse HEAD)
SOURCE_REPO_DIR=$(pwd)
GENERATED_SITE_LOCATION="${SOURCE_REPO_DIR}/${GENERATED_SITE_LOCATION:-"dist"}"
GITHUB_SLUG=okta/okta.github.io
REMOTE_URL="https://github.com/${GITHUB_SLUG}.git"
TARGET_BRANCH="master"

# build the site:

# create temp directory
TEMP_DIR=$(mktemp -d)
CLONE_DIR="${TEMP_DIR}/${GITHUB_SLUG}"

# We are overlaying the new version of the site on top of the old (not deleting)

# clone repo
git clone -b ${TARGET_BRANCH} ${REMOTE_URL} "${CLONE_DIR}"
cd ${CLONE_DIR}

# copy previous assets into new dist assets
rsync -r "${CLONE_DIR}/assets/" "${GENERATED_SITE_LOCATION}/assets/"

# remove cloned directory
rm -rf "${CLONE_DIR}"
