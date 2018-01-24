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

# 7. Update file extensions and create redirects
#
#    TEMPORARILY DISABLED UNTIL S3 Migration
#    GitHub Pages does not render extension-less files
#
# if ! removeHTMLExtensions;
# then
#   echo "Failed removing .html extensions"
#   exit 1;
# fi

# 8. Run find-missing-slashes to find links that will redirect to okta.github.io
fold npm_find_missing_slashes npm run find-missing-slashes

# 9. Run htmlproofer to validate links, scripts, and images
fold bundle_exec_htmlproofer bundle exec ./scripts/htmlproofer.rb

#10. Run the ghost inspector test for CSS changes

# Download ngrok
curl -s https://bin.equinox.io/c/4VmDzA7iaHb/ngrok-stable-linux-amd64.zip > ngrok.zip
unzip ngrok.zip

# Download json parser for determining ngrok tunnel
curl -sO http://stedolan.github.io/jq/download/linux64/jq
chmod +x $PWD/jq

# Start the server
npm start &

until $(curl --output /dev/null --silent --head --fail http://localhost:4000); do
    echo '.'
    sleep 5
done

# Open ngrok tunnel
./ngrok authtoken $NGROK_TOKEN
./ngrok http 4000 > /dev/null &

sleep 2

curl 'http://localhost:4000'

# Execute Ghost Inspector tests using the ngrok tunnel
curl 'http://localhost:4040/api/tunnels'
START_URL=$(curl 'http://localhost:4040/api/tunnels' | $PWD/jq -r '.tunnels[1].public_url' | awk '{print $1"/test_page"}')
echo $START_URL
curl "https://api.ghostinspector.com/v1/tests/5a67825ecee4a76f5d965883/execute/?apiKey=$GHOST_API_KEY&startUrl=$START_URL" > $PWD/ghostinspector.json

# Exit with a fail status if any tests have failed
if [ $(grep -c '"screenshotComparePassing":false' $PWD/ghostinspector.json) -ne 0 ]; then exit 1; fi
