#!/usr/bin/env bash
# 이력서와 OIBC 회고록 PDF를 다시 만듭니다. (macOS + Google Chrome 필요)
#   이력서:  src/data/resume.ts             → public/resume.pdf
#   회고록:  src/data/oibc-retrospective.md → public/oibc-retrospective.pdf
set -euo pipefail
cd "$(dirname "$0")/.."

CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
PORT=4399
PAGES=("resume" "oibc-retrospective")

npx astro build > /dev/null
# 정적 파일만 띄우면 되므로 파이썬 내장 서버를 씁니다 (astro preview는 백그라운드 데몬 하나만 허용)
python3 -m http.server "$PORT" --bind 127.0.0.1 -d dist > /dev/null 2>&1 &
SERVER=$!
trap 'kill $SERVER 2>/dev/null || true' EXIT

for _ in $(seq 1 30); do curl -sf "http://127.0.0.1:$PORT/resume/" > /dev/null && break; sleep 0.5; done

for page in "${PAGES[@]}"; do
  rm -f "public/$page.pdf"
  "$CHROME" --headless=new --disable-gpu --no-pdf-header-footer --virtual-time-budget=5000 \
    --print-to-pdf="$PWD/public/$page.pdf" "http://127.0.0.1:$PORT/$page/" 2> /dev/null
  test -s "public/$page.pdf" || { echo "$page.pdf 생성 실패" >&2; exit 1; }
  echo "public/$page.pdf 생성 완료"
done
