"use client";

import { useEffect, useState } from "react";

export function useCountUp(
  target: number,
  active: boolean,
  duration = 1500
): number {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;

    let start = 0;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      start = Math.round(target * eased);
      setValue(start);
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [target, active, duration]);

  return value;
}
