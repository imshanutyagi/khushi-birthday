'use client';

import React from 'react';
import { motion } from 'framer-motion';

const Balloons: React.FC = () => {
  const balloons = [
    { color: '#ff69b4', left: '10%', delay: 0 },
    { color: '#ff1493', left: '25%', delay: 0.5 },
    { color: '#c71585', left: '75%', delay: 1 },
    { color: '#ffb6c1', left: '90%', delay: 1.5 },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {balloons.map((balloon, index) => (
        <motion.div
          key={index}
          className="absolute bottom-0"
          style={{ left: balloon.left }}
          initial={{ y: '100vh' }}
          animate={{ y: '-20vh' }}
          transition={{
            duration: 8,
            delay: balloon.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <div className="relative">
            {/* Balloon */}
            <div
              className="w-16 h-20 rounded-full shadow-lg"
              style={{
                background: `radial-gradient(circle at 30% 30%, ${balloon.color}, ${balloon.color}dd)`,
              }}
            />
            {/* String */}
            <div
              className="absolute top-full left-1/2 w-0.5 h-20 -translate-x-1/2"
              style={{ background: balloon.color }}
            />
            {/* Shine effect */}
            <div className="absolute top-3 left-4 w-4 h-6 bg-white opacity-40 rounded-full blur-sm" />
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Balloons;
