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

# copy the original version of the images in
IMAGE_DIR="${GENERATED_SITE_LOCATION}/assets/img/"
mkdir -p "${IMAGE_DIR}"
rsync -r "${SOURCE_REPO_DIR}/_source/_assets/img/" "${IMAGE_DIR}"

# overlay dist (without deleting)
rsync -r "${GENERATED_SITE_LOCATION}/" "${CLONE_DIR}"

# move the new overlay clone dir back to dist
rm -rf "${GENERATED_SITE_LOCATION}"
mv "${CLONE_DIR}" "${GENERATED_SITE_LOCATION}"
