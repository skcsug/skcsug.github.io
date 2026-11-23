#!/usr/bin/env bash
# src/data/resume.ts를 고친 뒤 실행하면 public/resume.pdf를 다시 만듭니다. (macOS + Google Chrome 필요)
set -euo pipefail
cd "$(dirname "$0")/.."

CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
PORT=4399

npx astro build > /dev/null
# 정적 파일만 띄우면 되므로 파이썬 내장 서버를 씁니다 (astro preview는 백그라운드 데몬 하나만 허용)
python3 -m http.server "$PORT" --bind 127.0.0.1 -d dist > /dev/null 2>&1 &
PREVIEW=$!
trap 'kill $PREVIEW 2>/dev/null || true' EXIT

for _ in $(seq 1 30); do curl -sf "http://127.0.0.1:$PORT/resume/" > /dev/null && break; sleep 0.5; done

"$CHROME" --headless=new --disable-gpu --no-pdf-header-footer --virtual-time-budget=5000 \
  --print-to-pdf="$PWD/public/resume.pdf" "http://127.0.0.1:$PORT/resume/" 2> /dev/null

test -s public/resume.pdf || { echo "PDF 생성 실패" >&2; exit 1; }
echo "public/resume.pdf 생성 완료"
