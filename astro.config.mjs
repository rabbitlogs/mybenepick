import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeExternalLinks from 'rehype-external-links';
import { remarkHighlight, remarkInlineToc, remarkSummaryBox, remarkFaq, remarkTldrBox } from './src/plugins/markdown.mjs';

export default defineConfig({
  site: 'https://mybenepick.com',
  integrations: [sitemap()],
  build: {
    inlineStylesheets: 'always',
  },
  markdown: {
    remarkPlugins: [remarkTldrBox, remarkSummaryBox, remarkFaq, remarkHighlight, remarkInlineToc],
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: 'wrap' }],
      [rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] }],
    ],
  },
});
