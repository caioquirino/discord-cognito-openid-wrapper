#!/bin/bash

set -e
set -u


pnpm i
pnpm format:check
pnpm lint
pnpm build
pnpm prepare-release