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
  const audioRef = useRef<HTMLAudioElement>(null);

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

      audio.addEventListener('timeupdate', updateTime);
      audio.addEventListener('play', handlePlay);
      audio.addEventListener('pause', handlePause);

      return () => {
        audio.removeEventListener('timeupdate', updateTime);
        audio.removeEventListener('play', handlePlay);
        audio.removeEventListener('pause', handlePause);
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
        {/* Debug Timer - Shows current playback time */}
        <p className="text-sm text-white/70 mt-2 font-mono bg-black/30 px-3 py-1 rounded">
          Time: {currentTime.toFixed(1)}s | Line: {currentLineIndex + 1}/{lyrics.length}
        </p>
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

      {/* Lyrics Display */}
      <div className="absolute inset-0 flex items-center justify-center px-4">
        <div className="w-full max-w-4xl">
          <AnimatePresence mode="wait">
            {lyrics.map((line, index) => {
              const isActive = index === currentLineIndex;
              const isPast = index < currentLineIndex;
              const isNext = index === currentLineIndex + 1;

              if (!isActive && !isPast && !isNext && index !== currentLineIndex + 2) {
                return null;
              }

              return (
                <motion.div
                  key={index}
                  className="text-center mb-8"
                  initial={{ opacity: 0, y: 50, scale: 0.8 }}
                  animate={{
                    opacity: isActive ? 1 : isPast ? 0.3 : 0.5,
                    y: isActive ? 0 : isPast ? -20 : 20,
                    scale: isActive ? 1.2 : 0.9,
                  }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                >
                  <motion.p
                    className={`text-2xl md:text-5xl font-bold ${
                      isActive ? 'text-white' : 'text-white/50'
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
            })}
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
    </motion.div>
  );
}
