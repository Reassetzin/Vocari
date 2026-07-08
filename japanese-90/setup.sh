#!/usr/bin/env bash
# One-time bootstrap: commit this project and push it to your existing "Vocari" repo.
# Run from inside the project folder:  bash setup.sh YOUR_GITHUB_USERNAME
set -e

USER="${1:-}"
if [ -z "$USER" ]; then
  echo "Usage: bash setup.sh YOUR_GITHUB_USERNAME"
  echo "Example: bash setup.sh jgcodes"
  exit 1
fi

echo "→ Verifying the build before anything is pushed…"
npm install --no-audit --no-fund
npm run build

echo "→ Initializing git and committing…"
git init
git add -A
git commit -m "Vocari: initial commit — 90-day Japanese PWA"
git branch -M main

echo "→ Connecting to your Vocari repo and pushing…"
git remote remove origin 2>/dev/null || true
git remote add origin "https://github.com/$USER/Vocari.git"
git push -u origin main

echo ""
echo "✓ Pushed to https://github.com/$USER/Vocari"
echo "  Next: import the repo in Vercel and add env var ANTHROPIC_API_KEY."
echo "  After that, 'npm run ship' deploys any future change automatically."
