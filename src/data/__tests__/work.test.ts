import { describe, expect, it } from 'vitest';

import work from '../resume/work';

describe('work data', () => {
  it('exports an array of positions', () => {
    expect(Array.isArray(work)).toBe(true);
    expect(work.length).toBeGreaterThan(0);
  });

  it('each position has required properties', () => {
    for (const job of work) {
      expect(job).toHaveProperty('name');
      expect(job).toHaveProperty('position');

      expect(typeof job.name).toBe('string');
      expect(typeof job.position).toBe('string');
    }
  });

  it('startDate is a valid date string when present', () => {
    for (const job of work) {
      if (job.startDate) {
        const date = new Date(job.startDate);
        expect(date.toString()).not.toBe('Invalid Date');
      }
    }
  });

  it('endDate is valid when present', () => {
    for (const job of work) {
      if (job.endDate) {
        const date = new Date(job.endDate);
        expect(date.toString()).not.toBe('Invalid Date');
      }
    }
  });

  it('endDate is after startDate when both are present', () => {
    for (const job of work) {
      if (job.endDate && job.startDate) {
        const start = new Date(job.startDate);
        const end = new Date(job.endDate);
        expect(end.getTime()).toBeGreaterThan(start.getTime());
      }
    }
  });

  it('urls are valid when present', () => {
    const urlRegex = /^https?:\/\/.+/;

    for (const job of work) {
      if (job.url) {
        expect(job.url).toMatch(urlRegex);
      }
    }
  });

  // Resume should show at least one current/active position
  it('has at least one current position (no endDate)', () => {
    const currentJobs = work.filter((job) => !job.endDate);
    expect(currentJobs.length).toBeGreaterThanOrEqual(1);
  });

  it('highlights are arrays when present', () => {
    for (const job of work) {
      if (job.highlights) {
        expect(Array.isArray(job.highlights)).toBe(true);
        expect(job.highlights.length).toBeGreaterThan(0);
      }
    }
  });

  // Only meaningful once more than one dated position exists; with a single
  // role there are no "different years" to assert.
  it.skipIf(work.filter((job) => job.startDate).length < 2)(
    'has positions from different years',
    () => {
      const years = work
        .filter((job) => job.startDate)
        .map((job) => new Date(job.startDate!).getFullYear());
      const uniqueYears = new Set(years);

      // Resume should contain work from multiple years
      expect(uniqueYears.size).toBeGreaterThan(1);
    },
  );

  it('company names are non-empty', () => {
    for (const job of work) {
      expect(job.name.trim().length).toBeGreaterThan(0);
    }
  });
});
