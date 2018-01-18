#!/usr/bin/env ruby

require 'html-proofer'

options = {
    :assume_extension => true,
    :allow_hash_href => true,
    :empty_alt_ignore => true,
    :log_level => :error,
    :only_4xx => true,
    :cache => { :timeframe => '1d' },
    # 8 threads, any more doesn't seem to make a difference
    :parallel => { :in_processes => 8},
    :file_ignore => [
        /3rd_party_notices/,

        # generated sdk docs
        /java_api_sdk/,
        /python_api_sdk/,
        /javadoc/,
        /csharp_api_sdk/,
    ],
    :url_ignore => [
        /linkedin.com/, # linked in doesn't play nice with site crawlers
        /stormpath.com/ # 😢
    ]
}
HTMLProofer.check_directory('dist', options).run
