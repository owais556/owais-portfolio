import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { SITE_IMAGE_PATH } from '../../../lib/utils';
import Hero from '../../Template/Hero';

describe('Hero', () => {
  it('renders the hero section', () => {
    render(<Hero />);

    const heroSection = document.querySelector('.hero');
    expect(heroSection).toBeInTheDocument();
  });

  it('displays the name as heading', () => {
    render(<Hero />);

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Muhammad Owais');
  });

  // Neither string can come from profile.json: the eyebrow drops Customer
  // Service, which `profile.focus` still carries for the resume and the
  // footer, and the sentence no longer names an employer at all.
  it('leads with the discipline list, then the positioning sentence', () => {
    const { container } = render(<Hero />);

    expect(container.querySelector('.hero-eyebrow')).toHaveTextContent(
      'Administration | Digital & IT Support | Web Development',
    );
    expect(container.querySelector('.hero-tagline')).toHaveTextContent(
      'I build modern digital experiences using web technologies and AI-assisted development, combining technical problem-solving with practical experience in digital operations, documentation, and administrative workflows.',
    );
  });

  it('invents no hero links without verified targets', () => {
    const { container } = render(<Hero />);

    // The employer and projects have no verified URLs yet, so the tagline
    // is plain text rather than links to invented destinations.
    expect(container.querySelectorAll('.hero-tagline a')).toHaveLength(0);
  });

  it('keeps personal stats and incomplete credential lists off the homepage', () => {
    const { container } = render(<Hero />);

    expect(container.querySelector('.telemetry')).not.toBeInTheDocument();
    expect(container.querySelector('.hero-chips')).not.toBeInTheDocument();
    expect(screen.queryByText('Countries visited')).not.toBeInTheDocument();
    expect(screen.queryByText('Computing since')).not.toBeInTheDocument();
    expect(screen.queryByText('Based in')).not.toBeInTheDocument();
    expect(screen.queryByText('YC Alum')).not.toBeInTheDocument();
    expect(screen.queryByText('Stanford ICME')).not.toBeInTheDocument();
  });

  it('renders one primary CTA and one quieter resume link', () => {
    render(<Hero />);

    const aboutButton = screen.getByRole('link', { name: /about me/i });
    expect(aboutButton).toHaveAttribute('href', '/about');
    expect(aboutButton).toHaveClass('button');

    const resumeButton = screen.getByRole('link', { name: /view resume/i });
    expect(resumeButton).toHaveAttribute('href', '/resume');
    expect(resumeButton).toHaveClass('hero-resume-link');
    expect(resumeButton).not.toHaveClass('button');
  });

  it('has decorative background elements', () => {
    render(<Hero />);

    const bg = document.querySelector('.hero-bg');
    expect(bg).toBeInTheDocument();
    expect(bg).toHaveAttribute('aria-hidden', 'true');
  });

  // The lightbox itself is covered in HeroPortrait.test.tsx; this only pins
  // that the hero still hands the framed portrait to a dialog trigger, and
  // that nothing is mounted until it is used.
  it('renders the portrait as a closed dialog trigger', () => {
    const { container } = render(<Hero />);

    const trigger = container.querySelector(
      '.hero-portrait > button.hero-portrait-trigger',
    );
    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger?.querySelector('.theme-portrait > img')).toHaveAttribute(
      'src',
      SITE_IMAGE_PATH,
    );
    expect(
      document.querySelector('.portrait-lightbox'),
    ).not.toBeInTheDocument();
  });
});
