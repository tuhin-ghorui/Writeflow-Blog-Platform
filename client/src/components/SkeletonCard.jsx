import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 rounded-3xl overflow-hidden shadow-sm animate-pulse">
      <div className="bg-slate-200 dark:bg-slate-800 h-52 w-full"></div>
      <div className="p-6 space-y-4">
        <div className="flex space-x-2">
          <div className="bg-slate-200 dark:bg-slate-800 h-5 w-20 rounded-full"></div>
          <div className="bg-slate-200 dark:bg-slate-800 h-5 w-16 rounded-full"></div>
        </div>
        <div className="space-y-2">
          <div className="bg-slate-200 dark:bg-slate-800 h-6 w-3/4 rounded-lg"></div>
          <div className="bg-slate-200 dark:bg-slate-800 h-6 w-full rounded-lg"></div>
        </div>
        <div className="bg-slate-200 dark:bg-slate-800 h-4 w-5/6 rounded"></div>
        <div className="flex items-center space-x-3 pt-4 border-t border-slate-100 dark:border-slate-800/40">
          <div className="bg-slate-200 dark:bg-slate-800 h-9 w-9 rounded-full"></div>
          <div className="space-y-1.5 flex-1">
            <div className="bg-slate-200 dark:bg-slate-800 h-3.5 w-24 rounded"></div>
            <div className="bg-slate-200 dark:bg-slate-800 h-3 w-16 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
