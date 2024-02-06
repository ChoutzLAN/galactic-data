#!/bin/bash

# Load the .env file and export its variables
set -a
source .env
set +a

# For each exported variable, echo it in a way that GitHub Actions can set it as an output
for var in $(compgen -e); do
  echo "::set-output name=${var}::${!var}"
done
