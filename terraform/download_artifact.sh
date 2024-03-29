#!/bin/bash

latest_github_tag=$(basename $(curl -Ls -o /dev/null -w %{url_effective} https://github.com/caioquirino/discord-cognito-openid-wrapper/releases/latest))
GITHUB_TAG="${1:-$latest_github_tag}"

function download {

  # First argument: 
  # IF local -> use the local artifacts
  # IF empty -> use the latest tagged artifact
  # ELSE     -> use the argument as github tag

  rm -rf "../dist/${GITHUB_TAG}"
  mkdir -p "../dist/${GITHUB_TAG}"

  if [ "${GITHUB_TAG}" = "local" ]; then
    cp -rf "../dist-lambda" "../dist/${GITHUB_TAG}/."
  else
    wget -O "../dist/${GITHUB_TAG}.zip" "https://github.com/caioquirino/discord-cognito-openid-wrapper/releases/download/${GITHUB_TAG}/lambda.zip"
    unzip -o "../dist/${GITHUB_TAG}.zip" -d "../dist/${GITHUB_TAG}"
  fi
}

download 1>&2

absolute_path="$(realpath "../dist/${GITHUB_TAG}")"

echo "{\"dir\":\"${absolute_path}\"}"