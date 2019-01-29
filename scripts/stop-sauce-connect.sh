#!/bin/bash
set -e

if [[ $TRAVIS_EVENT_TYPE == 'push' ]]
then
  sudo pkill -SIGINT -f 'sc'
fi
