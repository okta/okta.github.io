#!/bin/bash

source "${0%/*}/helpers.sh"

if ! check_sample_code_orgs ;
then
    echo "Failed URL consistency check. Please use https://{yourOktaDomain}.com"
    exit 1;
fi

if ! check_index_links ;
then
    echo "Failed index href check. Please use the proper file type"
    exit 1;
fi

if ! header_checker ;
then
    echo "Failed header checker!"
    exit 1;
fi

if ! check_for_all_localhost_links ;
then
    echo "Failed localhost checker! Please remove all localhost links"
    exit 1;
fi
