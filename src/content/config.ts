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
    category: z.enum(['youth', 'job-startup', 'parenting', 'housing', 'self-employed', 'senior', 'common']),
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
    // 카테고리 리스트 페이지 우측에 노출되는 핵심 수치 배지 (예: "최대 250만원", "요건 폐지").
    // 8자 내외로 짧게. 없으면 배지 자체가 생략됨.
    metric: z.string().optional(),
    // 신청 마감일. 정부 1차 출처로 확인한 접수 마감일을 정확히 채운다(9-5 참고).
    // "상시"/"연중" 등 마감이 없는 정기·상시 모집이면 문자열 "ongoing"으로 표기.
    // 접수 자체는 상시 열려 있지만 예산·인원 캡이 있어 소진 시 조기 마감될 수 있는 경우(선착순
    // O명, 예산 소진 시 등)는 "budget-limited"로 표기 — 실시간 소진 여부는 판별하지 않고,
    // 이 값이 붙은 글에는 "예산 소진 시 조기 마감될 수 있다"는 안내를 상시·고정으로 노출한다.
    // 이 필드가 있고("ongoing"/"budget-limited"가 아니면서) 오늘 날짜가 지났으면
    // 목록에 "마감" 배지 + 상세페이지에 안내 배너가 자동으로 뜬다.
    // 확신이 없으면 비워둔다(9-3 원칙 — 상시/정기 여부를 먼저 공식 공고로 확인한 뒤 채울 것).
    deadline: z.union([z.coerce.date(), z.literal('ongoing'), z.literal('budget-limited')]).optional(),
  }),
});

export const collections = { blog };
