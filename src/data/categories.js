// 카테고리 slug → 표시 이름 매핑. 이 파일이 유일한 소스이며,
// PostCard, PostLayout, category/[cat].astro, find.astro 등에서 공통으로 가져다 쓴다.
// 카테고리를 추가/변경할 때는 이 파일과 src/content/config.ts의 enum만 함께 수정하면 된다.
//
// 2026-07 개편: 기존 7개(youth / job-startup / parenting / housing / self-employed /
// senior / common)를 4개로 통합했다. 카테고리당 글 수가 3건 내외로 얇으면 검색엔진에서
// "빈약한 색인 페이지"로 취급되기 쉬워, 대상자 축을 넓게 잡아 카테고리당 최소 4건
// 이상을 유지하는 것을 원칙으로 한다.
export const CATEGORY_NAMES = {
  youth: '청년·취업',
  parenting: '육아·출산',
  living: '생활·주거',
  'self-employed': '소상공인',
};

// category/[cat].astro 페이지 제목처럼 조금 더 풀어 쓰는 버전이 필요한 곳에서 사용
export const CATEGORY_NAMES_LONG = {
  youth: '청년·취업',
  parenting: '육아·출산',
  living: '생활·주거·노후',
  'self-employed': '소상공인·자영업',
};

// 구 카테고리 slug → 신 slug. 기존 색인·외부 링크로 /category/{구slug} 에 들어온
// 방문자를 새 주소로 넘겨주기 위해 사용한다.
export const LEGACY_CATEGORY_REDIRECTS = {
  'job-startup': 'youth',
  housing: 'living',
  senior: 'living',
  common: 'living',
};
