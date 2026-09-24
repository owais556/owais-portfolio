import { describe, expect, it } from 'vitest';

import { getAllPosts } from '@/lib/posts';
import { SITE_URL } from '@/lib/utils';

import { generateMetadata } from './page';

const posts = getAllPosts();

describe('writing post metadata', () => {
  // Re-activates as soon as a post is published; driven by real posts rather
  // than hardcoded slugs.
  it.skipIf(posts.length === 0)(
    'uses a trailing-slash canonical URL for posts',
    async () => {
      const { slug } = posts[0];
      const metadata = await generateMetadata({
        params: Promise.resolve({ slug }),
      });

      expect(metadata.openGraph?.url).toBe(`${SITE_URL}/writing/${slug}/`);
    },
  );

  it.skipIf(!posts.some((post) => post.image && post.imageAlt))(
    'uses an explicitly selected article image for social metadata',
    async () => {
      const post = posts.find((p) => p.image && p.imageAlt);
      const metadata = await generateMetadata({
        params: Promise.resolve({ slug: post?.slug ?? '' }),
      });

      expect(metadata.openGraph?.images).toEqual([
        {
          url: new URL(post?.image ?? '', SITE_URL).toString(),
          width: expect.any(Number),
          height: expect.any(Number),
          alt: post?.imageAlt,
        },
      ]);
      expect(metadata.twitter?.images).toEqual(metadata.openGraph?.images);
    },
  );
});
