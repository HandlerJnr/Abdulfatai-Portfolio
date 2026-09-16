"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * The one word in the headline that changes, typed and deleted in place.
 *
 * Every option is the same part of speech and within a character of the same
 * length, so the sentence stays true and the centred line barely moves as the
 * word swaps. The first entry is what renders on the server, so the headline
 * is a complete sentence before any JavaScript runs and without it.
 */
const WORDS = ["clearer", "simpler", "sharper", "calmer", "faster"];

const TYPE = 70;
const DELETE = 42;
const HOLD = 2200;

export function RotatingWord() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [count, setCount] = useState(WORDS[0].length);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (reduce) return;
    const word = WORDS[index];

    if (!deleting && count === word.length) {
      const t = setTimeout(() => setDeleting(true), HOLD);
      return () => clearTimeout(t);
    }
    if (deleting && count === 0) {
      // Scheduled rather than set synchronously: updating state during the
      // effect body trips react-hooks/set-state-in-effect, and the small pause
      // reads as a beat before the next word starts.
      const t = setTimeout(() => {
        setDeleting(false);
        setIndex((i) => (i + 1) % WORDS.length);
      }, 160);
      return () => clearTimeout(t);
    }
    const t = setTimeout(
      () => setCount((c) => c + (deleting ? -1 : 1)),
      deleting ? DELETE : TYPE,
    );
    return () => clearTimeout(t);
  }, [count, deleting, index, reduce]);

  const shown = reduce ? WORDS[0] : WORDS[index].slice(0, count);

  return (
    <span className="text-accent">
      {shown}
      {!reduce && (
        <span
          aria-hidden="true"
          className="caret ml-[0.06em] inline-block w-[0.06em] self-stretch bg-accent align-baseline"
          style={{ height: "0.72em" }}
        />
      )}
    </span>
  );
}
