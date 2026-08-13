import React from 'react';
import { User } from 'lucide-react';
import { clsx } from 'clsx';

export const Avatar = ({
  src,
  name = 'User',
  size = 'md',
  bloodGroup = null,
  className = '',
}) => {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-lg',
    xl: 'w-20 h-20 text-2xl',
  };

  const getInitials = (str) => {
    if (!str) return 'U';
    const parts = str.split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return str.substring(0, 2).toUpperCase();
  };

  return (
    <div className={`relative inline-block ${className}`}>
      {src ? (
        <img
          src={src}
          alt={name}
          className={clsx('rounded-full object-cover border-2 border-white dark:border-slate-800 shadow-sm', sizes[size])}
        />
      ) : (
        <div
          className={clsx(
            'rounded-full bg-gradient-to-tr from-red-600 to-rose-400 text-white font-bold flex items-center justify-center border-2 border-white dark:border-slate-800 shadow-sm',
            sizes[size]
          )}
        >
          {getInitials(name)}
        </div>
      )}
      {bloodGroup && (
        <span className="absolute -bottom-1 -right-1 bg-red-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full border border-white dark:border-slate-800 shadow-sm">
          {bloodGroup}
        </span>
      )}
    </div>
  );
};
