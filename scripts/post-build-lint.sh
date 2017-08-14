#!/bin/bash

source "${0%/*}/helpers.sh"

if ! check_sample_code_orgs ;
then
    echo "Failed URL consistency check. Please use https://{yourOktaDomain}.com"
    exit 1;
fi

if ! header_checker ;
then
    echo "Failed header checker!"
    exit 1;
fi
