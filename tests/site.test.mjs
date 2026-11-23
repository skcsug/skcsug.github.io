import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8');

test('page shows required assignment content', () => {
  for (const s of [
    'skcsug',
    'github.com/skcsug',
    'IBA ML 회귀 토이 프로젝트',
    '문제 정의',
    '역할',
    '기술',
    '결과',
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
  for (const s of srcs) assert.ok(existsSync(join(dist, s)), `missing file: ${s}`);
});
test('RMSE chart plots all 27 submissions', () => {
  const m = html.match(/<polyline[^>]*points="([^"]+)"/);
  assert.ok(m, 'no polyline');
  assert.equal(m[1].trim().split(/\s+/).length, 27);
});

// 팀원 이름은 저장소에 평문으로 남기지 않으려고 SHA-256 해시로만 보관합니다. [글자 수, 해시]
const FORBIDDEN = [[2,"08e8d86e6b074d1bc438460eed54a694306f211fe17bd130dbf432f23db8fefd"],[2,"5cf945b0f75f08f5f5d52448b4c2698310545de38ae177500b741b9cc69edc04"],[4,"6c5d0db00d8984439ad05b670808324300ce97c5f273c5016e2002153d69bbb3"],[5,"982c99bacfb7c475a80cdc7236b75e4080752db5494392a3135f2c288b941e0d"],[5,"cc5953191f316aee20130656f066831e8ff60ae58a0bd4bfbbba2909d9239c71"],[3,"5ba2455c833d6ed3c0aac55d0582d5f7a60c83596bd2136ece9d4c82ec275a65"],[3,"93d0b5f665a83a08d3a932b40d95a1ad86b24e212e84fe0e25a5c0270712f88c"],[3,"66d94387569600795c8bd852d6a7e4c3301d58ebff92f47a18eaa75f94401ce2"],[3,"50db583bc523875bbfcaa5aee000e648976b4224a91e9caaf7d26da3f8635500"],[3,"fd6c6a7376ee49410c8355904bb0c1d01c7ea9a4493339f89ecd5288d8327efa"],[3,"4425c3094f1367348edb6a31d52d112eaa437b798939b64e3b580696ad75b859"],[3,"d570d5677c78581c1c5d8a1f6141f4c50c1f538badde113c3ac3240e510a3702"]];
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

test('OIBC section uses the retrospective numbers', () => {
  const body = html.split('OIBC 경진대회')[1].split('</details>')[0];
  assert.ok(!body.includes('+1,134만') && !body.includes('+507만'), 'removed OIBC tiles still shown');
  for (const t of ['253개', '82%', '+2,394만', '−15.9%', 'GFS', 'CAMS']) {
    assert.ok(body.includes(t), `OIBC body missing ${t}`);
  }
  assert.ok(!body.includes('4.2%'), 'old interim 4.2% figure still shown');
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

test('projects are closed toggles showing only the title', () => {
  assert.ok(/<h2[^>]*>Projects<\/h2>/.test(html), 'no "Projects" heading');
  const toggles = [...html.matchAll(/<details([^>]*)>\s*<summary[^>]*>([\s\S]*?)<\/summary>/g)];
  assert.equal(toggles.length, 3, 'expected 3 project toggles');
  for (const [, attrs, summary] of toggles) {
    assert.ok(!/\bopen\b/.test(attrs), 'toggles should start closed');
    const text = summary.replace(/<[^>]+>/g, '').trim();
    assert.ok(!/대표|·/.test(text), `summary should be the title only, got: ${text}`);
  }
});

test('every project body is 문제 정의 → 역할 → 기술 → 결과 only', () => {
  const bodies = [...html.matchAll(/<\/summary>([\s\S]*?)<\/details>/g)].map((m) => m[1]);
  assert.equal(bodies.length, 3);
  for (const body of bodies) {
    const heads = [...body.matchAll(/<h4[^>]*>([^<]+)<\/h4>/g)].map((m) => m[1].trim());
    assert.deepEqual(heads, ['문제 정의', '역할', '기술', '결과']);
  }
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

test('no pill-shaped chips anywhere', () => {
  const css = walk(dist).filter((f) => f.endsWith('.css')).map((f) => readFileSync(f, 'utf8')).join('\n')
    + [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1]).join('\n');
  assert.ok(!/border-radius:\s*999px/.test(css), 'pill radius (999px) still in CSS');
  const tagRule = css.match(/\.tags li\s*\{([^}]*)\}/);
  assert.ok(tagRule && !/border:|background:/.test(tagRule[1]), '.tags li should have no border/background');
});

test('no rounded boxes anywhere except the round avatar', () => {
  const css = walk(dist).filter((f) => f.endsWith('.css')).map((f) => readFileSync(f, 'utf8')).join('\n')
    + [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1]).join('\n');
  const radii = [...css.matchAll(/([^{}]+)\{[^}]*border-radius:\s*([^;}]+)/g)].map((m) => [m[1].trim(), m[2].trim()]);
  const bad = radii.filter(([sel, v]) => !(sel.includes('.avatar') && v === '50%'));
  assert.deepEqual(bad, [], `rounded boxes remain: ${JSON.stringify(bad)}`);
  for (const sel of ['.btn', '.stat', '.project']) {
    const rule = css.match(new RegExp(sel.replace('.', '\\.') + '\\s*\\{([^}]*)\\}'));
    assert.ok(rule && !/(^|;)\s*border:\s*1px/.test(rule[1]) && !/background:\s*var\(--soft\)/.test(rule[1]), `${sel} still drawn as a box`);
  }
});

test('project titles use the same plain 16px text as Education rows', () => {
  const css = walk(dist).filter((f) => f.endsWith('.css')).map((f) => readFileSync(f, 'utf8')).join('\n')
    + [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1]).join('\n');
  const rules = [...css.matchAll(/\.ptitle\s*\{([^}]*)\}/g)].map((m) => m[1]);
  assert.ok(rules.length > 0, 'no .ptitle rule');
  for (const r of rules) {
    const size = r.match(/font-size:\s*(\d+)px/);
    assert.ok(!size || Number(size[1]) <= 16, `.ptitle font-size too large: ${size && size[1]}px`);
    assert.ok(!/font-weight:\s*(600|700|bold)/.test(r), '.ptitle should not be bold');
  }
});

test('project toggle titles are the short names', () => {
  const titles = [...html.matchAll(/<summary[^>]*>([\s\S]*?)<\/summary>/g)].map((m) => m[1].replace(/<[^>]+>/g, '').trim());
  assert.deepEqual(titles, ['IBA ML 회귀 토이 프로젝트', 'IBA ML 분류 토이 프로젝트', 'OIBC 경진대회']);
});

test('every result number has a short one-line label', () => {
  const bodies = [...html.matchAll(/<\/summary>([\s\S]*?)<\/details>/g)].map((m) => m[1]);
  assert.equal(bodies.length, 3);
  for (const body of bodies) {
    const result = body.split(/<h4[^>]*>결과<\/h4>/)[1];
    assert.ok(result, 'no 결과 section');
    assert.ok(!/<p[\s>]/.test(result), '결과 should have no prose paragraphs');
    assert.ok(!/<img/.test(result), '결과 should have no images');
    assert.ok(!/<figcaption/.test(result), '결과 should have no captions');
    const tiles = [...result.matchAll(/<div class="stat(?: best)?"([^>]*)>([\s\S]*?)<\/div>/g)];
    assert.ok(tiles.length >= 2, `expected >=2 number tiles, got ${tiles.length}`);
    for (const [, attrs, inner] of tiles) {
      assert.ok(/title="[^"]+"/.test(attrs), 'tile should keep the long explanation as a hover title');
      const value = inner.match(/<b[^>]*>([^<]+)<\/b>/);
      assert.ok(value && /\d/.test(value[1]), 'tile value should be a number');
      const label = inner.match(/<span class="stat-label"[^>]*>([^<]+)<\/span>/);
      assert.ok(label, `tile ${value && value[1]} has no short label`);
      const text = label[1].trim();
      assert.ok(text.length <= 16, `label too long (${text.length}): ${text}`);
      assert.ok(!/[()]/.test(text), `label should be one plain phrase: ${text}`);
    }
  }
});
test('IBA result tiles show the verified leaderboard numbers', () => {
  const body = html.split('<span class="ptitle">IBA ML 회귀 토이 프로젝트')[1].split('</details>')[0];
  for (const t of ['2,010.31', '2,122.44', '−5.3%', '0.9563']) assert.ok(body.includes(t), `IBA missing ${t}`);
  assert.ok(!/<b>31회<\/b>/.test(body), '31회 tile should be removed');
});

test('footer has no divider line above it', () => {
  const css = walk(dist).filter((f) => f.endsWith('.css')).map((f) => readFileSync(f, 'utf8')).join('\n')
    + [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1]).join('\n');
  const rule = css.match(/(?:^|[}\s])footer\s*\{([^}]*)\}/);
  assert.ok(rule, 'no footer rule');
  assert.ok(!/border-top/.test(rule[1]), 'footer still draws a top border');
});

test('OIBC lives in its own Contest section below Projects', () => {
  const proj = html.search(/<h2[^>]*>Projects<\/h2>/);
  const contest = html.search(/<h2[^>]*>Contest<\/h2>/);
  assert.ok(contest > proj, 'Contest heading missing or not below Projects');
  const projSection = html.slice(proj, contest);
  const contestSection = html.slice(contest);
  assert.ok(!projSection.includes('OIBC 경진대회'), 'OIBC should not be under Projects');
  assert.ok(/<details class="project"[\s\S]*?OIBC 경진대회/.test(contestSection), 'OIBC toggle missing under Contest');
});

test('each toggle group closes with its own bottom line', () => {
  const css = walk(dist).filter((f) => f.endsWith('.css')).map((f) => readFileSync(f, 'utf8')).join('\n')
    + [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1]).join('\n');
  assert.ok(/\.toggle-list>?\s*>?\s*\.project:last-child\s*\{[^}]*border-bottom/.test(css), 'no per-group bottom line rule');
  const groups = [...html.matchAll(/<div class="toggle-list">([\s\S]*?)<\/div>\s*(?=<h2|<footer)/g)];
  assert.equal(groups.length, 2, 'Projects and Contest should each have a toggle-list');
});

test('classification project shows the deck numbers under Projects', () => {
  const proj = html.slice(html.search(/<h2[^>]*>Projects<\/h2>/), html.search(/<h2[^>]*>Contest<\/h2>/));
  const body = proj.split('<span class="ptitle">IBA ML 분류 토이 프로젝트')[1];
  assert.ok(body, 'classification toggle missing under Projects');
  assert.ok(!/<b>5 : 1<\/b>/.test(body) && !/<b>81 · 17 · 102<\/b>/.test(body), 'removed classification tiles still shown');
  assert.ok(/<b>21종<\/b><span class="stat-label">비교한 모델 수<\/span>/.test(body), '21종 label should read 비교한 모델 수');
  for (const t of ['800명', '0.6667', '21종', '팀장', '비용행렬']) {
    assert.ok(body.includes(t), `classification project missing ${t}`);
  }
});

test('OIBC result leads with the final rank', () => {
  const body = html.split('<span class="ptitle">OIBC 경진대회')[1].split('</details>')[0];
  const result = body.split(/<h4[^>]*>결과<\/h4>/)[1];
  const first = result.match(/<div class="stat best"[^>]*><b>([^<]+)<\/b><span class="stat-label">([^<]+)<\/span>/);
  assert.ok(first, 'no highlighted first tile');
  assert.equal(first[1], '78위');
  assert.equal(first[2], '385팀 중 상위 20%');
});
