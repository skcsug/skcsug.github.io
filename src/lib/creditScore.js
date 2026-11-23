// 대출 심사 시뮬레이터: german-credit-risk 저장소의 model/lr_model.json으로 브라우저에서 점수를 계산합니다.
// Python의 credit/export.py score_from_export와 같은 계산입니다 (tests/credit.test.mjs가 30명으로 대조).

function features(spec, a) {
  const m = spec.maps;
  return {
    Age: a.Age,
    Job: a.Job,
    Saving_ord: m.saving[a['Saving accounts']],
    Saving_none: a['Saving accounts'] === 'no_account' ? 1 : 0,
    Checking_ord: m.checking[a['Checking account']],
    Checking_none: a['Checking account'] === 'no_account' ? 1 : 0,
    'Credit amount': a['Credit amount'],
    Duration: a.Duration,
    log_Monthly_payment: Math.log(a['Credit amount'] / a.Duration),
    Housing: a.Housing === 'own' ? 'own' : 'non_own',
    Purpose: m.purpose[a.Purpose],
  };
}

// 칼럼별 로짓 기여도 (평균적인 신청자 대비, 표준화 단위)
function contributions(spec, a) {
  const f = features(spec, a);
  const out = {};
  for (const [col, p] of Object.entries(spec.numeric)) {
    out[col] = spec.coef[`num__${col}`] * (f[col] - p.mean) / p.scale;
  }
  for (const [col, cats] of Object.entries(spec.categorical)) {
    out[col] = cats.includes(f[col]) ? spec.coef[`cat__${col}_${f[col]}`] : 0;
  }
  return out;
}

export function scoreApplicant(spec, applicant) {
  const z = spec.intercept + Object.values(contributions(spec, applicant)).reduce((s, v) => s + v, 0);
  return 1 / (1 + Math.exp(-z));
}

export function decide(spec, pBad) {
  if (pBad < spec.policy.approve_below) return 'approve';
  if (pBad < spec.policy.review_below) return 'review';
  return 'reject';
}

const GROUPS = {
  '당좌 잔고': ['Checking_ord', 'Checking_none'],
  '저축 잔고': ['Saving_ord', 'Saving_none'],
  '대출 금액': ['Credit amount'],
  '월 상환액': ['log_Monthly_payment'],
  '상환 기간': ['Duration'],
  '나이': ['Age'],
  '직업 숙련도': ['Job'],
  '주거 형태': ['Housing'],
  '대출 목적': ['Purpose'],
};

// 위험을 가장 많이 올린 요인 최대 3개 (없으면 위험을 가장 많이 낮춘 요인)
export function explain(spec, applicant) {
  const c = contributions(spec, applicant);
  const items = Object.entries(GROUPS).map(([label, cols]) => ({ label, effect: cols.reduce((s, k) => s + c[k], 0) }));
  const raising = items.filter((i) => i.effect > 0.05).sort((x, y) => y.effect - x.effect);
  if (raising.length) return raising.slice(0, 3);
  return items.sort((x, y) => x.effect - y.effect).slice(0, 3);
}
