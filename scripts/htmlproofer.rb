#!/usr/bin/env ruby

require 'html-proofer'

# Ruby hack to convert params to boolean
omit_external = false

file_ignore = [
    /3rd_party_notices/,
    /search/,
    # generated sdk docs
    /java_api_sdk/,
    /python_api_sdk/,
    /javadoc/,
    /csharp_api_sdk/,
    /books/
]

if ARGV[0] == 'false'
    # Only validate internal links
    omit_external = true
    puts "INFO: Validing ONLY internal links"
else
    # Skip the /blog when validating external links
    file_ignore.append(/blog/)
end

options = {
    :assume_extension => true,
    :allow_hash_href => true,
    :empty_alt_ignore => true,
    # Run the external link checker
    :disable_external => omit_external,
    :log_level => :error,
    :only_4xx => true,
    # 8 threads, any more doesn't seem to make a difference
    :parallel => { :in_processes => 8},
    :file_ignore => file_ignore,
    :url_ignore => [
        /linkedin.com/, # linked in doesn't play nice with site crawlers
        /stormpath.com/, # 😢
        /\/quickstart\/#.*/ # /quickstart/#/
    ]
}
HTMLProofer.check_directory('dist', options).run
