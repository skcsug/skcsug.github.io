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
- 이력서: PDF를 `public/resume.pdf`로 넣고 `profile.ts`의 `resumeUrl`을 `'/resume.pdf'`로 바꾸면 버튼이 켜집니다.
- 결과 숫자: 각 프로젝트의 `stats`에 `{ value, label }`로 넣습니다. IBA 숫자는 `rmse` 기록에서 자동 계산됩니다.

`main`에 push하면 GitHub Actions가 테스트 → 빌드 → 배포를 자동으로 합니다.
