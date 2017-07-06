require 'open3'
module Npm

  # Executes npm run script with given arg, and replaces tag with
  # script output
  class NpmTag < ::Liquid::Tag

    def initialize(tag_name, text, tokens)
      params = text.split(" ")
      @run_script = params[0]
      @arg = params[1]
      super
    end

    def render(context)
      out = `npm run import-external --silent -- #{@arg}`
      if $?.to_i == 0
        out
      else
        raise out
      end
    end

  end

end

Liquid::Template.register_tag("npm", Npm::NpmTag)
