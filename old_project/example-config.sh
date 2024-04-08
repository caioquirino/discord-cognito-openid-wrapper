#!/bin/bash -eu

# Variables always required
export DISCORD_CLIENT_ID=# <DISCORD OAuth App Client ID>
export DISCORD_CLIENT_SECRET=# <DISCORD OAuth App Client Secret>
export COGNITO_REDIRECT_URI=# https://<Your Cognito Domain>/oauth2/idpresponse

export DISCORD_API_URL=https://discord.com/api

# Variables required if Splunk logger is used
# SPLUNK_URL=# https://<Splunk HEC>/services/collector/event/1.0
# SPLUNK_TOKEN=# Splunk HTTP Event Collector token
# SPLUNK_SOURCE=# Source for all logged events
# SPLUNK_SOURCETYPE=# Sourcetype for all logged events
# SPLUNK_INDEX=# Index for all logged events

# Variables required if deploying with API Gateway / Lambda
export BUCKET_NAME=# An S3 bucket name to use as the deployment pipeline
export STACK_NAME=
export REGION=# AWS region to deploy the stack and bucket in
export STAGE_NAME=# Stage name to create and deploy to in API gateway

# Variables required if deploying a node http server
# export PORT=# <Port to start the server on>
