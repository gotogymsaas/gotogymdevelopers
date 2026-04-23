#!/usr/bin/env bash
set -euo pipefail

repo_root="$(git rev-parse --show-toplevel)"
output_file="$repo_root/COMMIT_HISTORY.md"
tmp_file="$(mktemp)"

if git -C "$repo_root" rev-parse --verify HEAD >/dev/null 2>&1; then
  generated_on="$(git -C "$repo_root" show -s --format='%ci' HEAD)"
else
  generated_on="$(date '+%Y-%m-%d %H:%M:%S %z')"
fi

cleanup() {
  rm -f "$tmp_file"
}
trap cleanup EXIT

{
  echo "# Commit history"
  echo
  echo "Generated on: $generated_on"
  echo
  git -C "$repo_root" log --date=iso --pretty=format:'## %H%nAuthor: %an <%ae>%nDate: %ad%nMessage: %s%n%n%b%n---%n'
} > "$tmp_file"

if [[ ! -f "$output_file" ]] || ! cmp -s "$tmp_file" "$output_file"; then
  mv "$tmp_file" "$output_file"
fi