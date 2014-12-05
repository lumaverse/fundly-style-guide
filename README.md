# Fundly Style Guide

This repo builds the Fundly base CSS and is living documentation describing each of the styles.

These styles are following a declarative principle whereby CSS on the client side is done purely through the application of specific class that represent the styles needed for a particular component.

The aim is to never need to write CSS on the front-end outside of updates to this repo.


## Distributions

The style guide has been built as both a gem for rails projects and as a bower package.

To add to a Gemfile:

    gem 'autoprefixer-rails'
    gem 'fundly-style-guide', git: 'git@github.com:fundly/style-guide.git'

Unfortunately for a reason I am yet to determine the autoprefixer gem will not run effectively (ie not prefix anything) if it is included as a dependancy of the style guide.

To include as a bower package:

    bower install fundly-style-guide


## Local Development

Run the following to setup your local environment

    npm install -g gulp
    npm install
    bower install

Run this command to kick off the development server which has livereload running. The server is listening on port: 8111

    gulp watch


## Releasing a new version
Both the bower package and the rails gem rely on semver versioning. There are a couple of `gulp` tasks that ease the pain of fiddling with the various files that need a version number:


    gulp bump:patch
    gulp bump:minor
    gulp bump:major

Following a version bump use the following commands, replacing the version number:

    gulp build
    git commit -am"Distribution build and bump to v0.4.5"
    git push origin master
    git tag v0.4.5
    git push origin v0.4.5


## Push the Style Guide App to Github Pages

To push the style guide as a web app to Github run the following commands. The updates will be accessible at: [fundly.github.io/style-guide](http://fundly.github.io/style-guide)

    gulp build
    git commit -am"Distribution build"
    git push origin master
    gulp gh-pages
