rm -rf ./dist
bundle exec jekyll build

# Remove extraneous files that aren't useful.
rm ./dist/.nojekyll
rm ./dist/conductor.yml

# Generate 302 redirects for posts that end in / to redirect them to the
# non-slashed versions. This is a hack to work around lack of pretty URL
# support.
find ./dist -type f ! -iname 'index.html' -name '*.html' -print0 | while read -d $'\0' f
do
    if [ -e `echo ${f%.html}` ] ;
    then
        # Skip if files have already been updated
        continue;
    fi
    cp "$f" "${f%.html}";
    path=`echo ${f%.html} | sed "s/.\/dist//g"`
    sed "s+{{ page.redirect.to | remove: 'index' }}+$path+g" ./_source/_layouts/redirect.html > $f
done

# Upload the blog posts to S3
aws s3 sync --content-type 'text/html' --sse --size-only --acl public-read dist/blog s3://developer.okta.com-production/blog

# Upload all other assets to S3
aws s3 sync --exclude 'blog' --sse --size-only --acl public-read dist s3://developer.okta.com-production

exit 0
