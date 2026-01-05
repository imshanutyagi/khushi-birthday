'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Balloons from '@/components/Balloons';
import FloatingHearts from '@/components/FloatingHearts';
import ConfettiEffect from '@/components/ConfettiEffect';
import { getPageContent, initializeDefaultContent } from '@/lib/db';
import { PageContent } from '@/lib/types';

export default function IntroPage() {
  const router = useRouter();
  const [showReady, setShowReady] = useState(false);
  const [content, setContent] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    // Get current date
    const today = new Date();
    const day = today.getDate();
    const month = today.toLocaleString('en-US', { month: 'long' });
    setCurrentDate(`Today is ${day} ${month}.`);
  }, []);

  useEffect(() => {
    const loadContent = async () => {
      await initializeDefaultContent();
      const data = await getPageContent();
      setContent(data);
      setLoading(false);
    };
    loadContent();

    const timer = setTimeout(() => {
      setShowReady(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleReady = () => {
    router.push('/cake');
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
      <ConfettiEffect duration={5000} />

      <motion.div
        className="relative z-10 max-w-2xl w-full text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.div
          className="glass-effect rounded-3xl p-8 md:p-12 shadow-2xl"
          initial={{ scale: 0.8, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Birthday Message */}
          <motion.div
            className="space-y-6 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.p
              className="text-base md:text-2xl text-gray-800 font-semibold"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              {content?.introText1 || currentDate || 'Today is 4 January.'}
            </motion.p>

            <motion.p
              className="text-sm md:text-xl text-gray-700 font-medium"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1 }}
            >
              {content?.introText2 || 'This is the day when you were born,'}
            </motion.p>

            <motion.p
              className="text-sm md:text-xl text-gray-700 font-medium"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.3 }}
            >
              {content?.introText3 || 'and it is not only special for you, but also for me.'}
            </motion.p>

            <motion.div
              className="romantic-gradient rounded-xl md:rounded-2xl p-4 md:p-6 shadow-xl mb-4 md:mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.6, type: 'spring', stiffness: 200 }}
            >
              <h1
                className="text-2xl md:text-6xl font-bold text-white"
                style={{ fontFamily: 'var(--font-dancing)' }}
              >
                Happy Birthday, Khushi! 🎉
              </h1>
            </motion.div>

            <motion.p
              className="text-lg md:text-3xl text-pink-700 font-semibold"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.9 }}
            >
              Let&apos;s cut the cake 🎂
            </motion.p>
          </motion.div>

          {/* Ready Section */}
          <AnimatePresence>
            {showReady && (
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <motion.p
                  className="text-xl md:text-3xl text-pink-800 font-bold"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  {content?.readyText || 'Are you ready?'}
                </motion.p>

                <motion.button
                  onClick={handleReady}
                  className="px-6 py-3 md:px-12 md:py-5 bg-gradient-to-r from-pink-500 to-rose-600 text-white text-lg md:text-2xl font-bold rounded-full shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {content?.readyButtonText || 'I am ready ❤️'}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Decorative elements */}
        <motion.div
          className="absolute -top-10 -left-10 text-6xl md:text-8xl"
          animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          🎈
        </motion.div>

        <motion.div
          className="absolute -bottom-10 -right-10 text-6xl md:text-8xl"
          animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 3, repeat: Infinity, delay: 1 }}
        >
          🎀
        </motion.div>
      </motion.div>
    </main>
  );
}
