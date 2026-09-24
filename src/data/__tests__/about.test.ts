import { describe, expect, it } from 'vitest';

import { aboutMarkdown } from '../about';

describe('about data', () => {
  it('exports aboutMarkdown as a string', () => {
    expect(typeof aboutMarkdown).toBe('string');
    expect(aboutMarkdown.length).toBeGreaterThan(0);
  });

  it('contains the intro section', () => {
    expect(aboutMarkdown).toContain('# Intro');
    expect(aboutMarkdown).toContain('Muhammad Owais');
    expect(aboutMarkdown).toContain('Asim Higher Secondary School');
  });

  it('contains the professional focus section', () => {
    expect(aboutMarkdown).toContain('# Professional Focus');
    expect(aboutMarkdown).toContain('Administration');
    expect(aboutMarkdown).toContain('Web development');
  });

  it('contains the selected projects section', () => {
    expect(aboutMarkdown).toContain('# Selected Projects');
    expect(aboutMarkdown).toContain('Operation Bunyan ul Marsoos');
  });

  it('contains the get in touch section', () => {
    expect(aboutMarkdown).toContain('# Get in Touch');
    expect(aboutMarkdown).toContain('owaiskhaskheli65@gmail.com');
  });

  it('contains valid markdown links', () => {
    // Check for markdown link format [text](url)
    const linkRegex = /\[.+?\]\(.+?\)/g;
    const links = aboutMarkdown.match(linkRegex);

    expect(links).not.toBeNull();
    expect(links!.length).toBeGreaterThanOrEqual(4);
  });

  it('contains properly formatted headers', () => {
    // Check for markdown headers
    const headerRegex = /^#+ .+$/gm;
    const headers = aboutMarkdown.match(headerRegex);

    expect(headers).not.toBeNull();
    expect(headers!.length).toBeGreaterThanOrEqual(4);
  });
});
