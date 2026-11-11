#!/bin/bash
# Double-click to generate Kreatale hero characters with Model Studio (Qwen-Image).
# Reads DASHSCOPE_API_KEY from ../.env.local. The key is never printed.
cd "$(dirname "$0")/.." || exit 1
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"
export NVM_DIR="$HOME/.nvm"; [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" >/dev/null 2>&1
echo "Kreatale character generator"
echo "Folder: $(pwd)"
echo
if ! command -v node >/dev/null 2>&1; then echo "Node.js not found. Install it from nodejs.org and try again."; read -n 1 -s -r -p "Press any key to close."; exit 1; fi
node scripts/generate-characters.mjs 2>&1 | tee scripts/generate-characters.log
echo
open "public/illustrations/characters" 2>/dev/null
read -n 1 -s -r -p "Done. Press any key to close this window."
