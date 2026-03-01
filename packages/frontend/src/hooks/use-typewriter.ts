"use client";

import { useEffect, useState, useRef } from "react";

/**
 * Reveals text line by line for a typewriter effect.
 * Returns the number of lines currently visible.
 */
export function useTypewriter(
  totalLines: number,
  trigger: string | null, // changes when we should restart
  linesPerTick = 3,
  tickMs = 30
) {
  const [revealed, setRevealed] = useState(0);
  const prevTrigger = useRef<string | null>(null);

  useEffect(() => {
    if (trigger !== prevTrigger.current) {
      prevTrigger.current = trigger;
      setRevealed(0);
    }
  }, [trigger]);

  useEffect(() => {
    if (revealed >= totalLines) return;
    const timer = setTimeout(() => {
      setRevealed((r) => Math.min(r + linesPerTick, totalLines));
    }, tickMs);
    return () => clearTimeout(timer);
  }, [revealed, totalLines, linesPerTick, tickMs]);

  return revealed;
}
