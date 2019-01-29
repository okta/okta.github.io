#!/bin/bash
set -e

if [[ $TRAVIS_EVENT_TYPE == 'push' ]]
then
  if [ -e ~/sc.log ]
  then
    cat ~/sc.log
  fi
  sudo pkill -SIGINT -f 'sc'
fi
