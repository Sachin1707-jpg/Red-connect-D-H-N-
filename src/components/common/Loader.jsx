import React from 'react';
import { Heart } from 'lucide-react';

export const Loader = ({ fullScreen = false, text = 'Loading...' }) => {
  const content = (
    <div className="flex flex-col items-center justify-center gap-3 p-6 text-center">
      <div className="relative flex items-center justify-center">
        <Heart className="w-10 h-10 text-primary animate-heart-pulse fill-primary/30" />
      </div>
      {text && <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wide uppercase animate-pulse">{text}</span>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700">
          {content}
        </div>
      </div>
    );
  }

  return content;
};
