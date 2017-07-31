#!/bin/bash

source "${0%/*}/helpers.sh"

if ! header_checker ;
then
    echo "Failed header checker!"
    exit 1;
fi
