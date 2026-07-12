import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    // 대상자 기준 1차 분류 (4개로 압축: 중장년·은퇴는 전국민 공통에 통합)
    category: z.enum(['self-employed', 'youth', 'parenting', 'common']),
    // 콘텐츠 성격 태그 (복수 선택 가능 — 예: 신설·변경이면서 지역특화일 수 있음)
    contentTags: z.array(z.enum(['new', 'regional', 'deep-guide'])).optional(),
    tags: z.array(z.string()).optional(),
    thumbnail: z.string().optional(),
  }),
});

export const collections = { blog };
