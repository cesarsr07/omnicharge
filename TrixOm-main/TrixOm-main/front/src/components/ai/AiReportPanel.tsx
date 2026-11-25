'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  FileBarChart2,
  Search,
  X,
  Download,
  Sparkles,
  Lightbulb,
  Calendar,
  Layers,
  TrendingUp,
} from 'lucide-react';
import { StatusBadge } from '../ui/Badge';
import {
  AiReportColumn,
  AiReportRow,
  AiStructuredReport,
  ReportAccentColor,
} from '../../types/aiAssistant';

interface AiReportPanelProps {
  reports: AiStructuredReport[];
  activeReportId: string | null;
  onSelectReport: (reportId: string) => void;
  isLoading: boolean;
  onGenerateSampleReport: () => void;
}

const METRIC_THEME: Record<
  ReportAccentColor,
  { card: string; title: string; badge: string }
> = {
  blue: {
    card: 'bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white border-blue-400/30 shadow-[0_12px_28px_-10px_rgba(37,99,235,0.45)]',
    title: 'text-blue-100',
    badge: 'bg-white/15 text-white border-white/20',
  },
  emerald: {
    card: 'bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-800 text-white border-emerald-400/30 shadow-[0_12px_28px_-10px_rgba(16,185,129,0.45)]',
    title: 'text-emerald-100',
    badge: 'bg-white/15 text-white border-white/20',
  },
  amber: {
    card: 'bg-gradient-to-br from-amber-600 via-yellow-600 to-amber-700 text-white border-amber-400/30 shadow-[0_12px_28px_-10px_rgba(217,119,6,0.45)]',
    title: 'text-amber-100',
    badge: 'bg-white/15 text-white border-white/20',
  },
  rose: {
    card: 'bg-gradient-to-br from-rose-600 via-red-600 to-rose-800 text-white border-rose-400/30 shadow-[0_12px_28px_-10px_rgba(225,29,72,0.45)]',
    title: 'text-rose-100',
    badge: 'bg-white/15 text-white border-white/20',
  },
  indigo: {
    card: 'bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 text-white border-indigo-400/30 shadow-[0_12px_28px_-10px_rgba(79,70,229,0.45)]',
    title: 'text-indigo-100',
    badge: 'bg-white/15 text-white border-white/20',
  },
};

const DOMAIN_BADGE_LABELS: Record<string, string> = {
  cobrancas: 'Cobranças',
  pagamentos: 'Pagamentos',
  devedores: 'Devedores',
  ativos: 'Ativos',
  geral: 'Visão Geral',
};

function formatCurrency(val: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
}

function formatCellValue(col: AiReportColumn, rawValue: string | number | undefined): React.ReactNode {
  if (rawValue === undefined || rawValue === null) return '-';

  if (col.type === 'status') {
    return <StatusBadge status={String(rawValue)} />;
  }

  if (col.type === 'currency' && typeof rawValue === 'number') {
    return <span className="font-extrabold text-slate-100 whitespace-nowrap">{formatCurrency(rawValue)}</span>;
  }

  if (col.type === 'date') {
    const parsed = new Date(`${String(rawValue)}T00:00:00`);
    if (!Number.isNaN(parsed.getTime())) {
      return <span className="text-slate-400 whitespace-nowrap">{parsed.toLocaleDateString('pt-BR')}</span>;
    }
  }

  return <span>{String(rawValue)}</span>;
}

export const AiReportPanel: React.FC<AiReportPanelProps> = ({
  reports,
  activeReportId,
  onSelectReport,
  isLoading,
  onGenerateSampleReport,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');

  const activeReport = useMemo(() => {
    if (!reports.length) return null;
    if (activeReportId) {
      return reports.find((r) => r.id === activeReportId) || reports[0];
    }
    return reports[0];
  }, [reports, activeReportId]);

  useEffect(() => {
    setSearchTerm('');
    setStatusFilter('todos');
  }, [activeReport?.id]);

  const availableStatuses = useMemo(() => {
    if (!activeReport) return [];
    const set = new Set<string>();
    activeReport.rows.forEach((row) => {
      if (row.status) set.add(row.status);
    });
    return Array.from(set);
  }, [activeReport]);

  const filteredRows = useMemo(() => {
    if (!activeReport) return [];
    const term = searchTerm.toLowerCase().trim();

    return activeReport.rows.filter((row: AiReportRow) => {
      const matchesStatus = statusFilter === 'todos' || row.status === statusFilter;
      if (!matchesStatus) return false;

      if (!term) return true;
      const inCells = Object.values(row.cells).some((v) =>
        String(v).toLowerCase().includes(term)
      );
      const inSubtitle = row.subtitle ? row.subtitle.toLowerCase().includes(term) : false;
      return inCells || inSubtitle;
    });
  }, [activeReport, searchTerm, statusFilter]);

  const hasActiveFilter = searchTerm.trim() !== '' || statusFilter !== 'todos';

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('todos');
  };

  const handleExportCsv = () => {
    if (!activeReport) return;
    const headers = activeReport.columns.map((c) => `"${c.label}"`).join(';');
    const lines = filteredRows.map((row) =>
      activeReport.columns
        .map((col) => {
          const val = row.cells[col.key] ?? '';
          return `"${String(val).replace(/"/g, '""')}"`;
        })
        .join(';')
    );
    const csvContent = `\uFEFF${[headers, ...lines].join('\n')}`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activeReport.domain}-relatorio-ia.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading && !activeReport) {
    return (
      <section
        aria-label="Painel de relatórios da IA"
        className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-5 animate-pulse"
      >
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-2 w-2/3">
            <div className="h-5 bg-slate-800/80 rounded-xl w-3/4" />
            <div className="h-3.5 bg-slate-800/60 rounded-xl w-full" />
          </div>
          <div className="h-9 w-28 bg-slate-800/80 rounded-2xl" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 rounded-3xl bg-slate-800/60 border border-slate-800" />
          ))}
        </div>

        <div className="h-24 rounded-2xl bg-slate-800/50 border border-slate-800" />
        <div className="h-52 rounded-2xl bg-slate-800/40 border border-slate-800" />
      </section>
    );
  }

  if (!activeReport) {
    return (
      <section
        aria-label="Painel de relatórios da IA"
        className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col items-center justify-center text-center min-h-[420px] lg:min-h-[640px]"
      >
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-blue-600/20 via-indigo-600/20 to-emerald-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-5">
          <FileBarChart2 className="w-8 h-8" />
        </div>

        <h2 className="text-lg font-extrabold text-slate-100 mb-2">
          Nenhum relatório personalizado gerado ainda
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md leading-relaxed mb-6">
          Ao conversar com o assistente ou clicar em uma sugestão rápida de cobranças, pagamentos,
          devedores ou ativos, os indicadores, insights e tabelas aparecerão organizados aqui.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-lg mb-6 text-left">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80">
            <TrendingUp className="w-4 h-4 text-emerald-400 mb-1.5" />
            <div className="text-xs font-extrabold text-slate-900 dark:text-slate-100">
              Cards de Resumo
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Totais e alertas imediatos do recorte.
            </p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80">
            <Lightbulb className="w-4 h-4 text-amber-400 mb-1.5" />
            <div className="text-xs font-extrabold text-slate-900 dark:text-slate-100">
              Insights da IA
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Achados e próxima ação recomendada.
            </p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80">
            <Layers className="w-4 h-4 text-blue-400 mb-1.5" />
            <div className="text-xs font-extrabold text-slate-900 dark:text-slate-100">
              Tabela Filtrável
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Busca, status e exportação CSV.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onGenerateSampleReport}
          className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-lg shadow-blue-500/25 transition-all flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>Gerar relatório de exemplo</span>
        </button>
      </section>
    );
  }

  return (
    <section
      aria-label="Painel de relatórios gerados pela IA"
      className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-5 relative"
    >
      {/* Overlay de atualização quando carregando novo relatório sobre um já existente */}
      {isLoading && (
        <div className="absolute inset-0 z-20 rounded-3xl bg-slate-950/50 backdrop-blur-[2px] flex items-center justify-center p-4">
          <div className="px-5 py-3.5 rounded-2xl bg-slate-900 border border-blue-500/40 shadow-2xl flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-blue-400 animate-spin" />
            <span className="text-xs sm:text-sm font-bold text-slate-100">
              Atualizando relatório com a IA...
            </span>
          </div>
        </div>
      )}

      {/* Histórico de relatórios gerados na sessão */}
      {reports.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 shrink-0">
            Relatórios ({reports.length}):
          </span>
          {reports.map((rep) => {
            const isActive = rep.id === activeReport.id;
            return (
              <button
                key={rep.id}
                type="button"
                onClick={() => onSelectReport(rep.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap border transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-500/40 shadow-md shadow-blue-500/20'
                    : 'bg-slate-100/80 dark:bg-slate-950/60 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-blue-500/40'
                }`}
              >
                {DOMAIN_BADGE_LABELS[rep.domain] || 'Relatório'} ·{' '}
                {new Date(rep.generatedAt).toLocaleTimeString('pt-BR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </button>
            );
          })}
        </div>
      )}

      {/* Cabeçalho do Relatório */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30">
              <Sparkles className="w-3 h-3" />
              {DOMAIN_BADGE_LABELS[activeReport.domain] || 'Relatório IA'}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400">
              <Calendar className="w-3 h-3" />
              {activeReport.periodLabel}
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-100">
            {activeReport.title}
          </h2>
          <p className="text-xs text-slate-400">{activeReport.subtitle}</p>
        </div>

        <button
          type="button"
          onClick={handleExportCsv}
          className="self-start px-3.5 py-2 bg-blue-500/10 hover:bg-blue-500 text-blue-500 dark:text-blue-400 hover:text-white rounded-2xl text-xs font-bold border border-blue-500/30 transition-all shadow-sm flex items-center gap-1.5 shrink-0"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Exportar CSV</span>
        </button>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {activeReport.metrics.map((metric) => {
          const theme = METRIC_THEME[metric.accentColor] || METRIC_THEME.blue;
          return (
            <div
              key={metric.id}
              className={`relative overflow-hidden rounded-3xl p-4 border transition-all ${theme.card}`}
            >
              <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-white/10 blur-2xl pointer-events-none" />
              <div className={`text-[11px] font-bold uppercase tracking-wider mb-1 ${theme.title}`}>
                {metric.title}
              </div>
              <div className="text-xl sm:text-2xl font-black tracking-tight text-white">
                {metric.value}
              </div>
              {metric.subtext && (
                <span
                  className={`mt-2 inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${theme.badge}`}
                >
                  {metric.subtext}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Bloco de Insights e Ação Recomendada */}
      <div className="rounded-2xl p-4 bg-slate-50 dark:bg-slate-950/65 border border-slate-200 dark:border-slate-800/80 space-y-2.5">
        <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-amber-500 dark:text-amber-400">
          <Lightbulb className="w-4 h-4" />
          <span>Síntese Analítica da IA</span>
        </div>
        <ul className="space-y-1.5">
          {activeReport.insights.map((insight, index) => (
            <li
              key={index}
              className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300 leading-relaxed"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
              <span>{insight}</span>
            </li>
          ))}
        </ul>
        <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 text-xs text-slate-700 dark:text-slate-200">
          <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
            Próxima ação recomendada:{' '}
          </span>
          <span>{activeReport.recommendedAction}</span>
        </div>
      </div>

      {/* Filtros simples do relatório */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filtrar linhas por nome, descrição ou contato..."
            className="w-full pl-10 pr-4 py-2 bg-slate-950/70 border border-slate-800/90 rounded-2xl text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2 bg-slate-950/70 border border-slate-800/90 rounded-2xl text-slate-200 text-xs font-semibold focus:outline-none focus:border-blue-500 transition-colors"
          >
            <option value="todos">Status: Todos ({activeReport.rows.length})</option>
            {availableStatuses.map((st) => (
              <option key={st} value={st} className="capitalize">
                {st}
              </option>
            ))}
          </select>

          {hasActiveFilter && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="px-3 py-2 rounded-2xl text-xs font-bold text-slate-400 hover:text-blue-400 bg-slate-800/50 border border-slate-700/60 flex items-center gap-1 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>Limpar</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabela / Lista Estruturada */}
      {filteredRows.length === 0 ? (
        <div className="text-center py-10 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 space-y-2">
          <p className="text-sm font-semibold text-slate-400">
            Nenhum item corresponde aos filtros aplicados neste relatório.
          </p>
          {hasActiveFilter && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="text-xs font-bold text-blue-400 hover:text-blue-300 underline"
            >
              Resetar filtros do relatório
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Desktop: Tabela padrão OmniCharge */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/60 text-slate-400 uppercase text-[11px] font-bold tracking-wider">
                <tr>
                  {activeReport.columns.map((col, idx) => (
                    <th
                      key={col.key}
                      className={`p-3.5 whitespace-nowrap ${
                        idx === 0 ? 'rounded-l-2xl' : ''
                      } ${
                        idx === activeReport.columns.length - 1 ? 'rounded-r-2xl' : ''
                      } ${col.align === 'right' ? 'text-right' : 'text-left'}`}
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredRows.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-800/40 transition-colors">
                    {activeReport.columns.map((col, idx) => (
                      <td
                        key={col.key}
                        className={`p-3.5 text-xs sm:text-sm ${
                          col.align === 'right' ? 'text-right' : 'text-left'
                        } ${idx === 0 ? 'font-bold text-slate-100' : 'text-slate-300'}`}
                      >
                        {formatCellValue(col, row.cells[col.key])}
                        {idx === 0 && row.subtitle && (
                          <div className="text-[11px] font-normal text-slate-400 mt-0.5">
                            {row.subtitle}
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile: Cards estruturados */}
          <div className="md:hidden space-y-3">
            {filteredRows.map((row) => {
              const firstCol = activeReport.columns[0];
              const otherCols = activeReport.columns.slice(1);
              return (
                <div
                  key={row.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/65 border border-slate-200 dark:border-slate-800/80 space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                        {String(row.cells[firstCol.key] ?? '')}
                      </div>
                      {row.subtitle && (
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {row.subtitle}
                        </div>
                      )}
                    </div>
                    {row.status && <StatusBadge status={row.status} />}
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 dark:border-slate-800/80">
                    {otherCols
                      .filter((c) => c.type !== 'status')
                      .map((col) => (
                        <div key={col.key}>
                          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            {col.label}
                          </div>
                          <div className="text-xs font-semibold text-slate-700 dark:text-slate-200 mt-0.5">
                            {formatCellValue(col, row.cells[col.key])}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
};
