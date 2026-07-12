# 혜택픽

rabbitlogs.com 코드베이스를 베이스로 만든 정부 지원금·혜택 블로그.
Astro 기반, 콘텐츠는 Markdown 파일로 관리합니다.

- 도메인: mybenepick.com (구입 완료)
- 브랜드명: 혜택픽
- 폰트: Pretendard 단일 사용 (본문/제목 모두)
- 톤: 담백한 대화체

## 지금 상태

- 사이트 구조(카테고리, 글 상세, RSS, 검색, 광고 자동배치·현재 비활성화, 라이트박스 등) 구축 완료
- 다람쥐 마스코트 실제 이미지 적용 완료 (히어로, 헤더 로고, 파비콘, OG 썸네일)
- 첫 글 1편 등록 완료: `src/content/blog/childcare-advance-payment-income-limit-abolished.md`
- 로컬 빌드 확인 완료 (`npm run build` 정상 통과, 전 페이지 200 응답 확인)

## 발행 전 반드시 처리해야 할 TODO

1. **애드센스 승인 후 스위치 켜기**
   - 아직 애드센스 미신청 상태라, 광고 관련 코드는 전부 렌더링되지 않도록 꺼둔 상태입니다.
   - 아래 5개 파일 상단의 `const ADSENSE_ENABLED = false;`를 **모두** `true`로 바꿔야 광고가 다시 나옵니다.
     - `src/layouts/BaseLayout.astro`
     - `src/layouts/PostLayout.astro`
     - `src/pages/category/[cat].astro`
     - `src/pages/new.astro`
     - `src/pages/regional.astro`
   - 계정은 rabbitlogs.com과 동일(`ca-pub-9488002130804570`)하게 쓰기로 했으니, 애드센스 대시보드에서 **mybenepick.com을 사이트로 추가하고 이 도메인 전용 광고 단위를 새로 발급**받아 `src/components/AdSense.astro`, `AdSenseList.astro`의 `AD_SLOT`(및 `AD_LAYOUT_KEY`) 플레이스홀더를 교체하세요.
   - `public/ads.txt`는 계정이 같아서 그대로 유효합니다.

2. **다람쥐 이미지 추가 정리 (선택)**
   - `public/images/hero-squirrel.png`(홈/소개 페이지용), `public/squirrel-logo.png`(헤더/파비콘용)는 업로드해주신 원본에서 크롭·리사이즈해 적용했습니다.
   - `public/images/squirrel-original.png`에 원본 고해상도본을 보관해뒀어요 — 다른 사이즈나 용도가 필요하면 여기서 다시 크롭하면 됩니다.
   - `favicon.png`, `apple-touch-icon.png`, `og-thumbnail.jpg`도 실제 다람쥐 이미지 기반으로 이미 생성했습니다.

3. **Cloudflare Web Analytics 등 분석 도구**
   - rabbitlogs.com에 있던 Cloudflare 애널리틱스 스니펫은 제거된 상태입니다. 필요하면 이 사이트용 새 토큰으로 다시 추가하세요.

## 카테고리 구조 (4개로 압축)

- `self-employed` 소상공인·자영업자
- `youth` 청년
- `parenting` 육아·출산 (한부모가족 포함)
- `common` 전국민·중장년 (기존 "중장년·은퇴"와 "전국민 공통"을 통합)

지역 특화 콘텐츠는 별도 카테고리가 아니라 **태그**로 처리합니다 — 카테고리(대상자)와 지역성이 동시에 성립하는 경우가 많아서(예: "서울시 청년 지원금" = 청년 카테고리 + 지역특화 태그)예요.

콘텐츠 태그(`contentTags` 필드, 배열, 복수 선택 가능):
- `new` 신설·변경 — `/new` 페이지에 자동 노출
- `regional` 지역특화 — `/regional` 페이지에 자동 노출
- `deep-guide` 심층가이드

글 작성 시 frontmatter 예시는 기존 글(`src/content/blog/childcare-advance-payment-income-limit-abolished.md`) 참고하세요.

## 남은 콘텐츠 작업

첫 달 16편 콘텐츠 계획 중 1편만 완성된 상태입니다. 나머지 글감(근로장려금 자격조회, 청년 전세자금대출, 지역별 청년지원금 등)은 이전에 정리한 발행 파이프라인(검색 → 교차검증 → 초안 → 최소검수 4대 체크리스트)을 따라 이어서 제작하면 됩니다.

## 로컬 실행

```bash
npm install
npm run dev       # 개발 서버
npm run build     # 정적 빌드 (dist/ 생성 + pagefind 검색 색인)
npm run preview   # 빌드 결과 미리보기
```
