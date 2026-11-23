import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8');

test('page shows required assignment content', () => {
  for (const s of [
    'skcsug',
    'github.com/skcsug',
    '영국 중고차 가격 예측',
    '문제 정의',
    '역할',
    '기술',
    '결과',
    '팀 저장소(비공개)',
    '2,010.31',
    '2,122.44',
  ]) {
    assert.ok(html.includes(s), `missing: ${s}`);
  }
});

import { existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';

const dist = fileURLToPath(new URL('../dist/', import.meta.url));
const walk = (d) => readdirSync(d).flatMap((f) => {
  const p = join(d, f);
  return statSync(p).isDirectory() ? walk(p) : [p];
});

test('resume button is either disabled or links to a real file', () => {
  const m = html.match(/href="(\/[^"]*\.pdf)"/);
  if (m) {
    assert.ok(existsSync(join(dist, m[1])), `resume link points to missing file: ${m[1]}`);
  } else {
    assert.ok(html.includes('준비 중'), 'no resume link and no "준비 중" label');
  }
});

test('every local image exists in dist', () => {
  const srcs = [...html.matchAll(/<img[^>]+src="(\/[^"]+)"/g)].map((m) => m[1]);
  assert.ok(srcs.length >= 3, `expected >=3 images, got ${srcs.length}`);
  for (const s of srcs) assert.ok(existsSync(join(dist, s)), `missing file: ${s}`);
});

test('RMSE chart plots all 27 submissions', () => {
  const m = html.match(/<polyline[^>]*points="([^"]+)"/);
  assert.ok(m, 'no polyline');
  assert.equal(m[1].trim().split(/\s+/).length, 27);
});

// 팀원 이름은 저장소에 평문으로 남기지 않으려고 SHA-256 해시로만 보관합니다. [글자 수, 해시]
const FORBIDDEN = [[2,"08e8d86e6b074d1bc438460eed54a694306f211fe17bd130dbf432f23db8fefd"],[2,"5cf945b0f75f08f5f5d52448b4c2698310545de38ae177500b741b9cc69edc04"],[4,"6c5d0db00d8984439ad05b670808324300ce97c5f273c5016e2002153d69bbb3"],[5,"982c99bacfb7c475a80cdc7236b75e4080752db5494392a3135f2c288b941e0d"],[5,"cc5953191f316aee20130656f066831e8ff60ae58a0bd4bfbbba2909d9239c71"]];
const sha = (t) => createHash('sha256').update(t).digest('hex');
const findForbidden = (text) => {
  const lower = text.toLowerCase();
  for (const [len, h] of FORBIDDEN) {
    for (let i = 0; i + len <= lower.length; i++) {
      if (sha(lower.slice(i, i + len)) === h) return lower.slice(i, i + len).length;
    }
  }
  return 0;
};
const isText = (f) => /\.(html|css|js|mjs|ts|astro|json|md|txt|svg|yml|yaml)$/.test(f);

test('no secrets in build output', () => {
  for (const f of walk(dist).filter(isText)) {
    assert.ok(!/serviceKey|API_KEY/.test(readFileSync(f, 'utf8')), `secret-like text in ${f}`);
  }
});

test('no teammate names in build output or tracked files', () => {
  const root = fileURLToPath(new URL('../', import.meta.url));
  const tracked = execSync('git ls-files', { cwd: root, encoding: 'utf8' }).split('\n').filter(Boolean).filter(isText)
    .filter((f) => f !== 'package-lock.json').map((f) => join(root, f));
  for (const f of [...walk(dist).filter(isText), ...tracked]) {
    assert.equal(findForbidden(readFileSync(f, 'utf8')), 0, `teammate name found in ${f}`);
  }
});

test('copy states submission counts accurately', () => {
  assert.ok(!html.includes('총 27번'), 'claims 27 total submissions (site numbering reached #31)');
  assert.ok(html.includes('최종 선택 #19'), 'final pick should read "최종 선택 #19"');
  assert.ok(!html.includes('좌우했습니다'), 'problem statement overstates imputation impact');
});

test('OIBC card attributes the 4.2% to the right steps', () => {
  assert.ok(html.includes('눈 보정'), 'missing 눈 보정 in OIBC summary');
  assert.ok(!html.includes('시드 앙상블로 검증 페널티'), 'seed ensemble credited with the penalty drop');
});

test('chart text is enlarged on phones', () => {
  const css = walk(dist).filter((f) => f.endsWith('.css')).map((f) => readFileSync(f, 'utf8')).join('\n')
    + [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1]).join('\n');
  const mq = css.match(/@media[^{]*(?:max-width:\s*520px|width\s*<=\s*520px)[^{]*\{([\s\S]*?)\}\s*\}/);
  assert.ok(mq, 'no 520px media query');
  const m = mq[1].match(/\.chart \.tick[^{]*\{[^}]*font-size:\s*(\d+)px/);
  assert.ok(m && Number(m[1]) >= 20, 'tick font-size on phones must be >= 20 viewBox units');
});

test('deploy workflow scopes pages/id-token permissions to the deploy job', () => {
  const yml = readFileSync(new URL('../.github/workflows/deploy.yml', import.meta.url), 'utf8');
  const top = yml.slice(0, yml.indexOf('jobs:'));
  assert.ok(!/id-token:\s*write/.test(top), 'id-token: write granted to every job');
  const deploy = yml.slice(yml.indexOf('\n  deploy:'));
  assert.ok(/id-token:\s*write/.test(deploy) && /pages:\s*write/.test(deploy), 'deploy job lacks pages/id-token');
  assert.ok(/concurrency:/.test(yml), 'no concurrency group');
});

test('images and svg are constrained to container width', () => {
  const css = walk(dist).filter((f) => f.endsWith('.css')).map((f) => readFileSync(f, 'utf8')).join('\n')
    + [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1]).join('\n');
  assert.ok(/(img|svg)[^{]*\{[^}]*max-width:\s*100%/.test(css), 'no max-width:100% rule for img/svg');
});

test('profile sits in a left sidebar before the projects', () => {
  const aside = html.match(/<aside[^>]*class="[^"]*profile[^"]*"[^>]*>([\s\S]*?)<\/aside>/);
  assert.ok(aside, 'no <aside class="profile">');
  for (const s of ['skcsug', 'github.com/skcsug', '관심 분야']) assert.ok(aside[1].includes(s), `sidebar missing ${s}`);
  assert.ok(html.indexOf('<aside') < html.indexOf('Projects'), 'sidebar should come before Projects');
});

test('projects are toggles under a Projects heading, featured open', () => {
  assert.ok(/<h2[^>]*>Projects<\/h2>/.test(html), 'no "Projects" heading');
  const toggles = [...html.matchAll(/<details([^>]*)>\s*<summary/g)];
  assert.equal(toggles.length, 3, 'expected 3 project toggles');
  assert.ok(/\bopen\b/.test(toggles[0][1]), 'featured project toggle should start open');
  assert.ok(!/\bopen\b/.test(toggles[1][1]) && !/\bopen\b/.test(toggles[2][1]), 'other toggles should start closed');
});

test('interests describe the decision-support analyst goal', () => {
  const aside = html.match(/<aside[^>]*>([\s\S]*?)<\/aside>/)[1];
  assert.ok(aside.includes('경영진의 의사결정을 돕는 데이터 분석가'), 'sidebar missing career goal sentence');
  assert.ok(!aside.includes('대회형 실험 운영'), 'old project-centric interest still present');
});

test('sidebar lists Skills under interests', () => {
  const aside = html.match(/<aside[^>]*>([\s\S]*?)<\/aside>/)[1];
  const at = aside.search(/<h2[^>]*>Skills<\/h2>/);
  assert.ok(at > aside.indexOf('관심 분야'), 'Skills heading missing or not below 관심 분야');
  const tags = [...aside.slice(at).matchAll(/<li[^>]*>([^<]+)<\/li>/g)].map((m) => m[1]);
  assert.deepEqual(tags, ['Python', 'ML', 'C/C++', 'CSS/HTML/JavaScript']);
});

test('Education section sits above Projects', () => {
  const edu = html.search(/<h2[^>]*>Education<\/h2>/);
  assert.ok(edu > -1, 'no Education heading');
  assert.ok(edu < html.search(/<h2[^>]*>Projects<\/h2>/), 'Education should come before Projects');
  for (const s of ['Pusan National University', '2026 ~', 'Computer Science &amp; Engineering']) {
    assert.ok(html.includes(s), `missing ${s}`);
  }
});

test('Activities section lists IBA between Education and Projects', () => {
  const at = html.search(/<h2[^>]*>Activities<\/h2>/);
  assert.ok(at > html.search(/<h2[^>]*>Education<\/h2>/), 'Activities missing or above Education');
  assert.ok(at < html.search(/<h2[^>]*>Projects<\/h2>/), 'Activities should come before Projects');
  for (const s of ['Intelligent Business Analytics (IBA)', '지능형 경영 분석 학회', '2026.08 ~', '12th Cohort Member']) {
    assert.ok(html.includes(s), `missing ${s}`);
  }
  assert.ok(!html.includes('KEEPER'), 'KEEPER should not be listed');
});

test('Education uses the bulleted degree · school (date) row style', () => {
  const sec = html.match(/<h2[^>]*>Education<\/h2>([\s\S]*?)<\/section>/)[1];
  assert.ok(/<ul class="edu"/.test(sec), 'Education should be a <ul class="edu"> list');
  assert.ok(/<li[^>]*>[\s\S]*B\.S\., Computer Science &amp; Engineering[\s\S]*Pusan National University \(<em[^>]*>2026 ~<\/em>\)/.test(sec),
    'row should read "B.S., Computer Science & Engineering  Pusan National University (2026 ~)" with italic date');
});

test('Activities uses the Education row style with only name, group and date', () => {
  const sec = html.match(/<h2[^>]*>Activities<\/h2>([\s\S]*?)<\/section>/)[1];
  assert.ok(/<ul class="edu"/.test(sec), 'Activities should reuse the <ul class="edu"> row style');
  assert.ok(/Intelligent Business Analytics \(IBA\)[\s\S]*지능형 경영 분석 학회 · 12th Cohort Member \(<em[^>]*>2026\.08 ~<\/em>\)/.test(sec),
    'row should read "Intelligent Business Analytics (IBA)  지능형 경영 분석 학회 · 12th Cohort Member (2026.08 ~)"');
  assert.ok(!sec.includes('Pusan National University'), 'university should be dropped from Activities');
  assert.ok(!sec.includes('팀 리드') && !sec.includes('교육 세션'), 'detail bullets should be removed');
});
