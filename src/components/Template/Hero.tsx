import Link from 'next/link';

import profile from '@/data/profile.json';

import ThemePortrait from './ThemePortrait';

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

          <p className="hero-tagline">
            I&apos;m a {profile.role} at {profile.employer} in{' '}
            {profile.currentCity}, working across {profile.focus}.
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

        <div className="hero-portrait">
          <ThemePortrait width={320} height={320} priority />
        </div>
      </div>

      <div className="hero-bg" aria-hidden="true" />
    </section>
  );
}
