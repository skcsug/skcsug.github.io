# skcsug.github.io

데이터·머신러닝 포트폴리오 — https://skcsug.github.io/

## 로컬에서 보기

```bash
npm install
npm run dev      # http://localhost:4321 에서 저장할 때마다 바로 반영
npm test         # 빌드 + 검사 (필수 항목, 이미지 경로, 이력서 버튼, 비공개 정보 노출 여부)
```

## 내용 고치기

- 문구·수치·프로젝트는 전부 `src/data/profile.ts` 한 파일에서 고칩니다.
- 이력서: `src/data/resume.ts`를 고친 뒤 `npm run resume` → `public/resume.pdf`가 다시 만들어집니다 (Chrome 필요). 커밋·push하면 사이트에 반영됩니다.
- 결과 숫자: 각 프로젝트의 `stats`에 `{ value, label }`로 넣습니다. IBA 숫자는 `rmse` 기록에서 자동 계산됩니다.

`main`에 push하면 GitHub Actions가 테스트 → 빌드 → 배포를 자동으로 합니다.
