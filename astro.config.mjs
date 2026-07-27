import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeExternalLinks from 'rehype-external-links';
import { remarkHighlight, remarkInlineToc, remarkSummaryBox, remarkFaq, remarkTldrBox, rehypeOlContent } from './src/plugins/markdown.mjs';

export default defineConfig({
  site: 'https://mybenepick.com',
  integrations: [
    sitemap({
      // 2026-07 카테고리 개편으로 생긴 구 slug 리다이렉트 페이지는 색인 대상이 아니다.
      filter: (page) =>
        !/\/category\/(job-startup|housing|senior|common)\/?$/.test(page),
    }),
  ],
  build: {
    inlineStylesheets: 'always',
  },
  markdown: {
    remarkPlugins: [remarkTldrBox, remarkSummaryBox, remarkFaq, remarkHighlight, remarkInlineToc],
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: 'wrap' }],
      [rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] }],
      rehypeOlContent,
    ],
  },
});
