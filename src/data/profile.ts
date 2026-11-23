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
  stack: ['Python', 'pandas', 'scikit-learn', 'LightGBM', 'XGBoost', 'CatBoost', 'matplotlib', 'Git / GitHub'],
  // 이력서 PDF를 public/resume.pdf에 넣은 뒤 '/resume.pdf'로 바꾸면 버튼이 켜집니다.
  resumeUrl: null as string | null,
};

export const featured = {
  title: '영국 중고차 가격 예측',
  period: '2026.11 · IBA 회귀 대회 · 3인 팀',
  problem:
    '차종·연식·주행거리·연료·배기량 등으로 영국 중고차의 판매 가격을 예측하는 회귀 문제입니다(평가 지표 RMSE). ' +
    '대회 측이 학습 데이터(train)에서만 자동차세·연비·주행거리 값을 무작위로 지워 두었고, 테스트 데이터에는 빈칸이 없었습니다. ' +
    '그래서 "비어 있다"는 사실 자체보다, 빈칸을 같은 차종·연식 차들의 값으로 얼마나 그럴듯하게 채우느냐가 핵심이었습니다.',
  role: [
    '팀 리드: 저장소 구조와 공용 코드(데이터 로드, 피처 생성, 설정)를 설계하고 관리',
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
  result:
    '팀 전체 31번 제출(기록된 제출 27건) 동안 Public RMSE를 첫 제출 2,122.44에서 최종 선택한 #19의 2,010.31까지 낮췄습니다(약 5.3% 개선, R² 0.9563).',
  lesson:
    '가장 크게 배운 점은 "CV 점수가 좋아져도 Public 점수는 나빠질 수 있다"는 것입니다. ' +
    '튜닝을 더 해서 CV가 좋아진 제출이 오히려 Public에서 밀린 적이 여러 번 있었고, ' +
    '그 뒤로는 점수 하나보다 fold별 편차와 여러 seed의 평균을 보고 판단하도록 기준을 바꿨습니다.',
  demo: null as string | null,
  source: '팀 저장소(비공개)',
  figures: [
    { src: '/figures/02_missing_by_column.png', caption: '빈칸은 train에만 있음 — 주행거리 1.3%, 자동차세 8.7%, 연비 9.5%' },
    { src: '/figures/04_imputation_error.png', caption: '비슷한 차들의 최빈값으로 채우면 전체 중앙값보다 오차가 3~6배 작음' },
    { src: '/figures/06_price_by_year.png', caption: '연식별 가격 분포' },
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
};

export const others = [
  {
    title: 'OIBC 2026 태양광 하루 전 발전량 예측',
    summary:
      '여러 태양광 발전소를 묶은 집합자원의 다음 날 발전량을 기상 예보로 예측하는 팀 대회(POSTECH·KAIST·UNIST 주최). ' +
      '전처리·예보 피처 확장·눈 보정으로 2024년 검증 페널티를 4.2% 줄였고, 2단계 보정을 더하면 약 8.0%까지 줄었습니다. ' +
      '시드 10개 앙상블로 실행마다 흔들리던 점수 편차(0.3~0.6%)도 0.02~0.14%로 안정시켰습니다.',
    tags: ['LightGBM', '시계열', '에너지'],
  },
  {
    title: '뜰까말까 — 김해공항 항공편 지연 예측 웹서비스',
    summary:
      '편명과 날짜를 넣으면 한국공항공사 운항 정보와 기상청 예보·특보를 묶어 지연 가능성을 점수로 보여주는 웹서비스입니다. ' +
      '공공데이터포털 API 여러 개를 연동했습니다.',
    tags: ['Node.js', 'jQuery', '공공데이터 API'],
  },
];
