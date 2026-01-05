'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Balloons from '@/components/Balloons';
import ConfettiEffect from '@/components/ConfettiEffect';
import { getPageContent, getGifts, saveUserSelection } from '@/lib/db';
import { PageContent, Gift } from '@/lib/types';
import Image from 'next/image';

export default function GiftsPage() {
  const router = useRouter();
  const [content, setContent] = useState<PageContent | null>(null);
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGifts, setSelectedGifts] = useState<string[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [viewingGift, setViewingGift] = useState<Gift | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customText, setCustomText] = useState('');

  useEffect(() => {
    const loadData = async () => {
      const pageData = await getPageContent();
      const giftsData = await getGifts();

      // Filter enabled gifts that should show in selection and sort by order
      const enabledGifts = giftsData.filter(g => g.enabled && g.showInSelection !== false).sort((a, b) => a.order - b.order);

      setContent(pageData);
      setGifts(enabledGifts);
      setLoading(false);
    };
    loadData();
  }, []);

  const handleSelectGift = (giftId: string, isCustom: boolean = false) => {
    if (!confirmed) {
      if (isCustom) {
        setShowCustomInput(true);
        return;
      }

      setSelectedGifts(prev => {
        if (prev.includes(giftId)) {
          // Deselect if already selected
          return prev.filter(id => id !== giftId);
        } else if (prev.length < 2) {
          // Select if less than 2 selected
          return [...prev, giftId];
        }
        // Already have 2 selected, replace the first one
        return [prev[1], giftId];
      });
    }
  };

  const handleConfirm = async () => {
    if (selectedGifts.length === 2 || (selectedGifts.length === 1 && customText)) {
      setConfirmed(true);
      setShowConfetti(true);

      // Save selections
      for (const giftId of selectedGifts) {
        await saveUserSelection({
          selectedGiftId: giftId,
          customText: giftId === 'custom' ? customText : undefined,
          openedGiftIds: [],
          timestamp: Date.now(),
          userAgent: navigator.userAgent,
        });
      }

      // Navigate to next page after delay
      setTimeout(() => {
        router.push('/luck');
      }, 3000);
    }
  };

  const handleCustomSubmit = () => {
    if (customText.trim()) {
      setSelectedGifts(prev => {
        if (prev.includes('custom')) {
          return prev;
        } else if (prev.length < 2) {
          return [...prev, 'custom'];
        }
        return [prev[1], 'custom'];
      });
      setShowCustomInput(false);
    }
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
      {showConfetti && <ConfettiEffect duration={3000} />}

      <motion.div
        className="relative z-10 max-w-6xl w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="romantic-gradient rounded-2xl p-4 md:p-6 shadow-xl mb-4 inline-block">
            <h1
              className="text-3xl md:text-6xl font-bold text-white"
              style={{ fontFamily: 'var(--font-dancing)' }}
            >
              {content?.giftsTitle || 'Choose Your Gift'}
            </h1>
          </div>
          <p className="text-lg md:text-2xl text-pink-800 font-bold glass-effect rounded-2xl p-3 md:p-4 inline-block block mt-4">
            You can pick any TWO 💝💝
          </p>
        </motion.div>

        {/* Gifts Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 mb-8">
          {gifts.map((gift, index) => (
            <motion.div
              key={gift.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <motion.div
                className={`relative cursor-pointer rounded-2xl md:rounded-3xl overflow-hidden transition-all duration-300 bg-white ${
                  selectedGifts.includes(gift.id)
                    ? 'ring-4 ring-pink-500 shadow-2xl scale-105'
                    : 'shadow-lg hover:shadow-2xl'
                } ${confirmed && !selectedGifts.includes(gift.id) ? 'opacity-50' : ''}`}
                onClick={() => handleSelectGift(gift.id)}
                whileHover={!confirmed ? { scale: 1.05, y: -5 } : {}}
                whileTap={!confirmed ? { scale: 0.95 } : {}}
              >
                {/* Gift Ribbon */}
                <div className="absolute top-0 right-0 w-16 md:w-20 h-16 md:h-20 overflow-hidden z-10">
                  <div className="absolute transform rotate-45 bg-gradient-to-br from-pink-500 via-rose-500 to-rose-600 text-white text-[10px] md:text-xs font-bold py-1 md:py-1.5 right-[-35px] md:right-[-38px] top-[12px] md:top-[16px] w-[110px] md:w-[130px] text-center shadow-lg">
                    GIFT 🎁
                  </div>
                </div>

                {/* Decorative bow at top center */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 md:-translate-y-3 z-10">
                  <div className="text-3xl md:text-4xl filter drop-shadow-lg">🎀</div>
                </div>

                <div className="bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50 p-4 md:p-8 pt-8 md:pt-10 min-h-[200px] md:min-h-[320px] flex flex-col">
                  {/* Gift Image or Icon */}
                  {gift.isCustomText ? (
                    <div className="text-center flex-1 flex flex-col justify-center gap-2 md:gap-4">
                      <div className="text-5xl md:text-7xl mb-1 md:mb-2 animate-bounce">📝</div>
                      <h3 className="text-base md:text-xl font-bold text-romantic-700" style={{ fontFamily: 'var(--font-dancing)' }}>
                        {gift.title}
                      </h3>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setViewingGift(gift);
                          setCurrentImageIndex(0);
                        }}
                        className="w-full py-3 mt-2 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 text-white rounded-xl text-base font-bold hover:from-pink-600 hover:via-rose-600 hover:to-pink-700 transition-all shadow-md hover:shadow-lg"
                      >
                        View Details 🎁
                      </button>
                    </div>
                  ) : gift.images && gift.images.length > 0 ? (
                    <>
                      <div className="relative w-full h-40 mb-4 bg-white rounded-2xl p-3 shadow-inner">
                        <Image
                          src={gift.images[0]}
                          alt={gift.title}
                          fill
                          className="object-contain p-2"
                        />
                        {gift.images.length > 1 && (
                          <div className="absolute bottom-2 right-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                            +{gift.images.length - 1} more
                          </div>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-romantic-700 text-center mb-4" style={{ fontFamily: 'var(--font-dancing)' }}>
                        {gift.title}
                      </h3>
                      <div className="flex-1"></div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setViewingGift(gift);
                          setCurrentImageIndex(0);
                        }}
                        className="w-full py-3 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 text-white rounded-xl text-base font-bold hover:from-pink-600 hover:via-rose-600 hover:to-pink-700 transition-all shadow-md hover:shadow-lg"
                      >
                        View Details 🎁
                      </button>
                    </>
                  ) : (
                    <div className="text-center flex-1 flex flex-col justify-center gap-4">
                      <div className="text-7xl mb-2 animate-pulse">🎁</div>
                      <h3 className="text-xl font-bold text-romantic-700" style={{ fontFamily: 'var(--font-dancing)' }}>
                        {gift.title}
                      </h3>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setViewingGift(gift);
                          setCurrentImageIndex(0);
                        }}
                        className="w-full py-3 mt-2 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 text-white rounded-xl text-base font-bold hover:from-pink-600 hover:via-rose-600 hover:to-pink-700 transition-all shadow-md hover:shadow-lg"
                      >
                        View Details 🎁
                      </button>
                    </div>
                  )}

                  {/* Selection indicator */}
                  <AnimatePresence>
                    {selectedGifts.includes(gift.id) && (
                      <motion.div
                        className="absolute top-3 left-3 bg-gradient-to-br from-green-400 to-green-600 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-xl border-4 border-white"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 180 }}
                        transition={{ type: 'spring', stiffness: 200 }}
                      >
                        <span className="text-2xl">✓</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </motion.div>
          ))}

          {/* Custom Gift Option - 6th Gift */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: gifts.length * 0.1 }}
          >
            <motion.div
              className={`relative cursor-pointer rounded-3xl overflow-hidden transition-all duration-300 bg-white ${
                selectedGifts.includes('custom')
                  ? 'ring-4 ring-pink-500 shadow-2xl scale-105'
                  : 'shadow-lg hover:shadow-2xl'
              } ${confirmed && !selectedGifts.includes('custom') ? 'opacity-50' : ''}`}
              onClick={() => handleSelectGift('custom', true)}
              whileHover={!confirmed ? { scale: 1.05, y: -5 } : {}}
              whileTap={!confirmed ? { scale: 0.95 } : {}}
            >
              {/* Gift Ribbon */}
              <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden z-10">
                <div className="absolute transform rotate-45 bg-gradient-to-br from-pink-500 via-rose-500 to-rose-600 text-white text-xs font-bold py-1.5 right-[-38px] top-[16px] w-[130px] text-center shadow-lg">
                  GIFT 🎁
                </div>
              </div>

              {/* Decorative bow at top center */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-3 z-10">
                <div className="text-4xl filter drop-shadow-lg">🎀</div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 p-8 pt-10 min-h-[320px] flex flex-col">
                <div className="text-center flex-1 flex flex-col justify-center gap-4">
                  <div className="text-7xl mb-2 animate-pulse">✨</div>
                  <h3 className="text-xl font-bold text-romantic-700" style={{ fontFamily: 'var(--font-dancing)' }}>
                    Write Your Wish
                  </h3>
                  <p className="text-sm text-romantic-600">
                    Tell me anything you want! 💝
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowCustomInput(true);
                    }}
                    className="w-full py-3 mt-2 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 text-white rounded-xl text-base font-bold hover:from-purple-600 hover:via-pink-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
                  >
                    {customText ? 'Edit Wish ✏️' : 'Write Wish 📝'}
                  </button>
                </div>

                {/* Selection indicator */}
                <AnimatePresence>
                  {selectedGifts.includes('custom') && (
                    <motion.div
                      className="absolute top-3 left-3 bg-gradient-to-br from-green-400 to-green-600 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-xl border-4 border-white"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 180 }}
                      transition={{ type: 'spring', stiffness: 200 }}
                    >
                      <span className="text-2xl">✓</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Confirm button */}
        <AnimatePresence>
          {selectedGifts.length > 0 && !confirmed && (
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
            >
              <p className="text-lg md:text-xl text-pink-700 font-semibold mb-4">
                {selectedGifts.length === 1 ? 'Pick one more gift!' : `Perfect! You've picked ${selectedGifts.length} gifts! 🎁🎁`}
              </p>
              {selectedGifts.length === 2 && (
                <motion.button
                  onClick={handleConfirm}
                  className="px-8 py-4 md:px-12 md:py-5 bg-gradient-to-r from-pink-500 to-rose-600 text-white text-xl md:text-2xl font-bold rounded-full shadow-lg hover:shadow-2xl transform transition-all duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Confirm My Choices 💝💝
                </motion.button>
              )}
            </motion.div>
          )}

          {confirmed && (
            <motion.div
              className="text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <p className="text-2xl md:text-3xl text-romantic-700 font-bold glass-effect rounded-2xl p-6">
                Great choices! Now let&apos;s test your luck! 🍀
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Gift Details Modal */}
      <AnimatePresence>
        {viewingGift && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setViewingGift(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              {/* Close button */}
              <button
                onClick={() => setViewingGift(null)}
                className="absolute top-4 right-4 bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:bg-gray-100 transition-all z-10"
              >
                ✕
              </button>

              {/* Gift Ribbon */}
              <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden">
                <div className="absolute transform rotate-45 bg-gradient-to-br from-pink-500 to-rose-600 text-white text-sm font-bold py-1 right-[-40px] top-[15px] w-[140px] text-center shadow-md">
                  GIFT
                </div>
              </div>

              <div className="p-6 md:p-8">
                {/* Image Gallery */}
                {viewingGift.images && viewingGift.images.length > 0 && (
                  <div className="mb-6">
                    <div className="relative w-full h-64 md:h-96 bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl overflow-hidden">
                      <Image
                        src={viewingGift.images[currentImageIndex]}
                        alt={viewingGift.title}
                        fill
                        className="object-contain p-4"
                      />
                    </div>

                    {/* Image navigation */}
                    {viewingGift.images.length > 1 && (
                      <div className="flex items-center justify-center gap-4 mt-4">
                        <button
                          onClick={() =>
                            setCurrentImageIndex((prev) =>
                              prev === 0 ? viewingGift.images!.length - 1 : prev - 1
                            )
                          }
                          className="bg-pink-500 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-pink-600 transition-all"
                        >
                          ‹
                        </button>
                        <div className="flex gap-2">
                          {viewingGift.images.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentImageIndex(index)}
                              className={`w-2 h-2 rounded-full transition-all ${
                                index === currentImageIndex
                                  ? 'bg-pink-500 w-8'
                                  : 'bg-gray-300 hover:bg-gray-400'
                              }`}
                            />
                          ))}
                        </div>
                        <button
                          onClick={() =>
                            setCurrentImageIndex((prev) =>
                              prev === viewingGift.images!.length - 1 ? 0 : prev + 1
                            )
                          }
                          className="bg-pink-500 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-pink-600 transition-all"
                        >
                          ›
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Gift Details */}
                <div className="space-y-4">
                  <h2 className="text-3xl md:text-4xl font-bold text-romantic-700 text-center" style={{ fontFamily: 'var(--font-dancing)' }}>
                    {viewingGift.title}
                  </h2>

                  <div className="glass-effect rounded-xl p-6">
                    <p className="text-romantic-700 text-base md:text-lg leading-relaxed">
                      {viewingGift.description}
                    </p>
                  </div>

                  {viewingGift.isCustomText && viewingGift.customText && (
                    <div className="bg-gradient-to-br from-pink-100 to-purple-100 rounded-xl p-6">
                      <p className="text-romantic-700 text-base md:text-lg italic">
                        {viewingGift.customText}
                      </p>
                    </div>
                  )}

                  <button
                    onClick={() => {
                      setViewingGift(null);
                      handleSelectGift(viewingGift.id);
                    }}
                    className="w-full py-3 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-xl text-lg font-bold hover:from-pink-600 hover:to-rose-700 transition-all shadow-lg"
                  >
                    Select This Gift 💝
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Text Input Modal */}
      <AnimatePresence>
        {showCustomInput && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowCustomInput(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden"
            >
              {/* Close button */}
              <button
                onClick={() => setShowCustomInput(false)}
                className="absolute top-4 right-4 bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:bg-gray-100 transition-all z-10"
              >
                ✕
              </button>

              <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-6 text-white text-center">
                <div className="text-6xl mb-3">✨</div>
                <h2 className="text-3xl font-bold" style={{ fontFamily: 'var(--font-dancing)' }}>
                  Write Your Wish
                </h2>
                <p className="text-purple-100 mt-2">
                  Tell me anything you want! 💝
                </p>
              </div>

              <div className="p-6 space-y-4">
                <textarea
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="Write your wish here... What would you like? 🎁"
                  className="w-full h-40 p-4 border-2 border-pink-200 rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none resize-none text-romantic-700"
                  autoFocus
                />

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setCustomText('');
                      setShowCustomInput(false);
                    }}
                    className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCustomSubmit}
                    disabled={!customText.trim()}
                    className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                  >
                    Save Wish 💝
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
