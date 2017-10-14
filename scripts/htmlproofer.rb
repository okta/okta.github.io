#!/usr/bin/env ruby

require 'html-proofer'

options = {
    :assume_extension => true,
    :allow_hash_href => true,
    :empty_alt_ignore => true,
    :log_level => :debug,
    # # cache external results for 1 day in ~/.htmlproofer/cache
    # :cache => { :timeframe => '1d', :storage_dir => "#{Dir.home}/.htmlproofer/cache"},
    # 8 threads, any more doesn't seem to make a difference
    :parallel => { :in_processes => 8},
    :file_ignore => [
        /3rd_party_notices/,

        # generated sdk docs
        /java_api_sdk/,
        /python_api_sdk/,
        /javadoc/,
        /csharp_api_sdk/,

        # files no longer manged by gh-pages
        /404.html/,
        /error.html/,
        /integrate_with_okta\/index.html/
    ],
    :url_ignore => [
        /localhost/, # tons of 'localhosts' for examples
        /linkedin.com/, # linked in doesn't play nice with site crawlers
        /stormpath.com/] # 😢
}
HTMLProofer.check_directory('dist', options).run
