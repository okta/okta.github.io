#!/usr/bin/env ruby

require 'html-proofer'

# Ruby hack to convert params to boolean
class String
    def to_bool
      return true   if self == true   || self =~ (/(true)$/i)
      return false  if self == false  || self.blank? || self =~ (/(false)$/i)
      raise ArgumentError.new("invalid value for Boolean: \"#{self}\"")
    end
end

options = {
    :assume_extension => ARGV[0].to_bool,
    :allow_hash_href => true,
    :empty_alt_ignore => true,
    :log_level => :error,
    :only_4xx => true,
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
