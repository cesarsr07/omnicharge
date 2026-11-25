'use client';

import React from 'react';
import {
  Sparkles,
  Wallet,
  Receipt,
  Users,
  Package,
  SlidersHorizontal,
  Play,
  Calendar,
  Filter,
} from 'lucide-react';
import {
  AiDomain,
  AiPeriodFilter,
  AiQueryFilters,
  AiStatusFocus,
  QuickPromptSuggestion,
} from '../../types/aiAssistant';
import {
  AI_DOMAIN_OPTIONS,
  AI_PERIOD_OPTIONS,
  AI_STATUS_OPTIONS,
  buildPromptFromFilters,
} from '../../api/aiAssistantApi';

interface VisualPromptBuilderProps {
  filters: AiQueryFilters;
  onChangeFilters: (next: AiQueryFilters) => void;
  quickPrompts: QuickPromptSuggestion[];
  onSelectQuickPrompt: (suggestion: QuickPromptSuggestion) => void;
  onTriggerFilteredQuery: () => void;
  isLoading: boolean;
}

const DOMAIN_ICONS: Record<AiDomain, React.ReactNode> = {
  todos: <Sparkles className="w-3.5 h-3.5" />,
  cobrancas: <Wallet className="w-3.5 h-3.5" />,
  pagamentos: <Receipt className="w-3.5 h-3.5" />,
  devedores: <Users className="w-3.5 h-3.5" />,
  ativos: <Package className="w-3.5 h-3.5" />,
};

export const VisualPromptBuilder: React.FC<VisualPromptBuilderProps> = ({
  filters,
  onChangeFilters,
  quickPrompts,
  onSelectQuickPrompt,
  onTriggerFilteredQuery,
  isLoading,
}) => {
  const orderedPrompts = React.useMemo(() => {
    if (filters.domain === 'todos') return quickPrompts;
    const matching = quickPrompts.filter((p) => p.domain === filters.domain);
    const others = quickPrompts.filter((p) => p.domain !== filters.domain);
    return [...matching, ...others];
  }, [quickPrompts, filters.domain]);

  const previewPrompt = buildPromptFromFilters(filters);

  return (
    <section
      aria-label="Prompts visuais e filtros de consulta"
      className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-4 sm:p-5 shadow-2xl space-y-4"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-slate-100">
              Construtor Visual de Consultas
            </h2>
            <p className="text-xs text-slate-400">
              Combine módulo, período e status ou clique em uma sugestão rápida
            </p>
          </div>
        </div>
      </div>

      {/* Pills de Domínio */}
      <div className="flex flex-wrap gap-2">
        {AI_DOMAIN_OPTIONS.map((option) => {
          const isSelected = filters.domain === option.value;
          return (
            <button
              key={option.value}
              type="button"
              disabled={isLoading}
              onClick={() => onChangeFilters({ ...filters, domain: option.value })}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                isSelected
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-500/40 shadow-lg shadow-blue-500/20'
                  : 'bg-slate-100/80 dark:bg-slate-950/70 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-blue-500/50 hover:text-blue-600 dark:hover:text-blue-400'
              } disabled:opacity-50`}
            >
              {DOMAIN_ICONS[option.value]}
              <span>{option.label}</span>
            </button>
          );
        })}
      </div>

      {/* Seletores Visuais + Botão Disparar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
        <div className="sm:col-span-4">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-blue-400" />
            <span>Período</span>
          </label>
          <select
            value={filters.period}
            disabled={isLoading}
            onChange={(e) =>
              onChangeFilters({ ...filters, period: e.target.value as AiPeriodFilter })
            }
            className="w-full px-3.5 py-2.5 bg-slate-950/70 border border-slate-800/90 rounded-2xl text-slate-200 text-xs font-semibold focus:outline-none focus:border-blue-500 transition-colors"
          >
            {AI_PERIOD_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-4">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-emerald-400" />
            <span>Foco de Status</span>
          </label>
          <select
            value={filters.statusFocus}
            disabled={isLoading}
            onChange={(e) =>
              onChangeFilters({ ...filters, statusFocus: e.target.value as AiStatusFocus })
            }
            className="w-full px-3.5 py-2.5 bg-slate-950/70 border border-slate-800/90 rounded-2xl text-slate-200 text-xs font-semibold focus:outline-none focus:border-blue-500 transition-colors"
          >
            {AI_STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-4">
          <button
            type="button"
            disabled={isLoading}
            onClick={onTriggerFilteredQuery}
            title={previewPrompt}
            className="w-full px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-2xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Disparar Consulta</span>
          </button>
        </div>
      </div>

      {/* Chips de Sugestões Rápidas */}
      <div className="pt-2 border-t border-slate-200/70 dark:border-slate-800/80">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
          Sugestões rápidas
        </div>
        <div className="flex flex-wrap gap-2">
          {orderedPrompts.map((item) => {
            const isHighlighted =
              filters.domain !== 'todos' && item.domain === filters.domain;
            return (
              <button
                key={item.id}
                type="button"
                disabled={isLoading}
                onClick={() => onSelectQuickPrompt(item)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                  isHighlighted
                    ? 'bg-blue-500/15 border-blue-500/40 text-blue-600 dark:text-blue-300 hover:bg-blue-500 hover:text-white'
                    : 'bg-slate-100/80 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:border-blue-500/40 hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-blue-400'
                } disabled:opacity-50`}
              >
                {DOMAIN_ICONS[item.domain]}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
