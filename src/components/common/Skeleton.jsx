import React from 'react';
import { clsx } from 'clsx';

export const Skeleton = ({
  className = '',
  variant = 'text', // text, circle, rect
  width,
  height,
}) => {
  const baseStyles = 'animate-pulse bg-slate-200 dark:bg-slate-700/70 rounded';

  const variants = {
    text: 'h-4 w-full rounded',
    circle: 'rounded-full shrink-0',
    rect: 'rounded-xl w-full',
  };

  const style = {
    width: width || undefined,
    height: height || undefined,
  };

  return <div className={clsx(baseStyles, variants[variant], className)} style={style} />;
};

export const CardSkeleton = () => (
  <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
    <div className="flex items-center justify-between">
      <Skeleton variant="circle" width={40} height={40} />
      <Skeleton variant="rect" width={60} height={24} />
    </div>
    <Skeleton variant="text" width="60%" />
    <Skeleton variant="text" width="90%" />
    <div className="pt-2 flex justify-between items-center">
      <Skeleton variant="rect" width={100} height={36} />
      <Skeleton variant="rect" width={80} height={36} />
    </div>
  </div>
);
