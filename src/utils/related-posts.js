// "같이 읽으면 좋은 글" 추천 로직.
//
// 이 글을 읽는 사람은 이미 이 글의 대상 조건(카테고리, 나이대, 직업상태, 소득수준)에
// 해당할 가능성이 높다는 전제로, 같은 조건대의 다른 글을 점수화해서 추천한다.
//
// 우선순위: 같은 category가 가장 강한 신호(+10) → eligibility 교집합으로 보충
// (ageRange 겹침 개수, employmentStatus 겹침 개수, incomeLevel 일치 각 +1~2) →
// 같은 contentTags(예: regional)는 보너스(+2). 정적 빌드 시점에 전체 글 목록을 놓고
// 계산하므로 클라이언트 필터링(/find)과 달리 서버(빌드타임)에서 한 번만 계산한다.

const SAME_CATEGORY_SCORE = 10;
const CONTENT_TAG_OVERLAP_SCORE = 2;
const AGE_OVERLAP_SCORE = 1.5;
const EMPLOYMENT_OVERLAP_SCORE = 1.5;
const INCOME_MATCH_SCORE = 1;

function overlapCount(a = [], b = []) {
  const setB = new Set(b);
  return a.filter((x) => setB.has(x)).length;
}

function scorePost(base, candidate) {
  let score = 0;

  if (base.category === candidate.category) {
    score += SAME_CATEGORY_SCORE;
  }

  const baseElig = base.eligibility || {};
  const candElig = candidate.eligibility || {};

  score += overlapCount(baseElig.ageRange, candElig.ageRange) * AGE_OVERLAP_SCORE;
  score += overlapCount(baseElig.employmentStatus, candElig.employmentStatus) * EMPLOYMENT_OVERLAP_SCORE;

  if (
    baseElig.incomeLevel &&
    candElig.incomeLevel &&
    baseElig.incomeLevel === candElig.incomeLevel
  ) {
    score += INCOME_MATCH_SCORE;
  }

  const baseTags = base.contentTags || [];
  const candTags = candidate.contentTags || [];
  score += overlapCount(baseTags, candTags) * CONTENT_TAG_OVERLAP_SCORE;

  return score;
}

/**
 * @param {object} currentPost - 현재 보고 있는 글 (astro content entry, .data 포함)
 * @param {object[]} allPosts - 전체 글 목록 (astro content entry 배열)
 * @param {number} limit - 추천 개수 (기본 3)
 * @returns {object[]} 점수순 정렬된 추천 글 목록 (astro content entry 그대로 반환)
 */
export function getRelatedPosts(currentPost, allPosts, limit = 3) {
  const candidates = allPosts.filter((p) => p.id !== currentPost.id);

  const scored = candidates
    .map((candidate) => ({
      post: candidate,
      score: scorePost(currentPost.data, candidate.data),
    }))
    // 점수가 0인 글(카테고리도 다르고 eligibility도 전혀 안 겹침)은 추천에서 제외.
    // 관련성 없는 글을 억지로 채우는 것보다, 추천 개수가 모자라더라도 정확한 게 낫다.
    .filter((entry) => entry.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      // 점수가 같으면 최신 글 우선
      return b.post.data.pubDate.valueOf() - a.post.data.pubDate.valueOf();
    });

  return scored.slice(0, limit).map((entry) => entry.post);
}
