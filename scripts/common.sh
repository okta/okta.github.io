#!/bin/bash

[[ -s "$HOME/.rvm/scripts/rvm" ]] && source "$HOME/.rvm/scripts/rvm"

# Where the generated Jekyll site will be placed
GENERATED_SITE_LOCATION="_site"

# Print an easily visible line, useful for log files.
function interject() {
    echo "----- ${1} -----"
}

function check_for_protractor_dependencies() {
    interject 'Checking Protractor dependencies'
    command -v npm > /dev/null 2>&1 || { echo "This script requires 'npm', which is not installed"; exit 1; }
    npm install --only=dev
    interject 'Done checking Protractor dependencies'
}

function check_for_jekyll_dependencies() {
    interject 'Checking Jekyll dependencies'
    command -v rvm > /dev/null 2>&1 || { echo "This script requires 'rvm', which is not installed"; exit 1; }
    
    # The file `.ruby-version` has the current ruby version and is used by rbenv
    # https://rvm.io/workflow/projects#project-file-ruby-version
    # For example, this file might contain this line: "ruby-2.0.0-p643"
    # This version of ruby is needed for the gems that Jekyll requires.
    ruby_version=`cat .ruby-version`
    if ! rvm list strings | grep $ruby_version > /dev/null; then
        interject "Installing the version of Ruby needed by Jekyll (${ruby_version})"
        rvm install $ruby_version
        interject "Installed ${ruby_version}"
    fi
    # "source" the version of Ruby that we need, so the "gem" and "bundler"
    # commands use the version of Ruby that we want.
    # https://rvm.io/rvm/basics#post-install-configuration
    source $(rvm `cat .ruby-version` do rvm env --path)
    if ! ((command -v bundler && bundler --version) > /dev/null 2>&1); then
        interject 'Bundler is not installed, installing now'
        gem install bundler
        interject 'Done installing bundler'
    else
        interject 'Bundler is installed at:' `command -v bundler`
    fi
    interject 'Installing the gems needed for Jekyll'
    bundler install
    interject 'Done installing the gems needed for Jekyll'
    interject 'Done Jekyll checking dependencies'
}
    

function generate_html() {
    check_for_jekyll_dependencies
    
    interject 'Using Jekyll to generate HTML'
    
    if [ ! -d $GENERATED_SITE_LOCATION ]; then
        bundle exec jekyll build
        local status=$?
        interject 'Done generating HTML'
        return $status
    else
        interject 'HTML already generated'
        return 0
    fi
}



