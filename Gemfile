source 'https://rubygems.org'

require 'json'
require 'open-uri'
versions = JSON.parse(open('https://pages.github.com/versions.json').read)

gem 'jekyll-assets'
gem 'html-proofer'
gem 'github-pages', versions['github-pages']