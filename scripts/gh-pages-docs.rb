require 'yaml'
require 'net/http'

# Check for GitHub pages (documentation) for the SDK + toolkit docs
# - developer.okta.com/okta-sdk-java
# - developer.trexcloud.com/okta-sdk-java
config = YAML.load_file('_config.yml')
@error_pages = []

def check_for_404(url_string)
    res = Net::HTTP.get_response(URI(url_string))
    # For now, only check for pages that explicitly return a 404 status
    if res.code == '404'
        @error_pages.push(url_string)
    end
end

for page in config['github_pages_docs']
    url = "#{config['url']}/#{page}/"
    weekly_url = "#{config['weekly_url']}/#{page}/"
    
    # Check trex and prod
    check_for_404(url)
    check_for_404(weekly_url)
end

if !@error_pages.empty?
    for page in @error_pages
        puts "#{page}"
        puts "    └─  404"
    end
    exit(false)
else
    exit(true)
end
