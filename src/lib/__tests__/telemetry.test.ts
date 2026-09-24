import { describe, expect, it } from 'vitest';

import {
  AGE_MIN_INTERVAL,
  AGE_PRECISION_FULL,
  ageAt,
  ageIntervalFor,
  agePlaceholder,
  MS_PER_YEAR,
} from '../telemetry';

const COMPACT_PRECISION = 8;

// A fixed test birth instant with an explicit UTC offset — the same shape
// production callers must pass so the reading is timezone-stable for every
// visitor.
const TEST_BIRTH_DATE = '1990-06-15T00:00:00Z';
const birthTime = new Date(TEST_BIRTH_DATE).getTime();

describe('ageAt', () => {
  it('returns zero at the moment of birth', () => {
    expect(ageAt(TEST_BIRTH_DATE, birthTime, 2)).toBe('0.00');
  });

  it('returns whole years after exact year intervals', () => {
    expect(ageAt(TEST_BIRTH_DATE, birthTime + MS_PER_YEAR * 36, 4)).toBe(
      '36.0000',
    );
  });

  it('honours the requested precision', () => {
    const now = birthTime + MS_PER_YEAR * 36.5;

    expect(ageAt(TEST_BIRTH_DATE, now, 0)).toBe('37');
    expect(
      ageAt(TEST_BIRTH_DATE, now, COMPACT_PRECISION).split('.')[1],
    ).toHaveLength(COMPACT_PRECISION);
    expect(
      ageAt(TEST_BIRTH_DATE, now, AGE_PRECISION_FULL).split('.')[1],
    ).toHaveLength(AGE_PRECISION_FULL);
  });

  it('is deterministic for a given instant', () => {
    const now = birthTime + MS_PER_YEAR * 12.345;

    expect(ageAt(TEST_BIRTH_DATE, now, 6)).toBe(ageAt(TEST_BIRTH_DATE, now, 6));
  });
});

describe('ageIntervalFor', () => {
  it('matches the cadence to the displayed precision', () => {
    expect(ageIntervalFor(COMPACT_PRECISION)).toBeGreaterThan(300);
    expect(ageIntervalFor(COMPACT_PRECISION)).toBeLessThan(320);
  });

  it('never schedules faster than the minimum interval', () => {
    expect(ageIntervalFor(AGE_PRECISION_FULL)).toBe(AGE_MIN_INTERVAL);
    expect(ageIntervalFor(20)).toBe(AGE_MIN_INTERVAL);
  });
});

describe('agePlaceholder', () => {
  it('matches the width of a real reading so the layout cannot shift', () => {
    const reading = ageAt(
      TEST_BIRTH_DATE,
      birthTime + MS_PER_YEAR * 36,
      COMPACT_PRECISION,
    );

    expect(agePlaceholder(COMPACT_PRECISION)).toHaveLength(reading.length);
  });

  it('contains no digits, so it cannot be mistaken for a value', () => {
    expect(agePlaceholder(AGE_PRECISION_FULL)).not.toMatch(/\d/);
  });
});
