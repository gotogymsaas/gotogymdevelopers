#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "$0")/.." && pwd)"

git -C "$repo_root" config core.hooksPath .githooks
chmod +x "$repo_root/.githooks/post-commit"
chmod +x "$repo_root/scripts/update-commit-history.sh"

echo "Hooks activados en $repo_root/.githooks"