'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Balloons from '@/components/Balloons';
import ConfettiEffect from '@/components/ConfettiEffect';
import { getPageContent, getGifts, getUserSelections, saveUserSelection } from '@/lib/db';
import { PageContent, Gift } from '@/lib/types';
import Image from 'next/image';

type GamePhase = 'intro' | 'showing' | 'hiding' | 'shuffling' | 'selecting' | 'revealed' | 'choosingFinalGift' | 'final';

interface Box {
  id: string;
  gift: Gift;
  position: number;
  isWinBox?: boolean;
}

export default function LuckPage() {
  const [content, setContent] = useState<PageContent | null>(null);
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(true);
  const [phase, setPhase] = useState<GamePhase>('intro');
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [selectedBoxes, setSelectedBoxes] = useState<string[]>([]);
  const [finalSelectedGift, setFinalSelectedGift] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const pageData = await getPageContent();
      const giftsData = await getGifts();
      const enabledGifts = giftsData.filter(g => g.enabled && g.showInLuckGame !== false).sort((a, b) => a.order - b.order);

      setContent(pageData);
      setGifts(enabledGifts);

      // Create special "You Won!" gift
      const winGift: Gift = {
        id: 'win-box',
        title: 'You Won!',
        description: 'Now pick any ONE from the 3 gifts! 🎉',
        images: [],
        enabled: true,
        order: 999,
        isCustomText: false,
      };

      // Initialize boxes - 3 real gifts + 1 win box
      const initialBoxes: Box[] = [
        ...enabledGifts.map((gift, index) => ({
          id: `box-${index}`,
          gift,
          position: index,
          isWinBox: false,
        })),
        {
          id: 'box-win',
          gift: winGift,
          position: enabledGifts.length,
          isWinBox: true,
        }
      ];
      setBoxes(initialBoxes);

      setLoading(false);
    };
    loadData();
  }, []);

  const [shuffleIntensity, setShuffleIntensity] = useState(0);

  useEffect(() => {
    if (phase === 'intro') {
      const timer = setTimeout(() => setPhase('showing'), 1000);
      return () => clearTimeout(timer);
    } else if (phase === 'showing') {
      const timer = setTimeout(() => setPhase('hiding'), 3000);
      return () => clearTimeout(timer);
    } else if (phase === 'hiding') {
      const timer = setTimeout(() => setPhase('shuffling'), 1000);
      return () => clearTimeout(timer);
    } else if (phase === 'shuffling') {
      // Smooth shuffle - fewer swaps with longer animation time between them
      let shuffleCount = 0;
      const maxShuffles = 8; // Fewer but more visible swaps
      
      const shuffleInterval = setInterval(() => {
        shuffleCount++;
        
        setBoxes(prevBoxes => {
          const shuffled = [...prevBoxes];
          // Single swap per interval for clearer movement
          const i = Math.floor(Math.random() * shuffled.length);
          let j = Math.floor(Math.random() * shuffled.length);
          // Ensure we swap different boxes
          while (j === i) {
            j = Math.floor(Math.random() * shuffled.length);
          }
          [shuffled[i].position, shuffled[j].position] = [shuffled[j].position, shuffled[i].position];
          return shuffled;
        });
      }, 500); // Slower interval so each swap is visible
      
      const timer = setTimeout(() => {
        clearInterval(shuffleInterval);
        setShuffleIntensity(0);
        setPhase('selecting');
      }, 4500);
      
      return () => {
        clearInterval(shuffleInterval);
        clearTimeout(timer);
      };
    }
  }, [phase]);

  const shuffleBoxes = () => {
    const shuffled = [...boxes];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i].position, shuffled[j].position] = [shuffled[j].position, shuffled[i].position];
    }
    setBoxes(shuffled);
  };

  const handleSelectBox = async (boxId: string) => {
    if (phase !== 'selecting' || selectedBoxes.length >= 1) return;

    // Always select the win box regardless of which box was clicked
    const winBox = boxes.find(box => box.isWinBox);
    const finalSelection = [winBox?.id || ''];

    setSelectedBoxes(finalSelection);
    setPhase('revealed');
    setShowConfetti(true);

    // Wait 3 seconds then show final gift selection
    setTimeout(() => setPhase('choosingFinalGift'), 3000);
  };

  const handleFinalGiftSelect = async (giftId: string) => {
    if (phase !== 'choosingFinalGift') return;

    setFinalSelectedGift(giftId);
    setShowConfetti(true);

    // Save final gift selection
    const selections = await getUserSelections();
    const lastSelection = selections[0];

    await saveUserSelection({
      selectedGiftId: giftId,
      customText: lastSelection?.customText,
      openedGiftIds: [giftId],
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
    });

    setTimeout(() => setPhase('final'), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner" />
      </div>
    );
  }

  // Always sort boxes by position to enable shuffle animation
  const displayBoxes = [...boxes].sort((a, b) => a.position - b.position);

  return (
    <main className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      <Balloons />
      {showConfetti && <ConfettiEffect duration={5000} />}

      <motion.div
        className="relative z-10 max-w-6xl w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Intro */}
        <AnimatePresence mode="wait">
          {phase === 'intro' && (
            <motion.div
              className="text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <div className="romantic-gradient rounded-2xl p-6 shadow-xl mb-4 inline-block">
                <h1
                  className="text-4xl md:text-6xl font-bold text-white"
                  style={{ fontFamily: 'var(--font-dancing)' }}
                >
                  {content?.luckTitle || "It's time for your luck! 🍀"}
                </h1>
              </div>
              <p className="text-2xl text-pink-800 font-semibold">
                Get ready to test your fortune!
              </p>
            </motion.div>
          )}

          {/* Showing Gifts */}
          {phase === 'showing' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h2 className="text-2xl md:text-4xl text-romantic-700 font-bold text-center mb-6 md:mb-8 px-2">
                Here are all the gifts! Remember them... 👀
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto">
                {displayBoxes.map((box, index) => (
                  <motion.div
                    key={box.id}
                    layoutId={box.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="aspect-square bg-white/50 backdrop-blur-sm rounded-2xl md:rounded-3xl p-3 md:p-6 text-center flex flex-col justify-center shadow-lg"
                  >
                    {box.isWinBox ? (
                      <>
                        <div className="text-4xl md:text-7xl mb-1 md:mb-2 animate-pulse">🏆</div>
                        <p className="text-xs md:text-base font-semibold text-romantic-700">
                          Special Prize!
                        </p>
                      </>
                    ) : box.gift.images?.[0] ? (
                      <div className="relative w-full h-16 md:h-32 mb-1 md:mb-2">
                        <Image
                          src={box.gift.images[0]}
                          alt={box.gift.title}
                          fill
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <div className="text-4xl md:text-7xl mb-1 md:mb-2">
                        {box.gift.isCustomText ? '📝' : '🎁'}
                      </div>
                    )}
                    {!box.isWinBox && (
                      <p className="text-xs md:text-sm font-semibold text-romantic-700 line-clamp-2">
                        {box.gift.title}
                      </p>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Hiding & Shuffling */}
          {(phase === 'hiding' || phase === 'shuffling') && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h2 className="text-3xl md:text-4xl text-romantic-700 font-bold text-center mb-8">
                {phase === 'hiding' ? 'Hiding the gifts...' : 'Shuffling... 🔀'}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto">
                {[...boxes].sort((a, b) => a.position - b.position).map((box) => (
                  <motion.div
                    key={box.id}
                    layoutId={box.id}
                    transition={{ 
                      type: 'spring', 
                      stiffness: 200, 
                      damping: 25,
                    }}
                    className={`aspect-square rounded-3xl flex items-center justify-center shadow-lg ${
                      phase === 'shuffling' 
                        ? 'bg-gradient-to-br from-purple-500 to-pink-500 shadow-2xl shadow-pink-300/50' 
                        : 'bg-gradient-to-br from-purple-400 to-pink-400'
                    }`}
                  >
                    <div className="text-6xl md:text-8xl">
                      📦
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Selecting */}
          {phase === 'selecting' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h2 className="text-3xl md:text-4xl text-romantic-700 font-bold text-center mb-4">
                Pick ANY ONE box! 🎁
              </h2>
              <p className="text-xl text-romantic-600 text-center mb-8">
                Click any box to reveal your prize!
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto">
                {[...boxes].sort((a, b) => a.position - b.position).map((box) => (
                  <motion.div
                    key={box.id}
                    layoutId={box.id}
                    onClick={() => handleSelectBox(box.id)}
                    transition={{ 
                      type: 'spring', stiffness: 200, damping: 25
                    }}
                    className={`aspect-square cursor-pointer rounded-3xl flex items-center justify-center shadow-lg transition-all ${
                      selectedBoxes.includes(box.id)
                        ? 'bg-gradient-to-br from-yellow-300 to-yellow-500 ring-4 ring-yellow-400'
                        : 'bg-gradient-to-br from-purple-400 to-pink-400'
                    }`}
                    whileHover={!selectedBoxes.includes(box.id) ? { scale: 1.05 } : {}}
                    whileTap={!selectedBoxes.includes(box.id) ? { scale: 0.95 } : {}}
                  >
                    <div className="text-6xl md:text-8xl">
                      {selectedBoxes.includes(box.id) ? '✨' : '📦'}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Revealed */}
          {phase === 'revealed' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h2 className="text-3xl md:text-4xl text-romantic-700 font-bold text-center mb-8">
                You opened the box! 🎊
              </h2>
              <div className="max-w-md mx-auto">
                {displayBoxes
                  .filter(box => selectedBoxes.includes(box.id))
                  .map((box, index) => (
                    <motion.div
                      key={box.id}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: index * 0.3, type: 'spring' }}
                      className={`backdrop-blur-sm rounded-2xl p-6 text-center shadow-xl ${
                        box.isWinBox
                          ? 'bg-gradient-to-br from-yellow-200 via-yellow-100 to-yellow-200'
                          : 'bg-white/70'
                      }`}
                    >
                      {box.isWinBox ? (
                        <>
                          <div className="text-8xl mb-4 animate-bounce">🏆</div>
                          <h3 className="text-2xl font-bold text-romantic-700 mb-2">
                            {box.gift.title}
                          </h3>
                          <p className="text-lg text-romantic-600 font-semibold">
                            {box.gift.description}
                          </p>
                        </>
                      ) : box.gift.images?.[0] ? (
                        <>
                          <div className="relative w-full h-32 mb-4">
                            <Image
                              src={box.gift.images[0]}
                              alt={box.gift.title}
                              fill
                              className="object-contain"
                            />
                          </div>
                          <h3 className="text-xl font-bold text-romantic-700">
                            {box.gift.title}
                          </h3>
                          <p className="text-sm text-romantic-600 mt-2">
                            {box.gift.isCustomText ? box.gift.customText : box.gift.description}
                          </p>
                        </>
                      ) : (
                        <>
                          <div className="text-7xl mb-4">
                            {box.gift.isCustomText ? '📝' : '🎁'}
                          </div>
                          <h3 className="text-xl font-bold text-romantic-700">
                            {box.gift.title}
                          </h3>
                          <p className="text-sm text-romantic-600 mt-2">
                            {box.gift.isCustomText ? box.gift.customText : box.gift.description}
                          </p>
                        </>
                      )}
                    </motion.div>
                  ))}
              </div>
            </motion.div>
          )}

          {/* Choosing Final Gift */}
          {phase === 'choosingFinalGift' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h2 className="text-3xl md:text-4xl text-romantic-700 font-bold text-center mb-4">
                Now pick ANY ONE gift! 🎁
              </h2>
              <p className="text-xl text-romantic-600 text-center mb-8">
                Choose wisely! This is your final gift 💝
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {gifts.map((gift, index) => (
                  <motion.div
                    key={gift.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.15 }}
                  >
                    <motion.div
                      onClick={() => handleFinalGiftSelect(gift.id)}
                      className={`relative cursor-pointer rounded-3xl overflow-hidden transition-all duration-300 ${
                        finalSelectedGift === gift.id
                          ? 'ring-4 ring-green-500 shadow-2xl scale-105 bg-green-50'
                          : 'shadow-lg hover:shadow-2xl bg-white'
                      }`}
                      whileHover={!finalSelectedGift ? { scale: 1.05, y: -5 } : {}}
                      whileTap={!finalSelectedGift ? { scale: 0.95 } : {}}
                    >
                      <div className="p-8 min-h-[320px] flex flex-col">
                        {gift.images?.[0] ? (
                          <div className="relative w-full h-40 md:h-48 mb-4">
                            <Image
                              src={gift.images[0]}
                              alt={gift.title}
                              fill
                              className="object-contain"
                            />
                          </div>
                        ) : (
                          <div className="text-7xl md:text-8xl mb-4 text-center">
                            {gift.isCustomText ? '📝' : '🎁'}
                          </div>
                        )}
                        <h3 className="text-lg font-bold text-romantic-700 text-center mb-2">
                          {gift.title}
                        </h3>
                        {finalSelectedGift === gift.id && (
                          <motion.div
                            className="absolute top-3 right-3 bg-gradient-to-br from-green-400 to-green-600 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-xl border-4 border-white"
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: 'spring', stiffness: 200 }}
                          >
                            <span className="text-2xl">✓</span>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Final Message */}
          {phase === 'final' && (
            <motion.div
              className="text-center max-w-3xl mx-auto"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <motion.div
                className="glass-effect rounded-3xl p-8 md:p-12"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="romantic-gradient rounded-2xl p-6 shadow-xl mb-8">
                  <h1
                    className="text-4xl md:text-6xl font-bold text-white"
                    style={{ fontFamily: 'var(--font-dancing)' }}
                  >
                    {content?.finalMessage?.split('\n')[0] || 'All the gifts will be handed over 🎉'}
                  </h1>
                </div>
                <p className="text-2xl md:text-3xl text-pink-800 leading-relaxed mb-8 font-semibold">
                  {content?.finalMessage?.split('\n')[1] || 'Thank you for being a part of my life ❤️'}
                </p>
                <div className="flex justify-center gap-6 text-6xl">
                  <motion.span
                    animate={{ rotate: [0, 20, -20, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    💕
                  </motion.span>
                  <motion.span
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    ❤️
                  </motion.span>
                  <motion.span
                    animate={{ rotate: [0, -20, 20, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    💕
                  </motion.span>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </main>
  );
}
