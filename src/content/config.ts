import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    // 발행 후 내용을 수정한 경우에만 채우기. 제도 개편으로 기존 글의 숫자·날짜·조건이
    // 바뀌었을 때 이 필드를 갱신하면 dateModified(JSON-LD)와 RSS에 반영되어 구글이
    // "최신 정보로 갱신됨"을 인지할 수 있다. 생략하면 pubDate와 동일하게 취급.
    updatedDate: z.coerce.date().optional(),
    // 대상자·상황 기준 1차 분류 (7개)
    category: z.enum(['self-employed', 'job-startup', 'youth', 'parenting', 'housing', 'senior', 'common']),
    // 콘텐츠 성격 태그 (복수 선택 가능 — 예: 신설·변경이면서 지역특화일 수 있음)
    contentTags: z.array(z.enum(['new', 'regional', 'deep-guide'])).optional(),
    // ── "나에게 맞는 혜택 찾기" 매칭용 메타데이터 ──
    // 정밀 자격조건 판정이 아니라 "관련성 높은 글 추천"이 목적. 구간 단위로만 태깅해서
    // AI 생성 + 최소검수 파이프라인에서도 부담 없이 채울 수 있게 유지할 것.
    // 비워두면(undefined) 해당 축에서는 "전체 해당"으로 간주해 필터링에서 제외되지 않음.
    eligibility: z.object({
      // 해당하는 나이대 전부 선택. 특정 나이 제한이 없는 글은 생략(전체 해당 처리).
      ageRange: z.array(z.enum(['10s', '20s', '30s', '40s', '50s', '60plus'])).optional(),
      // 소득 요건 성격. low: 저소득/기초생활수급 등 엄격한 기준, middle: 중위소득 X% 이하 같은
      // 중간 기준, any: 소득과 무관하게 전국민 대상.
      incomeLevel: z.enum(['low', 'middle', 'any']).optional(),
      // 해당하는 신분/고용상태 전부 선택.
      employmentStatus: z
        .array(z.enum(['employed', 'self-employed', 'unemployed', 'student', 'any']))
        .optional(),
    }).optional(),
    tags: z.array(z.string()).optional(),
    thumbnail: z.string().optional(),
  }),
});

export const collections = { blog };
