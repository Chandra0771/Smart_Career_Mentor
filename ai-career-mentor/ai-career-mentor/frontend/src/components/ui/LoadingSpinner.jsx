import React from 'react';
import { motion } from 'framer-motion';

export const LoadingSpinner = ({ size = 'md', text }) => {
  const sizes = { sm: 'w-6 h-6', md: 'w-12 h-12', lg: 'w-16 h-16' };
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={`${sizes[size]} relative`}>
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-purple-500/30"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
          style={{ borderTopColor: '#8b5cf6', borderRightColor: '#ec4899' }}
        />
      </div>
      {text && <p className="text-white/50 text-sm">{text}</p>}
    </div>
  );
};

export const PageLoader = () => (
  <div className="min-h-screen mesh-bg flex items-center justify-center">
    <LoadingSpinner size="lg" text="Loading..." />
  </div>
);
