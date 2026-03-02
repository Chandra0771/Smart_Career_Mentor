// Simple animated spinner for loading states.

import React from "react";

const LoadingSpinner = ({ fullScreen = false }) => {
  const spinner = (
    <div className="inline-flex items-center gap-3 text-slate-200/90 text-sm">
      <div className="relative h-6 w-6">
        <div className="absolute inset-0 rounded-full border-2 border-slate-700/80" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-brand-400 animate-spin" />
      </div>
      <span className="tracking-wide">Loading your experience...</span>
    </div>
  );

  if (!fullScreen) return spinner;

  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      {spinner}
    </div>
  );
};

export default LoadingSpinner;

