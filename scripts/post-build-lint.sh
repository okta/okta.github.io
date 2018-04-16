#!/bin/bash

source "${0%/*}/helpers.sh"

if ! check_sample_code_orgs ;
then
    echo "Failed URL consistency check. Please use https://{yourOktaDomain}.com"
    exit 1;
else
    echo -e "\xE2\x9C\x94 Passed check_sample_code_orgs"
fi

if ! check_index_links ;
then
    echo "Failed index href check. Please use the proper file type"
    exit 1;
else
    echo -e "\xE2\x9C\x94 Passed check_index_links"
fi

if ! header_checker ;
then
    echo "Failed header checker!"
    exit 1;
else
    echo -e "\xE2\x9C\x94 Passed header_checker"
fi

if ! check_for_all_localhost_links ;
then
    echo "Failed localhost checker! Please remove all localhost links"
    exit 1;
else
    echo -e "\xE2\x9C\x94 Passed check_for_all_localhost_links"
fi

if ! check_for_quickstart_pages_in_sitemap ;
then
    echo "Sitemap contains quickstart fragments, use sitemap.exclude=\"yes\" in your fragment metadata to exclude this fragment"
    exit 1
else
    echo -e "\xE2\x9C\x94 Passed quickstart sitemap check"
fi

if ! url_consistency_check ;
then
    echo "Failed checking for proper prefixes ('/api/v1', '/oauth2', etc) in example URLs"
    exit 1
else
    echo -e "\xE2\x9C\x94 Passed URL consistency check"
fi

if ! duplicate_slug_in_url ;
then
    echo "Duplicate slugs: /api/v1 exist"
    exit 1
else
    echo -e "\xE2\x9C\x94 Passed duplicate slug checker"
fi

if ! npm run find-missing-slashes;
then
    exit 1
else
    echo -e "\xE2\x9C\x94 Passed missing slashes validation"
fi
