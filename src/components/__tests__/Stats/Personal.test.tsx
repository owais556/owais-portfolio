import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import profile from '@/data/profile.json';
import Personal from '../../Stats/Personal';

describe('Personal', () => {
  it('renders the personal stats table', () => {
    render(<Personal />);

    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('displays current city', () => {
    render(<Personal />);

    expect(screen.getByText('Current city')).toBeInTheDocument();
    expect(screen.getByText(profile.currentCity)).toBeInTheDocument();
  });

  // Age and travel figures need a verified birthdate and travel history;
  // until those exist the table must not claim them.
  it('does not surface unverified personal stats', () => {
    render(<Personal />);

    expect(screen.queryByText('Current age')).not.toBeInTheDocument();
    expect(screen.queryByText('Countries visited')).not.toBeInTheDocument();
  });
});
