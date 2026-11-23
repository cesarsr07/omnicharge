'use client';

import React from 'react';

interface BadgeProps {
  status: string;
}

export const StatusBadge: React.FC<BadgeProps> = ({ status }) => {
  const normalized = status.toLowerCase();

  let styles = 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800/80 dark:text-slate-300 dark:border-slate-700/80 shadow-sm';

  if (['pago', 'recebido', 'disponivel'].includes(normalized)) {
    styles = 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.15)]';
  } else if (['pendente', 'emprestado'].includes(normalized)) {
    styles = 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.15)]';
  } else if (['atrasado', 'vendido', 'indisponivel', 'devedor'].includes(normalized)) {
    styles = 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30 shadow-[0_0_12px_rgba(244,63,94,0.15)]';
  }

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border capitalize tracking-wide ${styles}`}>
      {status}
    </span>
  );
};
