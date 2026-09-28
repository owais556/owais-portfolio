'use client';

import { useCallback, useState } from 'react';

import { AUTHOR_NAME } from '@/lib/utils';

import PortraitLightbox from './PortraitLightbox';
import ThemePortrait from './ThemePortrait';

/**
 * The hero portrait and its fullscreen view.
 *
 * A client island so `Hero` can stay a server component. The button wraps the
 * frame's existing contents and resets to nothing, so the portrait keeps the
 * exact box it had before it became clickable.
 */
export default function HeroPortrait() {
  const [open, setOpen] = useState(false);

  const openLightbox = useCallback(() => setOpen(true), []);
  const closeLightbox = useCallback(() => setOpen(false), []);

  return (
    <div className="hero-portrait">
      <button
        type="button"
        className="hero-portrait-trigger"
        onClick={openLightbox}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={`Enlarge portrait of ${AUTHOR_NAME}`}
      >
        <ThemePortrait width={320} height={320} priority />
      </button>

      <PortraitLightbox open={open} onClose={closeLightbox} />
    </div>
  );
}
