'use client';

import {
  type KeyboardEvent as ReactKeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';

import usePrefersReducedMotion from '@/hooks/usePrefersReducedMotion';
import {
  AUTHOR_NAME,
  SITE_IMAGE_DIMENSIONS,
  SITE_IMAGE_PATH,
} from '@/lib/utils';

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Must stay in step with `--duration-fast`, which is what the exit animation
 * in `lightbox.css` runs at. Unmounting early would cut the fade off.
 */
const EXIT_DURATION_MS = 200;

interface PortraitLightboxProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Fullscreen view of the portrait.
 *
 * Rendered through a portal so no ancestor stacking context can trap its
 * z-index, and only while open: the enlarged plate is a second decode of the
 * same 1254px source, which is not worth holding resident for a dialog that
 * is closed almost all of the time. It stays mounted through the exit
 * animation, then unmounts.
 */
export default function PortraitLightbox({
  open,
  onClose,
}: PortraitLightboxProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const [mounted, setMounted] = useState(open);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      setClosing(false);
      return;
    }

    if (!mounted) return;

    if (prefersReducedMotion) {
      setMounted(false);
      return;
    }

    setClosing(true);
    const timer = setTimeout(() => setMounted(false), EXIT_DURATION_MS);
    return () => clearTimeout(timer);
  }, [open, mounted, prefersReducedMotion]);

  // Held for the whole mount, including the exit animation, so the page
  // cannot shift under the fading overlay.
  useEffect(() => {
    if (!mounted) return;

    const scrollY = window.scrollY;
    const { style } = document.body;

    style.position = 'fixed';
    style.top = `-${scrollY}px`;
    style.left = '0';
    style.right = '0';

    return () => {
      style.position = '';
      style.top = '';
      style.left = '';
      style.right = '';
      // `html` sets `scroll-behavior: smooth`, so a plain scrollTo would
      // glide the page back rather than putting it where it was.
      window.scrollTo({ top: scrollY, behavior: 'instant' });
    };
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();

    return () => {
      previouslyFocused?.focus();
    };
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [mounted, onClose]);

  const handleDialogKeyDown = useCallback((event: ReactKeyboardEvent) => {
    if (event.key !== 'Tab') return;

    const focusable =
      dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
    if (!focusable?.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div
      className={
        closing
          ? 'portrait-lightbox portrait-lightbox--closing'
          : 'portrait-lightbox'
      }
      inert={closing || undefined}
      aria-hidden={closing || undefined}
    >
      {/* A sibling behind the dialog rather than its background, so clicks
          that land outside the plate close it without the plate having to
          swallow and rethrow the event. */}
      <div
        className="portrait-lightbox-backdrop"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Portrait of ${AUTHOR_NAME}`}
        className="portrait-lightbox-dialog"
        onKeyDown={handleDialogKeyDown}
      >
        <figure className="portrait-lightbox-plate">
          {/* biome-ignore lint/performance/noImgElement: Using native img to avoid next/image runtime overhead for static export */}
          <img
            src={SITE_IMAGE_PATH}
            alt={AUTHOR_NAME}
            width={SITE_IMAGE_DIMENSIONS.width}
            height={SITE_IMAGE_DIMENSIONS.height}
            decoding="async"
          />
        </figure>

        <button
          ref={closeButtonRef}
          type="button"
          className="portrait-lightbox-close"
          onClick={onClose}
          aria-label="Close portrait"
        >
          <span aria-hidden="true">×</span>
        </button>
      </div>
    </div>,
    document.body,
  );
}
