'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Balloons from '@/components/Balloons';
import FloatingHearts from '@/components/FloatingHearts';
import { getPageContent } from '@/lib/db';
import { PageContent } from '@/lib/types';

export default function WishesPage() {
  const router = useRouter();
  const [content, setContent] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const loadContent = async () => {
      const data = await getPageContent();
      setContent(data);
      setLoading(false);
    };
    loadContent();

    // Show button after animation
    const timer = setTimeout(() => {
      setShowButton(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleNext = () => {
    router.push('/promises');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <main className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      <Balloons />
      <FloatingHearts />

      <motion.div
        className="relative z-10 max-w-3xl w-full text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.div
          className="glass-effect rounded-3xl p-8 md:p-12 shadow-2xl"
          initial={{ scale: 0.8, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Title */}
          <motion.div
            className="romantic-gradient rounded-xl md:rounded-2xl p-4 md:p-6 shadow-xl mb-4 md:mb-8"
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <h1
              className="text-2xl md:text-6xl font-bold text-white"
              style={{ fontFamily: 'var(--font-dancing)' }}
            >
              {content?.wishesTitle || 'Best Wishes for You'}
            </h1>
          </motion.div>

          {/* Decorative hearts */}
          <motion.div
            className="flex justify-center gap-2 md:gap-4 mb-4 md:mb-8"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.6, type: 'spring' }}
          >
            <span className="text-2xl md:text-4xl animate-heart-beat">💖</span>
            <span className="text-3xl md:text-5xl animate-heart-beat" style={{ animationDelay: '0.2s' }}>❤️</span>
            <span className="text-2xl md:text-4xl animate-heart-beat" style={{ animationDelay: '0.4s' }}>💖</span>
          </motion.div>

          {/* Wishes message */}
          <motion.div
            className="mb-6 md:mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <motion.p
              className="text-base md:text-2xl text-romantic-700 leading-relaxed whitespace-pre-line"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              {content?.wishesMessage || 'You are the most special person in my life. Every moment with you is precious. Happy Birthday, my love!'}
            </motion.p>
          </motion.div>

          {/* Sparkles */}
          <motion.div
            className="flex justify-center gap-6 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            {[...Array(5)].map((_, i) => (
              <motion.span
                key={i}
                className="text-3xl"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              >
                ✨
              </motion.span>
            ))}
          </motion.div>

          {/* Button */}
          {showButton && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.button
                onClick={handleNext}
                className="px-6 py-3 md:px-12 md:py-5 bg-gradient-to-r from-pink-500 to-rose-600 text-white text-base md:text-2xl font-bold rounded-full shadow-lg hover:shadow-2xl transform transition-all duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {content?.wishesButtonText || 'See my promises 💌'}
              </motion.button>
            </motion.div>
          )}
        </motion.div>

        {/* Decorative elements */}
        <motion.div
          className="absolute -top-16 left-0 text-7xl opacity-50"
          animate={{
            rotate: [0, 20, -20, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          🌟
        </motion.div>

        <motion.div
          className="absolute -top-16 right-0 text-7xl opacity-50"
          animate={{
            rotate: [0, -20, 20, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 4, repeat: Infinity, delay: 1 }}
        >
          🌟
        </motion.div>

        <motion.div
          className="absolute -bottom-16 left-1/2 -translate-x-1/2 text-6xl"
          animate={{
            y: [0, -20, 0],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          💝
        </motion.div>
      </motion.div>
    </main>
  );
}
