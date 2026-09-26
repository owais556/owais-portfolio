'use client';

import { useEffect, useReducer, useRef } from 'react';

import profile from '@/data/profile.json';
import usePrefersReducedMotion from '@/hooks/usePrefersReducedMotion';

// Animation timing constants
const ANIMATION_TICK_MS = 35; // Tick length in milliseconds
const HOLD_TICKS_AFTER_MESSAGE = 30; // Ticks to wait after message completes

/** The address the link always resolves to, whatever the animation shows. */
const CONTACT_ADDRESS = profile.email;
const [CONTACT_LOCAL_PART, CONTACT_DOMAIN] = CONTACT_ADDRESS.split('@');

const messages = [
  'hello',
  'hi-there',
  'lets-connect',
  'get-in-touch',
  'say-salam',
  'quick-question',
  'about-a-project',
  'web-development',
  'it-support',
  'just-saying-hi',
  'thank-you',
  // The real address closes the cycle so the animation lands on it and stays.
  CONTACT_LOCAL_PART,
];

function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef<() => void>(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!delay) return;

    const id = setInterval(() => savedCallback.current?.(), delay);
    return () => clearInterval(id);
  }, [delay]);
}

interface AnimationState {
  idx: number;
  message: string;
  char: number;
  isActive: boolean;
}

type AnimationAction =
  | { type: 'TICK'; loopMessage: boolean; hold: number }
  | { type: 'PAUSE' }
  | { type: 'RESUME'; maxIdx: number };

/**
 * The opening frame of a message.
 *
 * Advancing used to reset to zero characters, so `message` was `''` for one
 * tick at every boundary — and the render fell back to the static address,
 * flashing it fifteen times a cycle. A message now begins already showing its
 * first character, so the prefix is never empty mid-animation.
 */
function startOf(idx: number): AnimationState {
  return {
    idx,
    message: messages[idx].slice(0, 1),
    char: 2,
    isActive: true,
  };
}

function animationReducer(
  state: AnimationState,
  action: AnimationAction,
): AnimationState {
  switch (action.type) {
    case 'TICK': {
      if (state.idx >= messages.length) {
        return state;
      }

      const finished = state.char - action.hold >= messages[state.idx].length;

      if (!finished) {
        return {
          ...state,
          message: messages[state.idx].slice(0, state.char),
          char: state.char + 1,
          isActive: true,
        };
      }

      const nextIdx = state.idx + 1;

      if (nextIdx === messages.length) {
        if (action.loopMessage) {
          return startOf(0);
        }

        // Completion is recorded in `idx`, not only in `isActive`. Leaving it
        // on the last message meant RESUME's `idx < maxIdx` test passed, so a
        // finished animation re-armed its interval on every mouse-out.
        return { ...state, idx: messages.length, isActive: false };
      }

      return startOf(nextIdx);
    }
    case 'PAUSE':
      return { ...state, isActive: false };
    case 'RESUME':
      return {
        ...state,
        isActive: state.idx < action.maxIdx,
      };
    default:
      return state;
  }
}

interface EmailLinkProps {
  loopMessage?: boolean;
}

export default function EmailLink({ loopMessage = false }: EmailLinkProps) {
  const reducedMotion = usePrefersReducedMotion();

  // The cycle leads with the greetings and lands on the real address, which
  // then stands. Opening mid-type keeps the prefix non-empty from frame one.
  const [state, dispatch] = useReducer(animationReducer, startOf(0));

  // If user prefers reduced motion, show static email immediately
  useEffect(() => {
    if (reducedMotion) {
      dispatch({ type: 'PAUSE' });
    }
  }, [reducedMotion]);

  useInterval(
    () => {
      dispatch({ type: 'TICK', loopMessage, hold: HOLD_TICKS_AFTER_MESSAGE });
    },
    state.isActive && !reducedMotion ? ANIMATION_TICK_MS : null,
  );

  // The reducer never yields an empty prefix, so the only reason to override
  // it is reduced motion, where the real address should simply stand.
  const displayMessage = reducedMotion ? CONTACT_LOCAL_PART : state.message;

  // The domain belongs to the address alone — greeting aliases render without it.
  const showDomain = displayMessage === CONTACT_LOCAL_PART;

  const handlePause = () => dispatch({ type: 'PAUSE' });
  const handleResume = () => {
    if (!reducedMotion) {
      dispatch({ type: 'RESUME', maxIdx: messages.length });
    }
  };

  return (
    <div
      className="contact-email-container"
      onMouseEnter={handlePause}
      onMouseLeave={handleResume}
    >
      {/* Always a real link to a real address. Greetings cycle first and the
          address lands last; the domain renders only alongside the complete
          address. The shown text is decorative — the destination never
          changes. */}
      <a
        href={`mailto:${CONTACT_ADDRESS}`}
        className="contact-email-link"
        onFocus={handlePause}
        onBlur={handleResume}
      >
        <span className="sr-only">Email {CONTACT_ADDRESS}</span>
        <span className="contact-email-prefix" aria-hidden="true">
          {displayMessage}
        </span>
        {showDomain && (
          <span className="contact-email-domain" aria-hidden="true">
            @{CONTACT_DOMAIN}
          </span>
        )}
      </a>
    </div>
  );
}
