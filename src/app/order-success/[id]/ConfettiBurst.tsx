'use client';

import { useEffect } from 'react';
import confetti from 'canvas-confetti';

export default function ConfettiBurst() {
  useEffect(() => {
    try {
      const duration = 2.5 * 1000;
      const animationEnd = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#C59B27', '#7E132B', '#FAF2D7', '#10B981'],
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#C59B27', '#7E132B', '#FAF2D7', '#10B981'],
        });

        if (Date.now() < animationEnd) {
          requestAnimationFrame(frame);
        }
      };

      frame();
    } catch (e) {
      console.error(e);
    }
  }, []);

  return null;
}
