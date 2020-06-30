#! /usr/bin/env bash

# Install hooks

ln -s $(pwd)/scripts/hooks/pre-commit.sh .git/hooks/pre-commit  # WSL seems to need full path for Windows for some reason?
