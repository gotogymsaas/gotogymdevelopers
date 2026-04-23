#!/usr/bin/env bash
set -euo pipefail

repo_root="$(git rev-parse --show-toplevel)"
output_file="$repo_root/COMMIT_HISTORY.md"
tmp_file="$(mktemp)"

cleanup() {
  rm -f "$tmp_file"
}
trap cleanup EXIT

{
  echo "# Commit history"
  echo
  echo "Generated on: $(date -u '+%Y-%m-%d %H:%M:%S UTC')"
  echo
  git -C "$repo_root" log --date=iso --pretty=format:'## %H%nAuthor: %an <%ae>%nDate: %ad%nMessage: %s%n%n%b%n---%n'
} > "$tmp_file"

if [[ ! -f "$output_file" ]] || ! cmp -s "$tmp_file" "$output_file"; then
  mv "$tmp_file" "$output_file"
fi