#!/usr/bin/env bash
set -euo pipefail

repo_root="$(git rev-parse --show-toplevel)"
output_file="$repo_root/COMMIT_HISTORY.md"
tmp_file="$(mktemp)"
history_tz="${COMMIT_HISTORY_TIMEZONE:-America/Bogota}"

if git -C "$repo_root" rev-parse --verify HEAD >/dev/null 2>&1; then
  commit_epoch="$(git -C "$repo_root" show -s --format='%ct' HEAD)"
  generated_on="$(TZ="$history_tz" date -d "@$commit_epoch" '+%Y-%m-%d %H:%M:%S %z')"
else
  generated_on="$(TZ="$history_tz" date '+%Y-%m-%d %H:%M:%S %z')"
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
  TZ="$history_tz" git -C "$repo_root" log --date=iso-local --pretty=format:'## %H%nAuthor: %an <%ae>%nDate: %ad%nMessage: %s%n%n%b%n---%n'
} > "$tmp_file"

if [[ ! -f "$output_file" ]] || ! cmp -s "$tmp_file" "$output_file"; then
  mv "$tmp_file" "$output_file"
fi