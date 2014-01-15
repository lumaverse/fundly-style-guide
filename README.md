# Fundly Style Guide

This repo builds the Fundly base CSS and is a living documentation describing each of the styles.

These styles are following a declarative principle whereby CSS on the client side is done purely through the application of specific class that represent the styles needed for a particular component.

The aim is to never need to write CSS on the front-end outside of updates to this repo.


## Local Development

    npm install -g grunt-cli
    npm install
    grunt serve


## Push the Style Guide to Github Pages

To push the style guide as a web page to Github run the following two commands and the updates will be accessible at: [fundly.github.io/style-guide](http://fundly.github.io/style-guide)

    grunt build
    git subtree push --prefix dist origin gh-pages