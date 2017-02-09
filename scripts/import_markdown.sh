#!/bin/bash

function import_markdown() {
    npm install
    for NPM_NAME in `cat package.json | jq -r '.devDependencies | to_entries[] | .key' | grep @okta`; do
        NPM_DIR="node_modules/${NPM_NAME}"
        if [ ! -d "$NPM_DIR" ]; then
            echo "Warning: Directory '${NPM_DIR}' should exist but doesn't!"
            exit 1;
        fi
        PACKAGE_JSON="${NPM_DIR}/package.json"
        README="${NPM_DIR}/README.md"
        PACKAGE_NAME=${NPM_NAME#*/}
        PACKAGE_TITLE=`cat ${PACKAGE_JSON} | jq -r .oktaDoc.title`
        if [ "${PACKAGE_TITLE}" == "null" ]; then
            echo "Warning: Skipping file for ${NPM_NAME}, .oktaDoc.title not defined in package.json"
            continue
        fi
        PACKAGE_EXCERPT=`cat ${PACKAGE_JSON} | jq -r .oktaDoc.excerpt`
        if [ "${PACKAGE_EXCERPT}" == "null" ]; then
            echo "Warning: Skipping file for ${NPM_NAME}, .oktaDoc.excerpt not defined in package.json"
            continue
        fi
        PACKAGE_LANGUAGE=`cat ${PACKAGE_JSON} | jq -r .oktaDoc.language`
        if [ "${PACKAGE_LANGUAGE}" == "null" ]; then
            echo "Warning: No programming lanauge defined in .oktaDoc.language - using 'javascript'"
            PACKAGE_LANGUAGE='javascript'
        fi
        
        DESTINATION_DIR="_source/_code/${PACKAGE_LANGUAGE}"
        if [ ! -d "$DESTINATION_DIR" ]; then
            echo "Warning: Target directory '${DESTINATION_DIR}' should exist but doesn't!"
            exit 1;
        fi
        DESTINATION_FILE="${DESTINATION_DIR}/$PACKAGE_NAME.md"
    
        cat <<EOF > $DESTINATION_FILE
---
layout: docs_page
title: ${PACKAGE_TITLE}
excerpt: ${PACKAGE_EXCERPT}
---
EOF
        cat $README | grep -v '//travis-ci.org' >> $DESTINATION_FILE
        echo "Wrote ${DESTINATION_FILE}"
    done
}
