'use client';

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';

interface ConfettiEffectProps {
  active?: boolean;
  duration?: number;
}

const ConfettiEffect: React.FC<ConfettiEffectProps> = ({ active = true, duration = 3000 }) => {
  useEffect(() => {
    if (!active) return;

    const end = Date.now() + duration;

    const colors = ['#ff69b4', '#ff1493', '#c71585', '#ffb6c1', '#ffd1dc'];

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        colors: colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, [active, duration]);

  return null;
};

export default ConfettiEffect;
