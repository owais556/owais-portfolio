import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { getWritingItems } from '@/lib/writing';
import HomePage from '../page';
import WritingPage from '../writing/page';

const datedItems = getWritingItems().filter((item) => item.date);

describe('writing information architecture', () => {
  // Until posts or external links exist, the homepage hides the section
  // rather than showing an empty "Latest writing" heading.
  it.skipIf(datedItems.length > 0)(
    'hides the homepage writing section when there is nothing to list',
    () => {
      render(<HomePage />);

      expect(screen.queryByRole('region', { name: 'Latest writing' })).not.toBeInTheDocument();
    },
  );

  it.skipIf(datedItems.length === 0)(
    'surfaces the three newest dated items on the homepage',
    () => {
      const expected = datedItems.slice(0, 3);

      const { container } = render(<HomePage />);
      const section = screen.getByRole('region', { name: 'Latest writing' });
      const cards = container.querySelectorAll('.home-writing-item');

      expect(cards).toHaveLength(3);
      expect([...cards].map((card) => card.querySelector('h3')?.textContent)).toEqual(
        expected.map((item) => item.title),
      );
      expect(within(section).getByRole('link', { name: 'View all' })).toHaveAttribute(
        'href',
        '/writing',
      );
    },
  );

  // Empty sections render no heading at all — a bare "Essays on this site"
  // label with nothing under it would be worse than no label.
  it.skipIf(getWritingItems().length > 0)(
    'hides empty writing groups instead of bare headings',
    () => {
      render(<WritingPage />);

      expect(
        screen.queryByRole('heading', {
          level: 2,
          name: 'Essays on this site',
        }),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole('heading', {
          level: 2,
          name: 'Selected writing elsewhere',
        }),
      ).not.toBeInTheDocument();
      expect(screen.queryByRole('heading', { level: 2, name: 'Guides' })).not.toBeInTheDocument();
    },
  );

  it.skipIf(getWritingItems().length === 0)(
    'groups owned essays, external articles, and guides under real headings',
    () => {
      const { container } = render(<WritingPage />);

      expect(
        screen.getByRole('heading', {
          level: 2,
          name: 'Essays on this site',
        }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('heading', {
          level: 2,
          name: 'Selected writing elsewhere',
        }),
      ).toBeInTheDocument();

      expect(container.querySelectorAll('.writing-item h3')).toHaveLength(getWritingItems().length);
    },
  );

  it.skipIf(datedItems.length === 0)(
    'features exactly the newest dated item, wherever it is grouped',
    () => {
      const newest = datedItems[0];
      const { container } = render(<WritingPage />);
      const featured = container.querySelectorAll('.writing-item--featured');

      expect(featured).toHaveLength(1);
      // Canonical URLs keep the trailing slash (see writing.test.ts), but the
      // next/link render in jsdom drops it.
      expect(featured[0]).toHaveAttribute('href', newest.url.replace(/\/$/, ''));
    },
  );

  it('shows provenance beside every external-link arrow', () => {
    const externalItems = getWritingItems().filter((item) => item.isExternal);
    const { container } = render(<WritingPage />);
    const externalLinks = [...container.querySelectorAll('a.writing-item[target="_blank"]')];

    expect(externalLinks).toHaveLength(externalItems.length);
    externalLinks.forEach((link, index) => {
      expect(link.querySelector('.writing-source')).toHaveTextContent(externalItems[index].source);
      expect(link.querySelector('.writing-external')).toHaveTextContent('↗');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      expect(link.querySelector('.sr-only')).toHaveTextContent('opens in a new tab');
    });
  });
});
