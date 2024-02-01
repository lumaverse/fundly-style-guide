# coding: utf-8
lib = File.expand_path('../lib', __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require 'fundly/style/guide/version'

Gem::Specification.new do |spec|
  spec.name          = "fundly-style-guide"
  spec.version       = Fundly::Style::Guide::VERSION
  spec.authors       = ["jimmynicol"]
  spec.email         = ["james@fundly.com"]
  spec.description   = "Atomic CSS style framework for Fundly.com"
  spec.summary       = "Atomic CSS"
  spec.homepage      = "https://github.com/lumaverse/fundly-style-guide"
  spec.license       = "MIT"

  spec.files         = `git ls-files`.split($/)
  spec.executables   = spec.files.grep(%r{^bin/}) { |f| File.basename(f) }
  spec.test_files    = spec.files.grep(%r{^(test|spec|features)/})
  spec.require_paths = ["lib"]

  spec.add_dependency "railties", "~> 3.1"
  spec.add_dependency "autoprefixer-rails", "~> 1.0"
  spec.add_dependency "font-awesome-rails", "~> 4.2.0.0"

  spec.add_development_dependency "bundler", "~> 1.3"
  spec.add_development_dependency "rake"
end
