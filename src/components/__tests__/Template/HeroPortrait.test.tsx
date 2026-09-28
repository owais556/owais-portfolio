import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { REDUCED_MOTION_QUERY } from '../../../hooks/usePrefersReducedMotion';
import {
  AUTHOR_NAME,
  SITE_IMAGE_DIMENSIONS,
  SITE_IMAGE_PATH,
} from '../../../lib/utils';
import HeroPortrait from '../../Template/HeroPortrait';

/** Mirrors `EXIT_DURATION_MS` in `PortraitLightbox`, driven by --duration-fast. */
const EXIT_DURATION_MS = 200;

const TRIGGER_NAME = `Enlarge portrait of ${AUTHOR_NAME}`;
const CLOSE_NAME = 'Close portrait';

function mockMatchMedia(reducedMotion: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: reducedMotion && query === REDUCED_MOTION_QUERY,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

function setScrollY(value: number) {
  Object.defineProperty(window, 'scrollY', {
    writable: true,
    configurable: true,
    value,
  });
}

function open() {
  fireEvent.click(screen.getByRole('button', { name: TRIGGER_NAME }));
}

function closeWithEscape() {
  fireEvent.keyDown(document, { key: 'Escape' });
}

/** Let the exit animation finish so the unmount actually happens. */
function finishClosing() {
  act(() => {
    vi.advanceTimersByTime(EXIT_DURATION_MS);
  });
}

describe('HeroPortrait', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockMatchMedia(false);
    setScrollY(0);
    vi.mocked(window.scrollTo).mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
    document.body.removeAttribute('style');
  });

  it('keeps the framed portrait exactly where it was', () => {
    const { container } = render(<HeroPortrait />);

    const frame = container.querySelector('.hero-portrait');
    expect(frame).toBeInTheDocument();

    // The button sits between the frame and the image, and resets to nothing.
    const trigger = frame?.querySelector(
      ':scope > button.hero-portrait-trigger',
    );
    expect(trigger).toBeInTheDocument();

    const image = trigger?.querySelector('.theme-portrait > img');
    expect(image).toHaveAttribute('src', SITE_IMAGE_PATH);
    expect(image).toHaveAttribute('alt', AUTHOR_NAME);
    expect(image).toHaveAttribute('width', '320');
    expect(image).toHaveAttribute('height', '320');
    expect(image).toHaveAttribute('loading', 'eager');
  });

  it('announces the portrait as a dialog trigger, closed to start with', () => {
    render(<HeroPortrait />);

    const trigger = screen.getByRole('button', { name: TRIGGER_NAME });
    expect(trigger).toHaveAttribute('type', 'button');
    expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(
      document.querySelector('.portrait-lightbox'),
    ).not.toBeInTheDocument();
  });

  it('opens the same photograph enlarged on a modal dialog', () => {
    render(<HeroPortrait />);
    open();

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');

    const enlarged = within(dialog).getByRole('img', { name: AUTHOR_NAME });
    expect(enlarged).toHaveAttribute('src', SITE_IMAGE_PATH);
    // Declared at the source dimensions so the 1:1 ratio survives the clamp.
    expect(enlarged).toHaveAttribute(
      'width',
      String(SITE_IMAGE_DIMENSIONS.width),
    );
    expect(enlarged).toHaveAttribute(
      'height',
      String(SITE_IMAGE_DIMENSIONS.height),
    );

    expect(
      document.querySelector('.portrait-lightbox-backdrop'),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: TRIGGER_NAME })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });

  it('moves focus to the close button and keeps Tab inside the dialog', () => {
    render(<HeroPortrait />);

    const trigger = screen.getByRole('button', { name: TRIGGER_NAME });
    trigger.focus();
    fireEvent.click(trigger);

    const close = screen.getByRole('button', { name: CLOSE_NAME });
    expect(document.activeElement).toBe(close);

    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Tab' });
    expect(document.activeElement).toBe(close);

    fireEvent.keyDown(screen.getByRole('dialog'), {
      key: 'Tab',
      shiftKey: true,
    });
    expect(document.activeElement).toBe(close);
  });

  it('closes on Escape, holding the overlay only for the exit animation', () => {
    render(<HeroPortrait />);
    open();

    closeWithEscape();

    // Out of the accessibility tree at once, still painted while it fades.
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(document.querySelector('.portrait-lightbox')).toHaveClass(
      'portrait-lightbox--closing',
    );

    finishClosing();
    expect(
      document.querySelector('.portrait-lightbox'),
    ).not.toBeInTheDocument();
  });

  it('closes on the X button', () => {
    render(<HeroPortrait />);
    open();

    fireEvent.click(screen.getByRole('button', { name: CLOSE_NAME }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    finishClosing();
    expect(
      document.querySelector('.portrait-lightbox'),
    ).not.toBeInTheDocument();
  });

  it('does not close when the photograph itself is clicked', () => {
    render(<HeroPortrait />);
    open();

    const dialog = screen.getByRole('dialog');
    // Scoped to the dialog: the hero portrait carries the same alt text.
    fireEvent.click(within(dialog).getByRole('img', { name: AUTHOR_NAME }));

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('closes on a click that lands on the backdrop', () => {
    render(<HeroPortrait />);
    open();

    const backdrop = document.querySelector('.portrait-lightbox-backdrop');
    expect(backdrop).toBeInTheDocument();
    fireEvent.click(backdrop as HTMLElement);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('locks scrolling and puts the page back exactly where it was', () => {
    setScrollY(1200);
    render(<HeroPortrait />);
    open();

    expect(document.body.style.position).toBe('fixed');
    expect(document.body.style.top).toBe('-1200px');

    closeWithEscape();

    // Still locked while the overlay fades, so nothing can shift beneath it.
    expect(document.body.style.position).toBe('fixed');

    finishClosing();

    expect(document.body.style.position).toBe('');
    expect(document.body.style.top).toBe('');
    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 1200,
      behavior: 'instant',
    });
  });

  it('returns focus to the trigger once the lightbox is gone', () => {
    render(<HeroPortrait />);

    const trigger = screen.getByRole('button', { name: TRIGGER_NAME });
    // A real click focuses the button; fireEvent does not, and the lightbox
    // can only return focus to wherever it was taken from.
    trigger.focus();
    fireEvent.click(trigger);

    closeWithEscape();
    finishClosing();

    expect(document.activeElement).toBe(trigger);
  });

  it('drops the exit delay when the visitor asked for reduced motion', () => {
    mockMatchMedia(true);
    render(<HeroPortrait />);
    open();

    expect(screen.getByRole('dialog')).toBeInTheDocument();

    closeWithEscape();

    // No fade to wait for, so nothing is left mounted behind it.
    expect(
      document.querySelector('.portrait-lightbox'),
    ).not.toBeInTheDocument();
  });
});
