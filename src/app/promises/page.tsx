'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Balloons from '@/components/Balloons';
import FloatingHearts from '@/components/FloatingHearts';
import { getPageContent } from '@/lib/db';
import { PageContent } from '@/lib/types';

export default function PromisesPage() {
  const router = useRouter();
  const [content, setContent] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [revealed, setRevealed] = useState<boolean[]>([false, false, false]);
  const [allRevealed, setAllRevealed] = useState(false);

  useEffect(() => {
    const loadContent = async () => {
      const data = await getPageContent();
      setContent(data);
      setLoading(false);
    };
    loadContent();
  }, []);

  useEffect(() => {
    if (revealed.every(r => r)) {
      setTimeout(() => {
        setAllRevealed(true);
      }, 500);
    }
  }, [revealed]);

  const handleReveal = (index: number) => {
    const newRevealed = [...revealed];
    newRevealed[index] = true;
    setRevealed(newRevealed);
  };

  const handleNext = () => {
    router.push('/gifts');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner" />
      </div>
    );
  }

  const promises = [
    { text: content?.promise1, button: content?.promiseButton1Text || 'Reveal 1st Promise' },
    { text: content?.promise2, button: content?.promiseButton2Text || 'Reveal 2nd Promise' },
    { text: content?.promise3, button: content?.promiseButton3Text || 'Reveal 3rd Promise' },
  ];

  return (
    <main className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      <Balloons />
      <FloatingHearts />

      <motion.div
        className="relative z-10 max-w-4xl w-full text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.div
          className="glass-effect rounded-3xl p-6 md:p-12 shadow-2xl"
          initial={{ scale: 0.8, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Title */}
          <motion.div
            className="romantic-gradient rounded-2xl p-6 shadow-xl mb-12"
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <h1
              className="text-4xl md:text-6xl font-bold text-white"
              style={{ fontFamily: 'var(--font-dancing)' }}
            >
              {content?.promisesTitle || 'My Promises to You'}
            </h1>
          </motion.div>

          {/* Promises */}
          <div className="space-y-8 mb-10">
            {promises.map((promise, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.2 }}
                className="relative"
              >
                <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-6 border-2 border-romantic-300 shadow-lg">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-4xl animate-heart-beat">
                      {index === 0 ? '💕' : index === 1 ? '💖' : '💝'}
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-romantic-700">
                      Promise {index + 1}
                    </h3>
                  </div>

                  <AnimatePresence mode="wait">
                    {!revealed[index] ? (
                      <motion.div
                        key="button"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                      >
                        <motion.button
                          onClick={() => handleReveal(index)}
                          className="px-6 py-3 bg-gradient-to-r from-pink-400 to-rose-500 text-white text-lg font-semibold rounded-full shadow-md hover:shadow-xl transform transition-all duration-300"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {promise.button}
                        </motion.button>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="text"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                      >
                        <p className="text-lg md:text-xl text-romantic-800 leading-relaxed">
                          {promise.text}
                        </p>
                        <motion.div
                          className="mt-4 text-3xl"
                          animate={{
                            scale: [1, 1.2, 1],
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                          }}
                        >
                          ✨
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Continue button */}
          <AnimatePresence>
            {allRevealed && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <motion.p
                  className="text-xl md:text-2xl text-romantic-700 mb-6 font-semibold"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Now, let&apos;s pick a gift for you! 🎁
                </motion.p>

                <motion.button
                  onClick={handleNext}
                  className="px-8 py-4 md:px-12 md:py-5 bg-gradient-to-r from-pink-500 to-rose-600 text-white text-xl md:text-2xl font-bold rounded-full shadow-lg hover:shadow-2xl transform transition-all duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Choose Your Gift 🎁
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Decorative elements */}
        <motion.div
          className="absolute -top-10 left-10 text-6xl"
          animate={{
            rotate: [0, 360],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        >
          ⭐
        </motion.div>

        <motion.div
          className="absolute -top-10 right-10 text-6xl"
          animate={{
            rotate: [360, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        >
          ⭐
        </motion.div>
      </motion.div>
    </main>
  );
}
