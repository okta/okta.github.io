#!/bin/bash

[[ -s "$HOME/.rvm/scripts/rvm" ]] && source "$HOME/.rvm/scripts/rvm"

# Where the generated Jekyll site will be placed
GENERATED_SITE_LOCATION="dist"

# Define these ENV vars if they aren't defined already,
# so these scripts can be run outside of CI
if [[ -z "${BUILD_FAILURE}" ]]; then
    export BUILD_FAILURE=1
fi

if [[ -z "${SUCCESS}" ]]; then
    export SUCCESS=0
fi

source "${0%/*}/helpers.sh"

# Print an easily visible line, useful for log files.
function interject() {
    echo "----- ${1} -----"
}

function check_for_npm_dependencies() {
    interject 'Checking NPM dependencies'
    command -v npm > /dev/null 2>&1 || { echo "This script requires 'npm', which is not installed"; exit 1; }
    npm install
    interject 'Done checking NPM dependencies'
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
        gem install bundler --version '1.14.6'
        interject 'Done installing bundler'
    else
        interject 'Bundler is installed at:' `command -v bundler`
    fi
    interject 'Installing the gems needed for Jekyll'
    bundle install
    interject 'Done installing the gems needed for Jekyll'
    interject 'Done Jekyll checking dependencies'
}


function generate_html() {
    check_for_jekyll_dependencies

    interject 'Using Jekyll to generate HTML'

    if [ ! -d $GENERATED_SITE_LOCATION ]; then
        check_for_npm_dependencies
        bundle exec jekyll build
        local status=$?
        interject 'Done generating HTML'
        return $status
    else
        interject 'HTML already generated'
        return 0
    fi
}

function generate_conductor_file() {

    pushd $GENERATED_SITE_LOCATION
    CONDUCTOR_FILE=conductor.yml
    find -type f -iname 'index.html' | xargs dirname | sed -s "s/^\.//" | while read -r line ; do
        if [ ! -z "${line}" ]; then
            echo "  - from: ${line}" >> ${CONDUCTOR_FILE}
            echo "    to: ${line}/" >> ${CONDUCTOR_FILE}
        fi
    done
    popd

}

function require_env_var() {
    local env_var_name=$1
    eval env_var=\$$env_var_name
    if [[ -z "${env_var}" ]]; then
        echo "Environment variable '${env_var_name}' must be defined, but isn't.";
        exit 1
    fi
}
