# prep-for-deploy
# ###############
#
# Remove all generated .html files (excludes the main 'index.html' in the main
# dir) and creates 302 redirects to extension-less pages.
#
# We do this because of the way the site is deployed (to an S3 bucket). EG: We
# want to deploy pages like 'some-blog-post-name' so that S3 renders the blog
# post at /some-blog-post-name. If we didn't do this (remove the .html
# extension), then when we copy the blog files to S3, the files would be named
# some-blog-post-name.html, and the page would be served to the user as
# /some-blog-post-name.html, which is ugly.
#
# The ideal way to do this in the long term is to use pretty URLs, eg: convert
# some-blog-post-name.html -> some-blog-post-name/index.html, so that users can
# view the post by hitting the URL some-blog-post-name/ (note the trailing
# slash).
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
echo "Removed .html extensions and prepped for deploy!"
