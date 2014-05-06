module Fundly
  module Style
    module Guide
      class Engine < ::Rails::Engine
        initializer 'fundly-style-guide.assets.precompile', :group => :all do |app|
          app.config.assets.precompile += %w(fundly-style.css)
        end
      end
    end
  end
end
