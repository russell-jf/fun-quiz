#!/usr/bin/env bash
# 宝塔 / 服务器一键更新脚本
# 用法：在项目根目录执行  bash scripts/deploy.sh
#
# 说明：宝塔「Git 部署」往往会先把代码同步到网站目录，再执行本脚本。
# 网站目录可能没有 .git，因此 pull 失败时应跳过，继续 build / 重启。
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

# 宝塔 Node / PM2 常见路径
export PATH="/www/server/nodejs/v20/bin:/www/server/nodejs/v22/bin:/usr/local/bin:$PATH"
if [ -d /www/server/nvm/versions/node ]; then
  LATEST_NODE="$(ls -1d /www/server/nvm/versions/node/v* 2>/dev/null | sort -V | tail -n 1 || true)"
  if [ -n "${LATEST_NODE}" ] && [ -d "${LATEST_NODE}/bin" ]; then
    export PATH="${LATEST_NODE}/bin:$PATH"
  fi
fi

echo "[deploy] dir: $ROOT"

if [ -d .git ]; then
  echo "[deploy] pull..."
  git fetch origin
  git reset --hard origin/main
else
  echo "[deploy] skip pull: not a git repository (Baota may have synced files already)"
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "[deploy] ERROR: npm not found. Install Node.js 20+ in Baota first."
  exit 1
fi

echo "[deploy] node=$(command -v node) ($(node -v))"
echo "[deploy] npm=$(command -v npm) ($(npm -v))"

echo "[deploy] install..."
npm install --production=false

echo "[deploy] build..."
npm run build

echo "[deploy] restart pm2..."
if command -v pm2 >/dev/null 2>&1; then
  if pm2 describe fun-quiz >/dev/null 2>&1; then
    pm2 restart fun-quiz
  else
    pm2 start ecosystem.config.cjs
  fi
  pm2 save
else
  echo "[deploy] WARN: pm2 not found, trying npm start in background is skipped."
  echo "[deploy] Please start with: pm2 start ecosystem.config.cjs"
  exit 1
fi

echo "[deploy] done."
