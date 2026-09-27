import { describe, expect, it } from 'vitest';

import {
  compareWritingItems,
  getWritingItems,
  type WritingItem,
} from '../writing';

describe('getWritingItems', () => {
  // Local posts and external links are both empty until content exists;
  // these merge assertions re-activate once both sources return items.
  it.skipIf(
    !getWritingItems().some((item) => !item.isExternal) ||
      !getWritingItems().some((item) => item.isExternal),
  )('merges published local posts and external writing newest first', () => {
    const items = getWritingItems();

    expect(items.some((item) => !item.isExternal)).toBe(true);
    expect(items.some((item) => item.isExternal)).toBe(true);

    const dated = items.filter((item) => item.date);
    expect(
      dated.every(
        (item, index) =>
          index === 0 || dated[index - 1]!.date.localeCompare(item.date) >= 0,
      ),
    ).toBe(true);
  });

  it.skipIf(getWritingItems().filter((item) => !item.isExternal).length === 0)(
    'uses canonical trailing-slash URLs for local posts',
    () => {
      const localItems = getWritingItems().filter((item) => !item.isExternal);

      expect(localItems.length).toBeGreaterThan(0);
      expect(localItems.every((item) => item.url.endsWith('/'))).toBe(true);
      expect(localItems.every((item) => item.source === 'On this site')).toBe(
        true,
      );
    },
  );

  it('orders equal and undated entries deterministically', () => {
    const item = (
      title: string,
      date: string,
      url = `https://example.com/${title.toLowerCase()}`,
    ): WritingItem => ({
      title,
      date,
      url,
      description: '',
      isExternal: true,
      source: 'Example',
    });

    expect(
      [item('Zulu', ''), item('Alpha', '')].sort(compareWritingItems),
    ).toEqual([item('Alpha', ''), item('Zulu', '')]);
    expect(
      [item('Zulu', '2026-01-01'), item('Alpha', '2026-01-01')].sort(
        compareWritingItems,
      ),
    ).toEqual([item('Alpha', '2026-01-01'), item('Zulu', '2026-01-01')]);
  });
});
