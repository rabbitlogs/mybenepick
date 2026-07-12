import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

// RSS 피드: https://mybenepick.com/rss.xml
// 전체 글을 최신순으로 제공한다.
export async function GET(context) {
  const posts = (await getCollection('blog')).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );

  return rss({
    title: '혜택픽',
    description: '놓치기 쉬운 정부 지원금과 혜택, 대신 찾아드려요.',
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/blog/${post.id.replace('.md', '')}/`,
    })),
    customData: '<language>ko-kr</language>',
  });
}
