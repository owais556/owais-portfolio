import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import SkillTag from '../../Resume/Skills/SkillTag';

const mockCategories = [
  { name: 'Languages', color: '#6968b3' },
  { name: 'ML Engineering', color: '#37b1f5' },
];

describe('SkillTag', () => {
  it('renders the skill title', () => {
    const skill = { title: 'Python', category: ['Languages'] };

    render(<SkillTag data={skill} categories={mockCategories} />);

    expect(screen.getByText('Python')).toBeInTheDocument();
  });

  // Skills carry no proficiency rating: the resume lists skills without
  // levels, so the tag must not assert one via tooltip or accessible name.
  it('renders no proficiency claim', () => {
    const skill = { title: 'Python', category: ['Languages'] };

    render(<SkillTag data={skill} categories={mockCategories} />);

    const tag = document.querySelector('.skill-tag');
    expect(tag).not.toHaveAttribute('title');
    expect(tag).not.toHaveAttribute('aria-label');
  });

  it('sets category color as CSS variable', () => {
    const skill = { title: 'Python', category: ['Languages'] };

    render(<SkillTag data={skill} categories={mockCategories} />);

    const tag = document.querySelector('.skill-tag') as HTMLElement;
    expect(tag.style.getPropertyValue('--tag-color')).toBe('#6968b3');
  });

  it('uses first matching category color for multi-category skills', () => {
    const skill = {
      title: 'Python',
      category: ['Languages', 'ML Engineering'],
    };

    render(<SkillTag data={skill} categories={mockCategories} />);

    const tag = document.querySelector('.skill-tag') as HTMLElement;
    // Should use Languages color since it's first in categories list
    expect(tag.style.getPropertyValue('--tag-color')).toBe('#6968b3');
  });
});
