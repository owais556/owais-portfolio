import { describe, expect, it } from 'vitest';

import { getAllPosts } from '@/lib/posts';
import { SITE_URL } from '@/lib/utils';

import { GET } from '../route';

const hasPosts = getAllPosts().length > 0;

describe('feed.xml route', () => {
  it('links the writing index with a canonical trailing slash', async () => {
    const response = await GET();
    const xml = await response.text();

    expect(xml).toContain(`${SITE_URL}/writing/`);
  });

  // Re-activates as soon as any post is published; the assertion is driven
  // by the posts that exist rather than hardcoded slugs.
  it.skipIf(!hasPosts)(
    'uses canonical trailing-slash links for writing pages',
    async () => {
      const response = await GET();
      const xml = await response.text();

      for (const post of getAllPosts()) {
        expect(xml).toContain(`${SITE_URL}/writing/${post.slug}/`);
      }
    },
  );

  it('keeps the feed self link file-like', async () => {
    const response = await GET();
    const xml = await response.text();

    expect(xml).toContain(`${SITE_URL}/feed.xml`);
    expect(xml).not.toContain(`${SITE_URL}/feed.xml/`);
  });

  // With no published posts there is no content date to derive from, so the
  // feed must fall back to the epoch rather than the build clock.
  it.skipIf(hasPosts)(
    'falls back to the epoch as lastBuildDate when there is no content',
    async () => {
      const response = await GET();
      const xml = await response.text();

      expect(xml).toContain(
        '<lastBuildDate>Thu, 01 Jan 1970 00:00:00 GMT</lastBuildDate>',
      );
    },
  );
});
