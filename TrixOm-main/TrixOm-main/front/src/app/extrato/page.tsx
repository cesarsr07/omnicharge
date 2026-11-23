'use client';

import React, { useEffect, useState } from 'react';
import {
  ArrowUpRight,
  ArrowDownLeft,
  Landmark,
  Receipt,
  Filter,
} from 'lucide-react';
import { MainLayout } from '../../components/layout/MainLayout';
import { Header } from '../../components/layout/Header';
import { MetricCard } from '../../components/ui/Card';
import { StatusBadge } from '../../components/ui/Badge';
import { useAuth } from '../../contexts/auth-context';
import { financialExtractApi } from '../../api/financialExtractApi';
import { FinancialBalance, FinancialExtractItem } from '../../types/extract';

export default function ExtratoPage() {
  const { user } = useAuth();
  const [extrato, setExtrato] = useState<FinancialExtractItem[]>([]);
  const [balanco, setBalanco] = useState<FinancialBalance | null>(null);
  const [loading, setLoading] = useState(true);
  const [filtroTipo, setFiltroTipo] = useState<string>('');

  const carregarExtrato = async () => {
    if (!user?._id) return;
    try {
      setLoading(true);
      const [itens, resBalanco] = await Promise.all([
        financialExtractApi.listar(user._id, filtroTipo || undefined),
        financialExtractApi.obterBalanco(user._id),
      ]);
      setExtrato(itens);
      setBalanco(resBalanco);
    } catch (err) {
      console.error('Erro ao carregar extrato:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarExtrato();
  }, [user, filtroTipo]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  return (
    <MainLayout>
      <Header
        title="Extrato Financeiro"
        subtitle="Visão unificada das entradas, saídas e balanço líquido em caixa"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <MetricCard
          icon={<ArrowUpRight className="w-6 h-6 text-white" />}
          title="Total de Entradas"
          value={formatCurrency(balanco?.total_entradas || 0)}
          subtext={`${balanco?.qtd_entradas || 0} lançamento(s)`}
          accentColor="emerald"
        />
        <MetricCard
          icon={<ArrowDownLeft className="w-6 h-6 text-white" />}
          title="Total de Saídas"
          value={formatCurrency(balanco?.total_saidas || 0)}
          subtext={`${balanco?.qtd_saidas || 0} pagamento(s)`}
          accentColor="rose"
        />
        <MetricCard
          icon={<Landmark className="w-6 h-6 text-white" />}
          title="Saldo Líquido em Caixa"
          value={formatCurrency(balanco?.saldo_liquido || 0)}
          subtext="Balanço acumulado do período"
          accentColor="indigo"
        />
      </div>

      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-lg font-extrabold text-slate-100 flex items-center gap-2">
            <Receipt className="w-5 h-5 text-blue-400" />
            <span>Lançamentos Financeiros</span>
          </h2>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-bold text-slate-400">Filtrar:</span>
            <select
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
              className="bg-slate-950/80 border border-slate-800 text-slate-200 text-xs font-semibold rounded-2xl px-4 py-2 focus:outline-none focus:border-blue-500"
            >
              <option value="">Todos os Lançamentos</option>
              <option value="Entrada">Somente Entradas</option>
              <option value="Saida">Somente Saídas</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-10 text-slate-400 font-semibold">Carregando extrato...</div>
        ) : extrato.length === 0 ? (
          <div className="text-center py-10 text-slate-400 font-semibold">Nenhum lançamento no período.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/60 text-slate-400 uppercase text-[11px] font-bold tracking-wider">
                <tr>
                  <th className="p-4 rounded-l-2xl">Tipo</th>
                  <th className="p-4 whitespace-nowrap">Título / Contato</th>
                  <th className="p-4">Categoria</th>
                  <th className="p-4">Valor</th>
                  <th className="p-4">Data</th>
                  <th className="p-4 rounded-r-2xl">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {extrato.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-bold">
                      {item.tipo === 'Entrada' ? (
                        <span className="text-emerald-400 flex items-center gap-1">
                          <ArrowUpRight className="w-4 h-4" /> Entrada
                        </span>
                      ) : (
                        <span className="text-rose-400 flex items-center gap-1">
                          <ArrowDownLeft className="w-4 h-4" /> Saída
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-slate-100">{item.titulo}</div>
                      {item.nome_contato && <div className="text-xs text-slate-400">{item.nome_contato}</div>}
                    </td>
                    <td className="p-4 text-xs text-slate-400">{item.categoria || 'Geral'}</td>
                    <td
                      className={`p-4 font-extrabold whitespace-nowrap ${
                        item.tipo === 'Entrada' ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {item.tipo === 'Entrada' ? '+' : '-'} {formatCurrency(item.valor)}
                    </td>
                    <td className="p-4 text-xs text-slate-400">
                      {item.data_pagamento
                        ? new Date(item.data_pagamento).toLocaleDateString('pt-BR')
                        : item.criado_em
                        ? new Date(item.criado_em).toLocaleDateString('pt-BR')
                        : '-'}
                    </td>
                    <td className="p-4">
                      <StatusBadge status={item.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
