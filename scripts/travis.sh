#!/bin/bash
set -e

source "${0%/*}/helpers.sh"

if [[ $TRAVIS_EVENT_TYPE != 'push' ]]; then
  export CHROME_HEADLESS=true
fi

# 2. Run the npm install to pull in test dependencies
fold npm_install npm install

# 3. Build site and Run tests
fold npm_test npm test

export GENERATED_SITE_LOCATION="dist"

# 4. copy assets and previous history into dist
fold npm_postbuild_prod npm run postbuild-prod

# 5. Run Lint checker
fold npm_lint npm run post-build-lint

# 6. Run Travis specific tests
if ! url_consistency_check || ! duplicate_slug_in_url; then
  echo "FAILED LINT CHECK!"
  exit 1;
fi

# 6. Update file extensions and create redirects
if ! removeHTMLExtensions;
then
  echo "Failed removing .html extensions"
  exit 1;
fi

# 7. Run find-missing-slashes to find links that will redirect to okta.github.io
fold npm_find_missing_slashes npm run find-missing-slashes

# 8. Run htmlproofer to validate links, scripts, and images
fold bundle_exec_htmlproofer bundle exec ./scripts/htmlproofer.rb
