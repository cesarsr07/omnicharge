'use client';

import React from 'react';

interface MetricCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtext?: string;
  onClick?: () => void;
  accentColor?: 'blue' | 'emerald' | 'amber' | 'rose' | 'indigo';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  icon,
  title,
  value,
  subtext,
  onClick,
  accentColor = 'blue',
}) => {
  const colorThemes = {
    blue: {
      cardBg: 'bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white border-blue-400/30 shadow-[0_15px_35px_-10px_rgba(37,99,235,0.4)]',
      iconBg: 'bg-white/20 text-white backdrop-blur-md',
      titleColor: 'text-blue-100',
      subtextBg: 'bg-white/20 text-white border-white/20',
    },
    emerald: {
      cardBg: 'bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-800 text-white border-emerald-400/30 shadow-[0_15px_35px_-10px_rgba(16,185,129,0.4)]',
      iconBg: 'bg-white/20 text-white backdrop-blur-md',
      titleColor: 'text-emerald-100',
      subtextBg: 'bg-white/20 text-white border-white/20',
    },
    amber: {
      cardBg: 'bg-gradient-to-br from-amber-600 via-yellow-600 to-amber-700 text-white border-amber-400/30 shadow-[0_15px_35px_-10px_rgba(217,119,6,0.4)]',
      iconBg: 'bg-white/20 text-white backdrop-blur-md',
      titleColor: 'text-amber-100',
      subtextBg: 'bg-white/20 text-white border-white/20',
    },
    rose: {
      cardBg: 'bg-gradient-to-br from-rose-600 via-red-600 to-rose-800 text-white border-rose-400/30 shadow-[0_15px_35px_-10px_rgba(225,29,72,0.4)]',
      iconBg: 'bg-white/20 text-white backdrop-blur-md',
      titleColor: 'text-rose-100',
      subtextBg: 'bg-white/20 text-white border-white/20',
    },
    indigo: {
      cardBg: 'bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 text-white border-indigo-400/30 shadow-[0_15px_35px_-10px_rgba(79,70,229,0.4)]',
      iconBg: 'bg-white/20 text-white backdrop-blur-md',
      titleColor: 'text-indigo-100',
      subtextBg: 'bg-white/20 text-white border-white/20',
    },
  };

  const theme = colorThemes[accentColor] || colorThemes.blue;

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden rounded-3xl p-6 border backdrop-blur-xl transition-all duration-300 ${theme.cardBg} ${
        onClick ? 'cursor-pointer hover:-translate-y-1 hover:scale-[1.02]' : ''
      }`}
    >
      <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/10 blur-2xl pointer-events-none" />

      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold ${theme.iconBg}`}>
          {icon}
        </div>
        {subtext && (
          <span className={`text-[11px] font-bold px-3 py-1 rounded-full border backdrop-blur-md ${theme.subtextBg}`}>
            {subtext}
          </span>
        )}
      </div>

      <h3 className={`text-xs font-bold uppercase tracking-wider mb-1 relative z-10 ${theme.titleColor}`}>
        {title}
      </h3>

      <div className="text-3xl font-black tracking-tight text-white relative z-10">
        {value}
      </div>
    </div>
  );
};
