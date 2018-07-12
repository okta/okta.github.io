module Okta
  class ApiLifecycleTag < ::Liquid::Tag
    def initialize(tag_name, text, tokens)
      params = text.split(" ")
      @api_lifecycle = params[0]
      @class = params[1]
      if @class
        @class="api-label-#{@class}"
      end
      super
    end

    def render(context)
      case @api_lifecycle.downcase
        when "beta"
          %{ <a href="/docs/api/getting_started/releases-at-okta#beta"> <span class="api-label api-label-beta #{@class}"> <i class="fa fa-warning"></i> Beta </span> </a> }
        when "ea"
          %{ <a href="/docs/api/getting_started/releases-at-okta#early-access-ea"> <span class="api-label api-label-ea #{@class}"> <i class="fa fa-flag"></i> Early Access </span> </a> }
        when "ga"
          %{ <a href="/docs/api/getting_started/releases-at-okta#general-availability-ga"> <span class="api-label api-label-ga #{@class}"> <i class="fa fa-circle-o"></i> General Availability </span> </a> }
        when "deprecated"
          %{ <a href="/docs/api/getting_started/releases-at-okta#deprecation"> <span class="api-label api-label-deprecated #{@class}"> <i class="fa fa-fire-extinguisher"></i> Deprecated </span> </a> }
      end
    end
  end

  class ApiUriTag < ::Liquid::Tag
    def initialize(tag_name, text, tokens)
      params = text.split(" ")
      @operation = params[0]
      # Replace ${var} with **${var}**
      @uri = params[1].gsub(/\${(.*?)\}/, '**${\1}**')
      super
    end

    def render(context)
      "<span class=\"api-uri-template api-uri-#{@operation.downcase}\"><span class=\"api-label\">#{@operation.upcase}</span> #{@uri}</span>"
    end
  end

  class CorsTag < ::Liquid::Tag
    def initialize(tag_name, text, tokens)
      super
    end

    def render(context)
      '<span class="api-label api-label-cors api-uri-template-cors"><i class="fa fa-cloud-download"></i> CORS</span>'
    end
  end

  class BetaBlock < Liquid::Block
    def initialize(tag_name, markup, tokens)
      super
    end

    def render(context)
      site = context.registers[:site]
      converter = site.find_converter_instance(Jekyll::Converters::Markdown)
      '<div class="beta">' + converter.convert(super) + "</div>"
    end
  end

  Jekyll::Hooks.register [:pages, :posts, :documents], :post_render do |pages|
    # Replaces all occurences of 'yourOktaDomain' with a searchable span
    pages.output = pages.output.gsub(/https:\/\/{yourOktaDomain}/, '<span class="okta-preview-domain">https://{yourOktaDomain}</span>')
  end
end

Liquid::Template.register_tag('api_lifecycle', Okta::ApiLifecycleTag)
Liquid::Template.register_tag('api_operation', Okta::ApiUriTag)
Liquid::Template.register_tag('api_cors', Okta::CorsTag)
Liquid::Template.register_tag('beta', Okta::BetaBlock)
