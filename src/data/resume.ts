// 이력서(PDF) 내용은 전부 이 파일에서 고칩니다.
// 고친 뒤 `npm run resume`을 실행하면 public/resume.pdf가 다시 만들어집니다.
// 공개 PDF이므로 전화번호는 넣지 않습니다.
// 프로젝트 이름은 사이트(profile.ts)의 제목을 그대로 가져와 사이트와 이력서가 항상 같게 유지됩니다.
import { featured, otherProjects, contests } from './profile';

export const header = {
  name: '정현찬',
  role: '데이터 분석가',
  school: '부산대학교 정보컴퓨터공학부 컴퓨터공학전공 재학',
  schoolNote: '(편입, 2028.08 졸업 예정)',
  intro: [
    '데이터로 더 나은 결정을 돕는 분석가를 목표로 합니다.',
    '데이터 분석에서 멈추지 않고, 경영 의사결정에 바로 쓸 수 있는 제언까지 만듭니다.',
    '팀장으로 프로젝트를 이끌며 분석 파이프라인과 실험 기준을 설계하고, 기록·문서화를 자동화했습니다.',
    '금융(대출 심사), 에너지(태양광 발전량), 중고차 가격 등 다양한 도메인의 데이터를 다뤘습니다.',
  ],
  contacts: [
    { label: '이메일', value: 'guscks728@naver.com' },
    { label: 'GitHub', value: 'skcsug' },
    { label: '포트폴리오', value: 'skcsug.github.io' },
  ],
};

export const projects = [
  {
    name: contests[0].title,
    period: '2026.10 ~ 2026.11.13',
    summary: '태양광 발전량 예측 경진대회, 5명 팀의 팀장',
    badge: '385팀 중 78위',
    stack: 'Python, pandas, LightGBM, XGBoost, CatBoost, PyTorch(MLP), NOAA GFS·GEFS, ECMWF, Copernicus CAMS, 기상청 LDAPS, 클라우드 VM',
    sections: [
      { title: '문제', items: ['전국 253개 태양광 발전소의 다음 날 시간별 발전량을 예측해 두 집합자원으로 묶어 제출하고, 예측 오차만큼 정산금에서 페널티가 깎이는 대회입니다.'], list: false },
      {
        title: '결과',
        items: [
          '최종 순위 **385팀 중 78위**(상위 약 20%)',
          '정산금 첫 제출 대비 **+2,394만 원**(6,444,957,097 → 6,468,895,230원), 내부 검증 페널티 3년 합 **−15.9%**',
        ],
        list: true,
      },
      {
        title: '주요 작업',
        items: [
          '외부 예보 GFS·GEFS를 1단계 피처로 추가: 정산금 **+1,134만 원**, 검증 3년 합 **−6.44%**',
          '2단계 보정(전국 합계 오차 재학습): 리더보드 페널티 **−2.8%**, 정산금 **+507만 원**',
          '정보 한계 진단: 실제 관측 날씨를 넣어도 페널티 **−25.8%**뿐 → 모델 구조 대신 새 입력 정보로 방향 전환',
          '판정 원칙: 채택 기준을 결과 전에 기록, 검증 2023·2024 **두 해 모두** 좋아질 때만 채택',
          '재현성: 제출마다 커밋·명령·환경·파일 해시 기록, PC·VM 간 정산금 원 단위 일치 확인',
        ],
        list: true,
      },
    ],
  },
  {
    name: otherProjects[0].title,
    period: '2026.09',
    summary: 'IBA 분류 과제, 팀장 · 보완 발표 발표자',
    badge: 'F1 0.6667',
    stack: 'Python, pandas, scikit-learn, Optuna, 로지스틱 회귀, 랜덤포레스트',
    sections: [
      { title: '문제', items: ['서독 은행 대출 신청자 800명으로 연체 위험을 예측하고, 그 결과를 실제 대출 승인 기준으로 바꾸는 과제입니다.'], list: false },
      {
        title: '결과',
        items: [
          '최종 F1 **0.6522 → 0.6667**(1차 발표 대비 +1.45%p), 31회 제출 중 최고',
          '승인 · 심사역 검토 · 자동 거절 3단계 기준과 우량 고객 맞춤 대출 상품 3종 제안',
        ],
        list: true,
      },
      {
        title: '주요 작업',
        items: [
          '21종 모델 비교, 5-Fold × 3회 반복 교차검증, Pipeline으로 데이터 누수 차단',
          '제출 결과 사람 단위 비교: 보팅과 로지스틱 회귀가 **190/200명** 일치, 5명 교체로 적중 1명 손실 → 최종 모델 로지스틱 회귀로 재선정',
          '비용행렬(부실 승인 5 : 우량 거절 1) 임계값 최적화: 기대 비용 최소 **443** → 승인 **81** · 검토 **17** · 거절 **102**명',
          '결측을 "계좌 없음" 범주로 분리, 파생 변수 log(월 상환액), 성별 변수는 공정성 검토 후 제외(F1 변동 없음)',
        ],
        list: true,
      },
    ],
  },
  {
    name: featured.title,
    period: '2026.11',
    summary: '3명 팀의 팀장',
    badge: 'RMSE −5.3%',
    stack: 'Python, pandas, scikit-learn, LightGBM, XGBoost, CatBoost, Git(PR 협업)',
    sections: [
      { title: '문제', items: ['학습 데이터에만 무작위로 지워진 자동차세·연비·주행거리를 채우며 중고차 가격을 예측하는 회귀 대회(RMSE)입니다.'], list: false },
      {
        title: '결과',
        items: ['Public RMSE **2,122.44 → 2,010.31**(−5.3%), R² **0.9563**'],
        list: true,
      },
      {
        title: '주요 작업',
        items: [
          '공용 파이프라인 설계: "단계 하나 = 파일 하나" 규칙으로 3명이 Git 충돌 없이 병렬 작업',
          'OOF 기반 앙상블 가중치 최적화, seed **10개** 평균으로 점수 흔들림 감소',
          '실험 자동 기록: 피처 버전·커밋·CV 점수 저장, 팀 제출 **31회** 로그 관리와 최종 제출 선택',
          'CV와 Public 불일치 분석: CV가 좋아진 튜닝이 Public에서 **3번** 뒤집힘 → 확실하지 않은 개선은 채택하지 않는 기준 수립',
        ],
        list: true,
      },
    ],
  },
];

export const tables = {
  education: [
    { left: '부산대학교 정보컴퓨터공학부 컴퓨터공학전공 편입', right: '2026.03 ~ 2028.08 예정' },
    { left: '전남대학교 소프트웨어공학과(GPA 4.06/4.5)', right: '2021.03 ~ 2026.02' },
  ],
  activities: [{ left: 'IBA(Intelligent Business Analytics) 지능형 경영 분석 학회 12기', right: '2026.08 ~' }],
  language: [{ left: 'TOEIC', right: '980/990' }],
  contests: [{ left: `${contests[0].title} 385팀 중 78위`, right: '2026.11' }],
};
