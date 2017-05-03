We can use the following front matter to update the sitemap.
If "exclude: 'yes'", the post/page will be exclude from the sitemap
if lastmod is missing, it will use the build time.
if changefreq is missing, it will use "monthly".
if priority is missing, it will use "0.5".

sitemap:
  lastmod: 2014-01-23
  priority: 0.7
  changefreq: 'monthly'
  exclude: 'yes'
