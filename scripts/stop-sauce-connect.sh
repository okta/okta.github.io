#!/bin/bash
set -e

if [[ $TRAVIS_EVENT_TYPE == 'push' ]]
then
  sudo pkill -SIGINT -f 'sc'
  if [ -e ~/sc.log ]
  then
    cat ~/sc.log
  fi
fi
