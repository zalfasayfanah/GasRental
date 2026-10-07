import React from 'react';

interface SkeletonLoaderProps {
  count?: number;
  type?: 'card' | 'list' | 'stats';
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ count = 3, type = 'card' }) => {
  if (type === 'stats') {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-slate-200/80 rounded-2xl p-4 flex flex-col justify-between">
            <div className="h-4 bg-slate-300 rounded w-1/2"></div>
            <div className="h-8 bg-slate-300 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3 animate-pulse">
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm space-y-3"
        >
          <div className="flex justify-between items-start">
            <div className="space-y-2 flex-1">
              <div className="h-5 bg-slate-200 rounded-md w-3/5"></div>
              <div className="h-4 bg-slate-100 rounded-md w-2/5"></div>
            </div>
            <div className="h-6 w-16 bg-slate-200 rounded-full"></div>
          </div>
          <div className="pt-2 border-t border-slate-50 flex justify-between items-center">
            <div className="h-4 bg-slate-200 rounded w-28"></div>
            <div className="h-8 w-20 bg-slate-200 rounded-xl"></div>
          </div>
        </div>
      ))}
    </div>
  );
};
