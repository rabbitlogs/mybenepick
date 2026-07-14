import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeExternalLinks from 'rehype-external-links';
import { remarkHighlight, remarkInlineToc, remarkSummaryBox } from './src/plugins/markdown.mjs';

export default defineConfig({
  site: 'https://mybenepick.com',
  integrations: [sitemap()],
  build: {
    inlineStylesheets: 'always',
  },
  markdown: {
    remarkPlugins: [remarkSummaryBox, remarkHighlight, remarkInlineToc],
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: 'wrap' }],
      [rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] }],
    ],
  },
});
