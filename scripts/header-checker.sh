#!/bin/bash

function header_checker() {
    local dir=$(pwd)
    local allheaders=$( grep -EoR "##" --include="*.html" $dir --exclude-dir={node_modules,scripts,tests,dist,_source} | sort | uniq )
    echo $allheaders
    if [ "$allheaders" ];
    then
        echo $allheaders
        echo "Files contain broken headers."
        return 1
    fi
}

if ! header_checker ;
then
    echo "Failed header checker!"
    exit 1;
fi