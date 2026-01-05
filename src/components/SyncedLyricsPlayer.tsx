'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LyricLine {
  time: number;
  text: string;
}

interface SyncedLyricsPlayerProps {
  songTitle: string;
  songUrl: string;
  lyrics: LyricLine[];
  onClose: () => void;
}

export default function SyncedLyricsPlayer({ songTitle, songUrl, lyrics, onClose }: SyncedLyricsPlayerProps) {
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentLineIndex, setCurrentLineIndex] = useState(-1);
  const [showThankYou, setShowThankYou] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const lyricsContainerRef = useRef<HTMLDivElement>(null);
  const activeLyricRef = useRef<HTMLDivElement>(null);

  // Playback control functions
  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
  };

  const skipTime = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime + seconds);
    }
  };

  const seekToTime = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  // Extract YouTube video ID if it's a YouTube URL
  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const youtubeId = getYouTubeId(songUrl);
  const isYouTube = !!youtubeId;

  useEffect(() => {
    if (!isYouTube && audioRef.current) {
      const audio = audioRef.current;

      const updateTime = () => {
        setCurrentTime(audio.currentTime);
      };

      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);
      const handleEnded = () => {
        setIsPlaying(false);
        setShowThankYou(true);
      };

      audio.addEventListener('timeupdate', updateTime);
      audio.addEventListener('play', handlePlay);
      audio.addEventListener('pause', handlePause);
      audio.addEventListener('ended', handleEnded);

      return () => {
        audio.removeEventListener('timeupdate', updateTime);
        audio.removeEventListener('play', handlePlay);
        audio.removeEventListener('pause', handlePause);
        audio.removeEventListener('ended', handleEnded);
      };
    }
  }, [isYouTube]);

  useEffect(() => {
    // Find current lyric line based on time
    const index = lyrics.findIndex((line, i) => {
      const nextLine = lyrics[i + 1];
      return currentTime >= line.time && (!nextLine || currentTime < nextLine.time);
    });
    setCurrentLineIndex(index);
  }, [currentTime, lyrics]);


  // For YouTube, use postMessage API to get current time
  useEffect(() => {
    if (isYouTube) {
      const interval = setInterval(() => {
        setCurrentTime(prev => prev + 0.1);
      }, 100);

      setTimeout(() => setIsPlaying(true), 1000);

      return () => clearInterval(interval);
    }
  }, [isYouTube]);

  // Check if song has ended (for YouTube or when past last lyric)
  useEffect(() => {
    if (lyrics.length > 0) {
      const lastLyric = lyrics[lyrics.length - 1];
      // Show thank you message 3 seconds after the last lyric
      if (currentTime > lastLyric.time + 3) {
        setShowThankYou(true);
        setIsPlaying(false);
      }
    }
  }, [currentTime, lyrics]);

  return (
    <motion.div
      className="fixed inset-0 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-pink-900 to-rose-900">
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{
            background: [
              'radial-gradient(circle at 20% 50%, rgba(236, 72, 153, 0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 50%, rgba(168, 85, 247, 0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 50% 80%, rgba(236, 72, 153, 0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 20% 50%, rgba(236, 72, 153, 0.3) 0%, transparent 50%)',
            ],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-50 bg-white/20 backdrop-blur-sm text-white rounded-full w-12 h-12 flex items-center justify-center hover:bg-white/30 transition-all"
      >
        ✕
      </button>

      {/* Song Title */}
      <motion.div
        className="absolute top-6 left-6 z-50"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <h2 className="text-2xl md:text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-dancing)' }}>
          🎵 {songTitle}
        </h2>
      </motion.div>

      {/* Hidden Audio Player (for non-YouTube) */}
      {!isYouTube && (
        <audio ref={audioRef} src={songUrl} autoPlay className="hidden" />
      )}

      {/* YouTube Player (hidden, just for audio) */}
      {isYouTube && (
        <iframe
          className="absolute opacity-0 pointer-events-none"
          width="1"
          height="1"
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&controls=0`}
          allow="autoplay"
        />
      )}

      {/* Lyrics Display - Karaoke Style */}
      <div className="absolute inset-0 flex items-center justify-center px-4">
        <div className="w-full max-w-4xl flex flex-col items-center justify-center space-y-6">
          <AnimatePresence mode="wait">
            {(() => {
              // Show current line and 2 lines before/after for context
              const visibleLines = [];
              const range = 2;

              for (let i = currentLineIndex - range; i <= currentLineIndex + range; i++) {
                if (i >= 0 && i < lyrics.length) {
                  visibleLines.push({ ...lyrics[i], index: i });
                }
              }

              return visibleLines.map((line) => {
                const isActive = line.index === currentLineIndex;
                const distance = Math.abs(line.index - currentLineIndex);

                return (
                  <motion.div
                    key={line.index}
                    className="text-center w-full"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                      opacity: isActive ? 1 : 0.3,
                      y: 0,
                      scale: isActive ? 1.1 : 0.85,
                    }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                  >
                    <motion.p
                      className={`text-2xl md:text-5xl font-bold ${
                        isActive ? 'text-white' : 'text-white/40'
                      }`}
                      style={{ fontFamily: 'var(--font-dancing)' }}
                      animate={isActive ? {
                        textShadow: [
                          '0 0 20px rgba(236, 72, 153, 0.8)',
                          '0 0 40px rgba(236, 72, 153, 0.6)',
                          '0 0 20px rgba(236, 72, 153, 0.8)',
                        ],
                      } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {line.text}
                    </motion.p>
                  </motion.div>
                );
              });
            })()}
          </AnimatePresence>
        </div>
      </div>

      {/* Floating Hearts Animation */}
      {isPlaying && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-4xl"
              initial={{
                x: Math.random() * window.innerWidth,
                y: window.innerHeight + 50,
                opacity: 0.7,
              }}
              animate={{
                y: -100,
                opacity: 0,
              }}
              transition={{
                duration: 8 + Math.random() * 4,
                repeat: Infinity,
                delay: i * 1.5,
                ease: 'linear',
              }}
            >
              {['💕', '❤️', '💖', '💗'][Math.floor(Math.random() * 4)]}
            </motion.div>
          ))}
        </div>
      )}

      {/* Thank You Message */}
      <AnimatePresence>
        {showThankYou && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="text-center px-8"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <motion.h2
                className="text-4xl md:text-6xl font-bold text-white mb-6"
                style={{ fontFamily: 'var(--font-dancing)' }}
                animate={{
                  textShadow: [
                    '0 0 30px rgba(236, 72, 153, 1)',
                    '0 0 60px rgba(236, 72, 153, 0.8)',
                    '0 0 30px rgba(236, 72, 153, 1)',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                💖 Thank you for being a part of my life! 💖
              </motion.h2>
              <motion.button
                onClick={onClose}
                className="mt-8 px-8 py-3 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-full font-semibold text-lg hover:shadow-2xl transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Close
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
