'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Volume2, ShieldCheck } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function VideoModal() {
  const { isVideoOpen, activeVideoItem, closeVideo } = useApp();

  if (!isVideoOpen || !activeVideoItem) return null;

  const defaultSampleVideo = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeVideo}
          className="absolute inset-0 bg-black/90 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-5xl bg-[#0D1226] border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-10"
        >
          {/* Close Button */}
          <button
            onClick={closeVideo}
            className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/60 text-white hover:bg-mayad-gold hover:text-black transition-colors focus:outline-none"
            aria-label="Close player"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Video Container */}
          <div className="relative aspect-video w-full bg-black">
            <video
              src={activeVideoItem.videoUrl || defaultSampleVideo}
              controls
              autoPlay
              className="w-full h-full object-cover"
              poster={activeVideoItem.backdropUrl}
            />
          </div>

          {/* Content Meta */}
          <div className="p-6 md:p-8 bg-gradient-to-b from-[#0D1226] to-[#050816]">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className="px-3 py-1 bg-mayad-gold text-black font-semibold text-xs rounded-full uppercase tracking-wider">
                {activeVideoItem.isOriginal ? 'MAYAD ORIGINAL' : activeVideoItem.category}
              </span>
              <span className="text-xs text-mayad-muted font-medium border border-white/10 px-2.5 py-0.5 rounded">
                {activeVideoItem.language}
              </span>
              {activeVideoItem.duration && (
                <span className="text-xs text-mayad-muted">
                  {activeVideoItem.duration}
                </span>
              )}
              {activeVideoItem.year && (
                <span className="text-xs text-mayad-muted">
                  {activeVideoItem.year}
                </span>
              )}
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              {activeVideoItem.title}
              {activeVideoItem.originalTitle && (
                <span className="block sm:inline text-lg font-normal text-mayad-gold sm:ml-3 mt-1 sm:mt-0">
                  ({activeVideoItem.originalTitle})
                </span>
              )}
            </h3>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl mb-4">
              {activeVideoItem.description}
            </p>

            <div className="flex items-center gap-2 text-xs text-mayad-muted pt-2 border-t border-white/10">
              <ShieldCheck className="w-4 h-4 text-mayad-gold" />
              <span>Authentic Rajasthani Cinema Streaming on MAYAD</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
