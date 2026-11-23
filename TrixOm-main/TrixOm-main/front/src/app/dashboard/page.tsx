'use client';

import React, { useEffect, useState } from 'react';
import {
  TrendingUp,
  Clock,
  AlertCircle,
  Plus,
  CheckCircle2,
  FileCheck,
} from 'lucide-react';
import { MainLayout } from '../../components/layout/MainLayout';
import { Header } from '../../components/layout/Header';
import { MetricCard } from '../../components/ui/Card';
import { StatusBadge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { useAuth } from '../../contexts/auth-context';
import { billPayableApi } from '../../api/billPayableApi';
import { financialExtractApi } from '../../api/financialExtractApi';
import { BillPayable } from '../../types/bill';
import { FinancialBalance } from '../../types/extract';

export default function DashboardPage() {
  const { user } = useAuth();
  const [contas, setContas] = useState<BillPayable[]>([]);
  const [balanco, setBalanco] = useState<FinancialBalance | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  
  const [contaEditando, setContaEditando] = useState<BillPayable | null>(null);

  const [nomeDevedor, setNomeDevedor] = useState('');
  const [apelido, setApelido] = useState('');
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [dataVencimento, setDataVencimento] = useState('');

  // FUNÇÃO DE MÁSCARA DE MOEDA
  const formatarMoeda = (valorString: string) => {
    const apenasNumeros = valorString.replace(/\D/g, '');
    if (!apenasNumeros) return '';
    const numero = Number(apenasNumeros) / 100;
    return numero.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const carregarDados = async () => {
    if (!user?._id) return;
    try {
      setLoading(true);
      const [listaContas, resBalanco] = await Promise.all([
        billPayableApi.listar(user._id),
        financialExtractApi.obterBalanco(user._id),
      ]);
      setContas(listaContas);
      setBalanco(resBalanco);
    } catch (err) {
      console.error('Erro ao carregar dados do dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, [user]);

  const abrirModalCriar = () => {
    setContaEditando(null);
    setNomeDevedor('');
    setApelido('');
    setDescricao('');
    setValor('');
    setDataVencimento('');
    setModalOpen(true);
  };

  const abrirModalEditar = (conta: BillPayable) => {
    setContaEditando(conta);
    setNomeDevedor(conta.nome_devedor);
    setApelido(conta.apelido);
    setDescricao(conta.descricao || '');
    // Formata o valor que vem do banco para aparecer com vírgula no input
    setValor(conta.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
    setDataVencimento(conta.data_vencimento.split('T')[0]);
    setModalOpen(true);
  };

  const fecharModal = () => {
    setModalOpen(false);
    setContaEditando(null);
  };

  const handleCriarConta = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?._id) return;

    // Converte a string "1.200,00" de volta para número "1200.00"
    const valorNumerico = parseFloat(valor.replace(/\./g, '').replace(',', '.'));

    try {
      if (contaEditando) {
        await billPayableApi.editar(contaEditando._id, user._id, {
          nome_devedor: nomeDevedor,
          apelido: apelido || nomeDevedor,
          descricao,
          valor: valorNumerico,
          data_vencimento: dataVencimento,
        });
      } else {
        await billPayableApi.criar({
          usuario_id: user._id,
          nome_devedor: nomeDevedor,
          apelido: apelido || nomeDevedor,
          descricao,
          valor: valorNumerico,
          data_vencimento: dataVencimento,
        });
      }

      fecharModal();
      carregarDados();
    } catch (err: any) {
      alert(err.message || 'Erro ao salvar conta');
    }
  };

  const handleMarcarComoPago = async (id: string) => {
    if (!user?._id) return;
    try {
      await billPayableApi.marcarComoPago(id, user._id);
      carregarDados();
    } catch (err: any) {
      alert(err.message || 'Erro ao pagar conta');
    }
  };

  const contasPendentes = contas.filter((c) => c.status !== 'pago');
  const contasPagas = contas.filter((c) => c.status === 'pago');

  const totalPendencias = contasPendentes.reduce((acc, c) => acc + c.valor, 0);
  const totalAtraso = contasPendentes
    .filter((c) => c.status === 'atrasado')
    .reduce((acc, c) => acc + c.valor, 0);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  return (
    <MainLayout>
      <Header
        title="Dashboard Financeiro"
        subtitle="Visão geral e controle inteligente das suas contas a pagar"
        actionButton={
          <button
            onClick={abrirModalCriar}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 font-bold text-white text-sm rounded-2xl shadow-lg shadow-blue-500/25 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar Conta</span>
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <MetricCard
          icon={<TrendingUp className="w-6 h-6 text-white" />}
          title="Receita Estimada (Mês)"
          value={formatCurrency(balanco?.total_entradas || 0)}
          subtext="Total acumulado no extrato"
          accentColor="blue"
        />
        <MetricCard
          icon={<Clock className="w-6 h-6 text-white" />}
          title="Pendências a Pagar"
          value={formatCurrency(totalPendencias)}
          subtext={`${contasPendentes.length} conta(s) pendente(s)`}
          accentColor="amber"
        />
        <MetricCard
          icon={<AlertCircle className="w-6 h-6 text-white" />}
          title="Em Atraso"
          value={formatCurrency(totalAtraso)}
          subtext={`${contasPendentes.filter((c) => c.status === 'atrasado').length} conta(s) vencida(s)`}
          accentColor="rose"
        />
      </div>

      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 mb-8 shadow-2xl">
        <h2 className="text-lg font-extrabold text-slate-100 mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-amber-400" />
          <span>Contas Pendentes a Pagar</span>
        </h2>

        {loading ? (
          <div className="text-center py-10 text-slate-400 font-semibold">Carregando contas...</div>
        ) : contasPendentes.length === 0 ? (
          <div className="text-center py-10 text-slate-400 font-semibold">Nenhuma conta pendente cadastrada.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/60 text-slate-400 uppercase text-[11px] font-bold tracking-wider">
                <tr>
                  <th className="p-4 rounded-l-2xl">Credor</th>
                  <th className="p-4 whitespace-nowrap">Descrição / Apelido</th>
                  <th className="p-4">Valor</th>
                  <th className="p-4">Vencimento</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 rounded-r-2xl text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {contasPendentes.map((conta) => (
                  <tr key={conta._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-bold text-slate-100 min-w-[120px]">{conta.nome_devedor}</td>
                    <td className="p-4 text-slate-300 whitespace-nowrap">{conta.apelido}</td>
                    <td className="p-4 font-extrabold text-slate-100">{formatCurrency(conta.valor)}</td>
                    <td className="p-4 text-slate-400">{new Date(conta.data_vencimento).toLocaleDateString('pt-BR')}</td>
                    <td className="p-4">
                      <StatusBadge status={conta.status} />
                    </td>
                    <td className="p-4 text-right flex items-center justify-end gap-2">
                      <button
                        onClick={() => abrirModalEditar(conta)}
                        className="px-3.5 py-1.5 bg-blue-500/10 hover:bg-blue-500 text-blue-400 hover:text-white rounded-xl text-xs font-bold border border-blue-500/30 transition-all shadow-sm"
                      >
                        Editar
                      </button>

                      <button
                        onClick={() => handleMarcarComoPago(conta._id)}
                        className="px-3.5 py-1.5 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white rounded-xl text-xs font-bold border border-emerald-500/30 transition-all shadow-sm flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Baixar Pago</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {contasPagas.length > 0 && (
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 shadow-2xl">
          <h2 className="text-lg font-extrabold text-slate-100 mb-4 flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-emerald-400" />
            <span>Histórico de Contas Pagas</span>
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/60 text-slate-400 uppercase text-[11px] font-bold tracking-wider">
                <tr>
                  <th className="p-4 rounded-l-2xl">Credor</th>
                  <th className="p-4">Apelido</th>
                  <th className="p-4">Valor</th>
                  <th className="p-4">Pago Em</th>
                  <th className="p-4 rounded-r-2xl">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {contasPagas.map((conta) => (
                  <tr key={conta._id} className="opacity-75">
                    <td className="p-4 font-bold text-slate-200 min-w-[120px]">{conta.nome_devedor}</td>
                    <td className="p-4 text-slate-300 whitespace-nowrap">{conta.apelido}</td>
                    <td className="p-4 font-extrabold text-slate-200">{formatCurrency(conta.valor)}</td>
                    <td className="p-4 text-slate-400">
                      {conta.pago_em ? new Date(conta.pago_em).toLocaleDateString('pt-BR') : '-'}
                    </td>
                    <td className="p-4">
                      <StatusBadge status="pago" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={fecharModal} title={contaEditando ? "Editar Conta a Pagar" : "Adicionar Conta a Pagar"}>
        <form onSubmit={handleCriarConta} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Nome do Credor *</label>
            <input
              type="text"
              required
              value={nomeDevedor}
              onChange={(e) => setNomeDevedor(e.target.value)}
              className="w-full px-4 py-2.5 bg-white dark:bg-slate-950/80 border border-slate-300 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-blue-500"
              placeholder="Ex: Copel, Lojas Americanas"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Apelido / Identificação *</label>
            <input
              type="text"
              required
              value={apelido}
              onChange={(e) => setApelido(e.target.value)}
              className="w-full px-4 py-2.5 bg-white dark:bg-slate-950/80 border border-slate-300 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-blue-500"
              placeholder="Ex: Conta de Energia"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Valor (R$) *</label>
              <input
                type="text" // ALTERADO PARA TEXT
                required
                value={valor}
                onChange={(e) => setValor(formatarMoeda(e.target.value))} // USA A MÁSCARA
                className="w-full px-4 py-2.5 bg-white dark:bg-slate-950/80 border border-slate-300 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-blue-500"
                placeholder="0,00"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Data de Vencimento *</label>
              <input
                type="date"
                required
                value={dataVencimento}
                onChange={(e) => setDataVencimento(e.target.value)}
                className="w-full px-4 py-2.5 bg-white dark:bg-slate-950/80 border border-slate-300 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Descrição Opcional</label>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="w-full px-4 py-2.5 bg-white dark:bg-slate-950/80 border border-slate-300 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-blue-500 h-20"
              placeholder="Detalhes adicionais..."
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm rounded-2xl transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
          >
            {contaEditando ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Salvar Alterações</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Salvar Conta</span>
              </>
            )}
          </button>
        </form>
      </Modal>
    </MainLayout>
  );
}