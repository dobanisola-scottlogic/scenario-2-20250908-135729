#!/usr/bin/env bash
# if we are testing a PR, merge it with the latest master branch before testing
# this ensures that all tests pass with the latest changes in master.

PR_NUMBER=${CI_PULL_REQUEST//*pull\//}
err=0

if [ -z "$PR_NUMBER" ]; then
    exit
fi

(set -x && git pull --ff-only origin "refs/pull/$PR_NUMBER/merge") || err=$?

if [ "$err" -ne "0" ]; then
    echo
    echo -e "\033[0;31mERROR: Failed to fast-forward to GitHub merge commit."
    echo -e "Please resolve merge conflicts with the base branch.\033[0m"
    exit $err
fi