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
          "<span class=\"api-label api-label-beta #{@class}\"><i class=\"fa fa-warning\"></i> Beta</span>"
        when "ea"
          "<span class=\"api-label api-label-ea #{@class}\"><i class=\"fa fa-flag\"></i> Early Access</span>"
        when "deprecated"
          "<span class=\"api-label api-label-deprecated #{@class}\"><i class=\"fa fa-fire-extinguisher\"></i> Deprecated</span>"
      end
    end
  end

  class ApiUriTag < ::Liquid::Tag
    def initialize(tag_name, text, tokens)
      params = text.split(" ")
      @operation = params[0]
      @uri = params[1]
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
end


Liquid::Template.register_tag('api_lifecycle', Okta::ApiLifecycleTag)
Liquid::Template.register_tag('api_operation', Okta::ApiUriTag)
Liquid::Template.register_tag('api_cors', Okta::CorsTag)
Liquid::Template.register_tag('beta', Okta::BetaBlock)


