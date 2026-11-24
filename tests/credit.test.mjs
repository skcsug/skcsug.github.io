import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { scoreApplicant, decide, explain } from '../src/lib/creditScore.js';

const spec = JSON.parse(readFileSync(new URL('../src/data/credit-model.json', import.meta.url), 'utf8'));
const samples = JSON.parse(readFileSync(new URL('./fixtures/credit_samples.json', import.meta.url), 'utf8'));

test('browser scoring matches the Python model on 30 real applicants', () => {
  for (const s of samples) {
    const p = scoreApplicant(spec, s);
    assert.ok(Math.abs(p - s.expected_p_bad) < 1e-9, `mismatch: ${p} vs ${s.expected_p_bad}`);
  }
});

test('decision bands follow the exported cost-matrix policy', () => {
  const { approve_below: a, review_below: r } = spec.policy;
  assert.equal(decide(spec, a - 0.001), 'approve');
  assert.equal(decide(spec, a), 'review');
  assert.equal(decide(spec, r - 0.001), 'review');
  assert.equal(decide(spec, r), 'reject');
});

test('explanation names the strongest risk factors', () => {
  const risky = { Age: 22, Job: 1, Housing: 'rent', 'Saving accounts': 'little', 'Checking account': 'little', 'Credit amount': 12000, Duration: 48, Purpose: 'business' };
  const reasons = explain(spec, risky);
  assert.ok(reasons.length >= 1 && reasons.length <= 3);
  assert.ok(reasons.every((r) => typeof r.label === 'string' && r.label.length > 0));
  assert.ok(reasons[0].effect > 0, 'top reason for a risky applicant should raise risk');
});

test('demo page is built and linked from the classification project', () => {
  const dist = new URL('../dist/', import.meta.url);
  assert.ok(existsSync(new URL('credit-demo/index.html', dist)), 'demo page missing');
  const demo = readFileSync(new URL('credit-demo/index.html', dist), 'utf8');
  for (const t of ['대출 심사 시뮬레이터', '승인', '심사역 검토', '자동 거절', 'github.com/skcsug/german-credit-risk']) {
    assert.ok(demo.includes(t), `demo missing ${t}`);
  }
  const home = readFileSync(new URL('index.html', dist), 'utf8');
  const cls = home.split('<span class="ptitle">대출 부실 예측 모델과 승인 정책')[1].split('</article>')[0];
  assert.ok(/href="\/credit-demo\/"/.test(cls), 'classification project should link the demo');
  assert.ok(/href="https:\/\/github\.com\/skcsug\/german-credit-risk"/.test(cls), 'classification project should link the source');
});
