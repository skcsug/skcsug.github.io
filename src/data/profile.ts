// 사이트에 보이는 문구와 수치는 전부 이 파일에서 고칩니다.
// 고친 뒤 `npm run dev`로 띄워 두면 저장할 때마다 화면이 바로 바뀝니다.

export const profile = {
  nickname: 'skcsug',
  tagline: '의사결정을 돕는 데이터 분석가 지망생',
  github: 'https://github.com/skcsug',
  goal: '데이터와 머신러닝으로 경영진의 의사결정을 돕는 데이터 분석가를 목표로 합니다.',
  interests: [
    '문제 정의 — 경영진이 실제로 내려야 하는 결정에서 출발해, 데이터로 답할 질문을 세우는 일',
    '예측과 분석 — 머신러닝 예측과 통계 분석으로 선택지별 결과와 위험을 숫자로 보여주는 일',
    '전달과 제안 — 분석 결과를 시각화·요약하여 다음 의사결정에 관해 조언하는 일',
  ],
  skills: ['Python', 'ML', 'C/C++', 'CSS/HTML/JavaScript'],
  // 이력서 PDF를 public/resume.pdf에 넣은 뒤 '/resume.pdf'로 바꾸면 버튼이 켜집니다.
  resumeUrl: null as string | null,
};

export const education = [
  { degree: 'B.S.', major: 'Computer Science & Engineering', school: 'Pusan National University', period: '2026 ~' },
];

export const activities = [
  { name: 'Intelligent Business Analytics (IBA)', sub: '지능형 경영 분석 학회 · 12th Cohort Member', period: '2026.08 ~' },
];

export const featured = {
  title: 'IBA ML 회귀 토이 프로젝트',
  problem:
    '차종·연식·주행거리·연료·배기량 등으로 영국 중고차의 판매 가격을 예측하는 회귀 문제입니다(평가 지표 RMSE). ' +
    '대회 측이 학습 데이터(train)에서만 자동차세·연비·주행거리 값을 무작위로 지워 두었고, 테스트 데이터에는 빈칸이 없었습니다. ' +
    '그래서 "비어 있다"는 사실 자체보다, 빈칸을 같은 차종·연식 차들의 값으로 얼마나 그럴듯하게 채우느냐가 핵심이었습니다.',
  role: [
    'IBA 회귀 대회(2026.11) 3인 팀의 팀 리드: 저장소 구조와 공용 코드(데이터 로드, 피처 생성, 설정)를 설계하고 관리',
    '전처리·피처를 "단계 하나 = 파일 하나"로 나눠 팀원끼리 Git 충돌 없이 병렬 작업하도록 규칙 설계',
    '모델 래퍼(LightGBM·XGBoost·CatBoost), 5-Fold CV 학습 루프, 하이퍼파라미터 튜닝 담당',
    'OOF(교차검증 밖 예측) 기반 앙상블 가중치 최적화와 최종 제출 선택',
    '실험마다 피처 버전·커밋·CV 점수를 자동 기록하는 실험 관리 체계 구축',
  ],
  tech: [
    'Python · pandas · NumPy · scikit-learn',
    'LightGBM · XGBoost · CatBoost (log 타깃 / 원래 타깃 모델 혼합)',
    '5-Fold 교차검증, OOF 앙상블, seed 평균, 단조 제약',
    '그룹 최빈값·중앙값 기반 결측치 대체',
    'Git 브랜치·PR 협업, 제출 파일 자동 검증',
  ],
  // submissions/log.md의 정상 제출 기록 (제출 번호, Public RMSE)
  rmse: [
    { n: 1, rmse: 2122.44 }, { n: 2, rmse: 2128.45 }, { n: 3, rmse: 2063.54 },
    { n: 4, rmse: 2061.95 }, { n: 5, rmse: 2045.81 }, { n: 6, rmse: 2070.02 },
    { n: 7, rmse: 2048.6 }, { n: 9, rmse: 2056.89 }, { n: 10, rmse: 2035.87 },
    { n: 11, rmse: 2027.31 }, { n: 12, rmse: 2055.89 }, { n: 13, rmse: 2024.9 },
    { n: 14, rmse: 2036.15 }, { n: 15, rmse: 2036.36 }, { n: 16, rmse: 2030.41 },
    { n: 17, rmse: 2013.53 }, { n: 18, rmse: 2014.11 }, { n: 19, rmse: 2010.31 },
    { n: 20, rmse: 2017.4 }, { n: 23, rmse: 2012.91 }, { n: 24, rmse: 2019.05 },
    { n: 25, rmse: 2015.04 }, { n: 26, rmse: 2011.17 }, { n: 28, rmse: 2026.48 },
    { n: 29, rmse: 2013.15 }, { n: 30, rmse: 2024.42 }, { n: 31, rmse: 2028.12 },
  ],
  finalN: 19,
  r2: '0.9563',
  totalSubmissions: 31,
};

const fmtRmse = (v: number) => v.toLocaleString('en-US', { minimumFractionDigits: 2 });
const firstRmse = featured.rmse[0].rmse;
const finalRmse = featured.rmse.find((p) => p.n === featured.finalN)!.rmse;
export const featuredStats = [
  { value: fmtRmse(finalRmse), label: `최종 선택 #${featured.finalN} Public RMSE (첫 제출 ${fmtRmse(firstRmse)})` },
  { value: `−${(((firstRmse - finalRmse) / firstRmse) * 100).toFixed(1)}%`, label: 'RMSE 개선 폭' },
  { value: featured.r2, label: '최종 R²' },
  { value: `${featured.totalSubmissions}회`, label: '팀 전체 제출' },
];

// Contest 섹션에 보이는 대회
export const contests = [
  {
    title: 'OIBC 경진대회',
    problem:
      '전국 253개 태양광 발전소의 다음 날 시간별 발전량을 예측하고, 발전소를 두 집합자원(G1·G2)으로 묶어 제출하는 대회입니다(2026.10 ~ 11.13, 참가자 약 1,400명). ' +
      '점수는 "정산금 = 전력 판매 수입 − 페널티"이고, 그룹별 예측 오차만큼 페널티가 깎입니다. ' +
      '전날 17시까지 발행된 예보만 쓸 수 있고, 첫 제출의 그룹 구성을 끝까지 유지해야 했습니다. ' +
      '분석해 보니 페널티의 82%가 가중치가 큰 10~15시에, 특히 흐리다는 예보가 나온 날에 몰려 있었습니다.',
    role: [
      '5인 팀의 팀장: 실험 설계, 코드 통합, PR 리뷰, 제출 관리',
      '페널티 원인 분석으로 작업을 나누고, "작업 하나 = 브랜치 하나 = PR 하나" 규칙으로 노트북·데스크톱·클라우드 VM에서 병렬 실험 운영',
      '채택 기준을 결과를 보기 전에 문서로 남기고(사전 등록), 검증 2023·2024 두 해가 모두 좋아질 때만 채택하는 판정 원칙 운영',
      '제출마다 커밋·명령·환경·파일 해시를 기록해 다른 PC에서도 같은 값이 나오는지 확인',
    ],
    tech: [
      'Python · pandas · NumPy · scikit-learn · PyTorch',
      'LightGBM · XGBoost · CatBoost · MLP 앙상블 + 2단계 보정(전국 합계 오차를 다시 학습)',
      '외부 기상 예보 5종: NOAA GFS·GEFS, ECMWF, Copernicus CAMS, 기상청 LDAPS',
      'GitHub PR 협업, 클라우드 VM·원격 데스크톱 병렬 실험',
    ],
    stats: [
      { value: '+2,394만 원', label: '첫 제출 대비 정산금 (11/12 기준)' },
      { value: '−15.9%', label: '내부 검증 페널티 (3년 합)' },
      { value: '+1,134만 원', label: '외부 예보 GFS·GEFS 추가 효과' },
      { value: '+507만 원', label: '2단계 보정 효과' },
    ],
  },

];

// Projects 섹션에 대표 프로젝트 다음으로 보이는 프로젝트
export const otherProjects: typeof contests = [
  // 뜰까말까 — 잠시 숨김. 다시 보이게 하려면 아래 주석(//)을 지우세요.
  // {
  //   title: '뜰까말까',
  //   problem:
  //     '항공편이 지연될지는 출발 직전까지 알기 어렵습니다. ' +
  //     '김해공항 출발편의 편명과 날짜만 넣으면 실시간 운항 정보와 기상 예보·특보를 묶어 지연 가능성을 미리 보여주는 웹서비스를 만들었습니다.',
  //   role: [
  //     '개인 프로젝트(인터넷과 웹 기초 수업): 기획, 화면 설계, 프론트엔드·서버 개발 전부 담당',
  //     '기상 요인과 직전편 연쇄 지연을 합산하는 지연 확률 가중치 알고리즘 설계',
  //   ],
  //   tech: [
  //     'Node.js(Express) — 공공데이터 API 포워딩 서버',
  //     'HTML · CSS · JavaScript(jQuery, AJAX)',
  //     '공공데이터포털 API: 한국공항공사 출발·도착편, 기상청 단기예보·기상특보',
  //   ],
  //   stats: [
  //     { value: '4종', label: '연동한 공공데이터 API' },
  //     { value: '3가지', label: '결과 모드 (결항 · 확정 지연 · 예측)' },
  //     { value: '0~100점', label: '지연 확률 점수' },
  //   ],
  // },
];
