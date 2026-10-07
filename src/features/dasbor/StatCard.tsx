import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  variant?: 'emerald' | 'amber' | 'blue' | 'indigo';
}

export const StatCard = ({
  title,
  value,
  subtitle,
  icon,
  variant = 'emerald',
}: StatCardProps) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'emerald':
        return {
          bg: 'bg-emerald-500/10 border-emerald-200/80',
          iconBg: 'bg-emerald-500 text-white',
          valueColor: 'text-emerald-800',
        };
      case 'amber':
        return {
          bg: 'bg-amber-500/10 border-amber-200/80',
          iconBg: 'bg-amber-500 text-white',
          valueColor: 'text-amber-800',
        };
      case 'blue':
        return {
          bg: 'bg-blue-500/10 border-blue-200/80',
          iconBg: 'bg-blue-500 text-white',
          valueColor: 'text-blue-800',
        };
      case 'indigo':
        return {
          bg: 'bg-indigo-500/10 border-indigo-200/80',
          iconBg: 'bg-indigo-500 text-white',
          valueColor: 'text-indigo-800',
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className={`rounded-3xl p-5 border ${styles.bg} bg-white shadow-sm flex flex-col justify-between`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          {title}
        </span>
        <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shadow-sm ${styles.iconBg}`}>
          {icon}
        </div>
      </div>

      <div>
        <div className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${styles.valueColor}`}>
          {value}
        </div>
        {subtitle && <p className="text-xs text-slate-500 mt-1 font-medium">{subtitle}</p>}
      </div>
    </div>
  );
};
