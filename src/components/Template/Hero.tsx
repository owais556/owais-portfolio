import Link from 'next/link';

import profile from '@/data/profile.json';

import HeroPortrait from './HeroPortrait';

const [firstName, ...lastNameParts] = profile.name.split(' ');
const lastName = lastNameParts.join(' ');

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-grid">
        <div className="hero-primary">
          <h1 className="hero-title">
            <span className="hero-name hero-name-solid">{firstName}</span>{' '}
            <span className="hero-name hero-name-outline">{lastName}</span>
          </h1>

          {/* Discipline list, not the profile `focus` string: the hero drops
              Customer Service, so it cannot be derived from profile.json
              without changing every other consumer of that field. */}
          <span className="hero-eyebrow">
            Administration | Digital &amp; IT Support | Web Development
          </span>

          <p className="hero-tagline">
            I build modern digital experiences using web technologies and
            AI-assisted development, combining technical problem-solving with
            practical experience in digital operations, documentation, and
            administrative workflows.
          </p>

          <div className="hero-cta">
            <Link href="/about" className="button">
              About Me
            </Link>
            <Link href="/resume" className="hero-resume-link">
              View Resume
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        <HeroPortrait />
      </div>

      <div className="hero-bg" aria-hidden="true" />
    </section>
  );
}
