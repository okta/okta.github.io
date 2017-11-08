#!/bin/bash
set -ex

source "${0%/*}/helpers.sh"

if [ $TRAVIS_EVENT_TYPE != 'push' ]; then
  export CHROME_HEADLESS=true
fi

# 2. Run the npm install to pull in test dependencies
npm install

# 3. build the site
npm run build-prod

# 4. Run tests
npm test

export GENERATED_SITE_LOCATION="dist"

# 5. Run Lint checker
npm run post-build-lint

if ! url_consistency_check || ! duplicate_slug_in_url || ! check_for_localhost_links || ! check_index_links; then
  echo "FAILED LINT CHECK!"
  exit 1;
fi

# 6. Run find-missing-slashes to find links that will redirect to okta.github.io
npm run find-missing-slashes

# 7. Run htmlproofer to validate links, scripts, and images
bundle exec ./scripts/htmlproofer.rb

# 8. Ensure that page fragments for quickstarts have not appeared in the sitemap

if grep "quickstart/[^<]" dist/sitemap.xml; then
  echo "Sitemap contains quickstart fragments, use sitemap.exclude=\"yes\" in your fragment metadata to exclude this fragment"
  exit 1
fi
