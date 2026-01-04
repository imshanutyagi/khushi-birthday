'use client';

import React from 'react';
import { motion } from 'framer-motion';

const FloatingHearts: React.FC = () => {
  const hearts = Array.from({ length: 10 });

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {hearts.map((_, index) => (
        <motion.div
          key={index}
          className="absolute text-pink-400 opacity-30"
          style={{
            left: `${Math.random() * 100}%`,
            fontSize: `${Math.random() * 20 + 15}px`,
          }}
          initial={{ y: '100vh', opacity: 0 }}
          animate={{
            y: '-10vh',
            opacity: [0, 0.3, 0],
            x: [0, Math.random() * 50 - 25, 0],
          }}
          transition={{
            duration: Math.random() * 5 + 5,
            delay: Math.random() * 5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          ❤️
        </motion.div>
      ))}
    </div>
  );
};

export default FloatingHearts;
