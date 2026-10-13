#!/usr/bin/env bash
# 宝塔 / 服务器一键更新脚本
# 用法：在项目根目录执行  bash scripts/deploy.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "[deploy] dir: $ROOT"
echo "[deploy] pull..."
git fetch origin
git reset --hard origin/main

echo "[deploy] install..."
npm install --production=false

echo "[deploy] build..."
npm run build

echo "[deploy] restart pm2..."
if pm2 describe fun-quiz >/dev/null 2>&1; then
  pm2 restart fun-quiz
else
  pm2 start ecosystem.config.cjs
fi
pm2 save

echo "[deploy] done."
