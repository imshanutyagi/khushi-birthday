'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useSwipeable } from 'react-swipeable';
import Balloons from '@/components/Balloons';
import ConfettiEffect from '@/components/ConfettiEffect';
import { getPageContent } from '@/lib/db';
import { PageContent } from '@/lib/types';
import Image from 'next/image';

export default function CakePage() {
  const router = useRouter();
  const [content, setContent] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCut, setIsCut] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const clapRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const loadContent = async () => {
      const data = await getPageContent();
      setContent(data);
      setLoading(false);

      // Autoplay birthday song
      if (data?.birthdaySongUrl) {
        setTimeout(() => {
          audioRef.current?.play().catch(err => console.log('Audio play failed:', err));
        }, 500);
      }
    };
    loadContent();
  }, []);

  const handleCut = () => {
    if (!isCut) {
      setIsCut(true);
      setShowConfetti(true);

      // Play clap sound
      if (clapRef.current) {
        clapRef.current.play().catch(err => console.log('Clap sound failed:', err));
      }

      // Navigate after 4 seconds
      setTimeout(() => {
        router.push('/wishes');
      }, 4000);
    }
  };

  const handlers = useSwipeable({
    onSwiped: handleCut,
    trackMouse: true,
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <main className="min-h-screen relative flex flex-col items-center justify-center p-4 overflow-hidden">
      <Balloons />
      {showConfetti && <ConfettiEffect duration={4000} />}

      {/* Audio elements */}
      {content?.birthdaySongUrl && (
        <audio ref={audioRef} src={content.birthdaySongUrl} loop />
      )}
      {content?.clapSoundUrl && (
        <audio ref={clapRef} src={content.clapSoundUrl} />
      )}

      <motion.div
        className="relative z-10 max-w-2xl w-full text-center"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Instruction */}
        <AnimatePresence>
          {!isCut && (
            <motion.div
              className="mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.p
                className="text-2xl md:text-3xl text-pink-800 font-bold mb-4 glass-effect rounded-2xl p-6 select-none"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {content?.cakeInstruction || 'Swipe once on the cake to cut it 🎂'}
              </motion.p>
              <motion.p
                className="text-lg text-pink-700 font-semibold select-none"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                👆 Swipe anywhere on the cake
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cake Container */}
        <div {...handlers} onClick={handleCut} className="cursor-pointer touch-none select-none">
          <motion.div
            className="relative select-none"
            animate={isCut ? { scale: [1, 1.1, 1], y: -80 } : {}}
            transition={{ duration: 0.5 }}
          >
            {/* Default cake or uploaded image */}
            {content?.cakeImageUrl ? (
              <div className="relative w-full h-96 md:h-[500px]">
                <Image
                  src={content.cakeImageUrl}
                  alt="Birthday Cake"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            ) : (
              <div className="relative inline-block animate-float">
                <div className="text-9xl md:text-[200px]">🎂</div>
                <div className="absolute top-[58%] left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <h2 className="text-3xl md:text-5xl font-bold text-pink-600" style={{ fontFamily: 'var(--font-dancing)', textShadow: '1px 1px 3px rgba(255,255,255,0.9)' }}>
                    Khushi
                  </h2>
                </div>
              </div>
            )}

            {/* Cutting animation */}
            <AnimatePresence>
              {isCut && (
                <>
                  {/* Cutting slash effect */}
                  <motion.div
                    className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white to-transparent shadow-[0_0_20px_rgba(255,255,255,0.8)] z-50 pointer-events-none"
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{ scaleX: 1, opacity: [0, 1, 1, 0] }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                  />

                  {/* Knife cutting animation - slower and larger */}
                  <motion.div
                    className="absolute top-1/2 -translate-y-1/2 z-50 pointer-events-none"
                    initial={{ x: '-150px', rotate: 45 }}
                    animate={{ x: 'calc(100vw + 150px)', rotate: 45 }}
                    transition={{ duration: 0.8, ease: 'easeInOut' }}
                  >
                    <div className="text-9xl md:text-[180px] drop-shadow-2xl">🔪</div>
                  </motion.div>

                  {/* Stars scattered under the cake - smaller size */}
                  <motion.div
                    className="absolute -z-10 top-[20%] left-[10%] text-2xl md:text-3xl"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    ⭐
                  </motion.div>

                  <motion.div
                    className="absolute -z-10 top-[30%] right-[15%] text-3xl md:text-4xl"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    ✨
                  </motion.div>

                  <motion.div
                    className="absolute -z-10 bottom-[25%] left-[20%] text-2xl md:text-3xl"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    💫
                  </motion.div>

                  <motion.div
                    className="absolute -z-10 bottom-[20%] right-[10%] text-3xl md:text-4xl"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    ⭐
                  </motion.div>

                  <motion.div
                    className="absolute -z-10 top-1/2 left-[5%] text-2xl"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.35 }}
                  >
                    ✨
                  </motion.div>

                  <motion.div
                    className="absolute -z-10 top-1/2 right-[8%] text-2xl"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.55 }}
                  >
                    💫
                  </motion.div>

                  {/* Center celebration */}
                  <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    transition={{ duration: 1, delay: 0.3 }}
                  >
                    <div className="text-6xl">🎉</div>
                  </motion.div>

                  {/* Cake pieces */}
                  <motion.div
                    className="absolute top-1/2 left-1/4 text-7xl z-30"
                    initial={{ x: 0, y: 0, rotate: 0 }}
                    animate={{ x: -100, y: 50, rotate: -45 }}
                    transition={{ duration: 1, delay: 0.2 }}
                  >
                    🍰
                  </motion.div>

                  <motion.div
                    className="absolute top-1/2 right-1/4 text-7xl z-30"
                    initial={{ x: 0, y: 0, rotate: 0 }}
                    animate={{ x: 100, y: 50, rotate: 45 }}
                    transition={{ duration: 1, delay: 0.2 }}
                  >
                    🍰
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Success message */}
        <AnimatePresence>
          {isCut && (
            <motion.div
              className="mt-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <motion.p
                className="text-3xl md:text-4xl text-romantic-700 font-bold glass-effect rounded-2xl p-6 select-none"
                style={{ fontFamily: 'var(--font-dancing)' }}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                Yay! Cake Cut Successfully! 🎊
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Candles */}
      <div className="fixed top-10 left-10 text-4xl animate-float">🕯️</div>
      <div className="fixed top-10 right-10 text-4xl animate-float" style={{ animationDelay: '0.5s' }}>🕯️</div>
      <div className="fixed bottom-10 left-20 text-4xl animate-float" style={{ animationDelay: '1s' }}>🕯️</div>
      <div className="fixed bottom-10 right-20 text-4xl animate-float" style={{ animationDelay: '1.5s' }}>🕯️</div>
    </main>
  );
}
