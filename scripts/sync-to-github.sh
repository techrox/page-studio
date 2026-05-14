#!/usr/bin/env bash
# Mirror this repo to github.com/techrox/page-studio with .claude/ stripped
# from every commit.
#
# - Bitbucket (origin) stays the canonical, private source of truth.
# - GitHub is a public mirror, rebuilt from local state on each run.
# - Each run produces fresh commit SHAs (filter-repo rewrites history),
#   so the push to GitHub is always --force. Don't accept PRs on GitHub —
#   point contributors at the Bitbucket repo or an issues-only workflow.
#
# Requirements:
#   git-filter-repo (brew install git-filter-repo)
#
# Usage:
#   scripts/sync-to-github.sh                       # mirrors current branch only
#   scripts/sync-to-github.sh --all                 # mirrors every local branch
#   GITHUB_URL=git@github.com:org/repo.git scripts/sync-to-github.sh
#
# What is stripped:
#   .claude/    (project context for Claude Code — Bitbucket-only)

set -euo pipefail

GITHUB_URL="${GITHUB_URL:-git@github.com:techrox/page-studio.git}"
MODE="${1:-current}"

if ! command -v git-filter-repo >/dev/null 2>&1; then
  echo "Error: git-filter-repo is required." >&2
  echo "  brew install git-filter-repo" >&2
  echo "  # or" >&2
  echo "  pip install git-filter-repo" >&2
  exit 1
fi

SOURCE_DIR="$(git rev-parse --show-toplevel)"
CURRENT_BRANCH="$(git -C "$SOURCE_DIR" rev-parse --abbrev-ref HEAD)"

WORK="$(mktemp -d -t ps-github-mirror-XXXXXX)"
trap 'rm -rf "$WORK"' EXIT

echo "→ Cloning $SOURCE_DIR to $WORK/mirror"
git clone --no-local --no-tags "$SOURCE_DIR" "$WORK/mirror" >/dev/null
cd "$WORK/mirror"

# Materialise every branch in the source as a local branch in the clone so
# filter-repo rewrites all of them, not just the default one.
for ref in $(git branch -r | awk '{print $1}' | grep -v 'HEAD' || true); do
  local_name="${ref#origin/}"
  git branch --track "$local_name" "$ref" >/dev/null 2>&1 || true
done

echo "→ Stripping .claude/ from history"
git filter-repo --path .claude --invert-paths --force >/dev/null

echo "→ Adding github remote: $GITHUB_URL"
git remote add github "$GITHUB_URL"

case "$MODE" in
  --all)
    echo "→ Force-pushing every branch"
    git push --force github --all
    ;;
  current|"")
    echo "→ Force-pushing $CURRENT_BRANCH"
    git push --force github "$CURRENT_BRANCH:$CURRENT_BRANCH"
    ;;
  *)
    echo "Unknown mode: $MODE (expected --all or no argument)" >&2
    exit 2
    ;;
esac

echo
echo "✓ Mirrored to $GITHUB_URL"
echo "  Bitbucket (origin) was not touched."
