// 카테고리 slug → 표시 이름 매핑. 이 파일이 유일한 소스이며,
// PostCard, PostLayout, category/[cat].astro, find.astro 등에서 공통으로 가져다 쓴다.
// 카테고리를 추가/변경할 때는 이 파일과 src/content/config.ts의 enum만 함께 수정하면 된다.
export const CATEGORY_NAMES = {
  'self-employed': '소상공인',
  'job-startup': '취업·창업',
  youth: '청년',
  parenting: '육아·출산',
  housing: '주거',
  senior: '중장년·시니어',
  common: '전국민 공통',
};

// category/[cat].astro 페이지 제목처럼 조금 더 풀어 쓰는 버전이 필요한 곳에서 사용
export const CATEGORY_NAMES_LONG = {
  'self-employed': '소상공인·자영업',
  'job-startup': '취업·창업',
  youth: '청년',
  parenting: '육아·출산',
  housing: '주거',
  senior: '중장년·시니어',
  common: '전국민 공통',
};
