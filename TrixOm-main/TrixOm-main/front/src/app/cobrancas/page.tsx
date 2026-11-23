'use client';

import React, { useEffect, useState } from 'react';
import {
  Wallet,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Receipt,
} from 'lucide-react';
import { MainLayout } from '../../components/layout/MainLayout';
import { Header } from '../../components/layout/Header';
import { MetricCard } from '../../components/ui/Card';
import { StatusBadge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { useAuth } from '../../contexts/auth-context';
import { billReceivableApi } from '../../api/billReceivableApi';
import { BillReceivable } from '../../types/bill';

export default function CobrancasPage() {
  const { user } = useAuth();
  const [contas, setContas] = useState<BillReceivable[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const [contaEditando, setContaEditando] = useState<BillReceivable | null>(null);

  const [nomeDevedor, setNomeDevedor] = useState('');
  const [apelido, setApelido] = useState('');
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [dataVencimento, setDataVencimento] = useState('');
  const [contato, setContato] = useState('');
  const [email, setEmail] = useState('');

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

  // NOVA FUNÇÃO DE MÁSCARA DE TELEFONE
  const formatarTelefone = (valorString: string) => {
    // Remove tudo que não for número
    let v = valorString.replace(/\D/g, '');
    
    // Limita a 11 dígitos (DDD + 9 dígitos)
    if (v.length > 11) v = v.slice(0, 11);

    // Aplica a máscara (XX) XXXXX-XXXX
    if (v.length === 0) return '';
    if (v.length <= 2) return `(${v}`;
    if (v.length <= 6) return `(${v.slice(0, 2)}) ${v.slice(2)}`;
    if (v.length <= 10) return `(${v.slice(0, 2)}) ${v.slice(2, 6)}-${v.slice(6)}`;
    return `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7)}`;
  };

  const carregarDados = async () => {
    if (!user?._id) return;
    try {
      setLoading(true);
      const lista = await billReceivableApi.listar(user._id);
      setContas(lista);
    } catch (err) {
      console.error('Erro ao carregar contas a receber:', err);
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
    setContato('');
    setEmail('');
    setModalOpen(true);
  };

  const abrirModalEditar = (conta: BillReceivable) => {
    setContaEditando(conta);
    setNomeDevedor(conta.nome_devedor);
    setApelido(conta.apelido);
    setDescricao(conta.descricao || '');
    // Formata o valor que vem do banco
    setValor(conta.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
    setDataVencimento(conta.data_vencimento.split('T')[0]);
    // Formata o telefone que vem do banco
    setContato(conta.contato ? formatarTelefone(conta.contato) : '');
    setEmail(conta.email || '');
    setModalOpen(true);
  };

  const fecharModal = () => {
    setModalOpen(false);
    setContaEditando(null);
  };

  const handleCriarCobranca = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?._id) return;

    // Converte a string "1.200,00" de volta para número "1200.00"
    const valorNumerico = parseFloat(valor.replace(/\./g, '').replace(',', '.'));
    
    // Limpa a máscara do telefone para enviar apenas números (opcional, mas recomendado)
    const telefoneNumerico = contato.replace(/\D/g, '');

    try {
      if (contaEditando) {
        await billReceivableApi.editar(contaEditando._id, user._id, {
          nome_devedor: nomeDevedor,
          apelido: apelido || nomeDevedor,
          descricao,
          valor: valorNumerico,
          data_vencimento: dataVencimento,
          contato: telefoneNumerico, // Envia só números
          email,
        });
      } else {
        await billReceivableApi.criar({
          usuario_id: user._id,
          nome_devedor: nomeDevedor,
          apelido: apelido || nomeDevedor,
          descricao,
          valor: valorNumerico,
          data_vencimento: dataVencimento,
          contato: telefoneNumerico, // Envia só números
          email,
        });
      }

      fecharModal();
      carregarDados();
    } catch (err: any) {
      alert(err.message || 'Erro ao salvar cobrança');
    }
  };

  const handleMarcarComoRecebido = async (id: string) => {
    if (!user?._id) return;
    try {
      await billReceivableApi.marcarComoRecebido(id, user._id);
      carregarDados();
    } catch (err: any) {
      alert(err.message || 'Erro ao dar baixa na cobrança');
    }
  };

  const contasPendentes = contas.filter((c) => c.status !== 'recebido');
  const contasRecebidas = contas.filter((c) => c.status === 'recebido');

  const totalAReceber = contasPendentes.reduce((acc, c) => acc + c.valor, 0);
  const totalVencido = contasPendentes
    .filter((c) => c.status === 'atrasado')
    .reduce((acc, c) => acc + c.valor, 0);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  return (
    <MainLayout>
      <Header
        title="Cobranças & Contas a Receber"
        subtitle="Gerencie seus recebimentos, controle pagamentos e cobranças ativas"
        actionButton={
          <button
            onClick={abrirModalCriar}
            className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 font-bold text-white text-sm rounded-2xl shadow-lg shadow-emerald-500/25 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Cobrança</span>
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <MetricCard
          icon={<Wallet className="w-6 h-6 text-white" />}
          title="Total a Receber"
          value={formatCurrency(totalAReceber)}
          subtext={`${contasPendentes.length} cobrança(s) em aberto`}
          accentColor="emerald"
        />
        <MetricCard
          icon={<AlertTriangle className="w-6 h-6 text-white" />}
          title="Cobranças Vencidas"
          value={formatCurrency(totalVencido)}
          subtext={`${contasPendentes.filter((c) => c.status === 'atrasado').length} cliente(s) em atraso`}
          accentColor="rose"
        />
        <MetricCard
          icon={<CheckCircle2 className="w-6 h-6 text-white" />}
          title="Total Já Recebido"
          value={formatCurrency(contasRecebidas.reduce((acc, c) => acc + c.valor, 0))}
          subtext={`${contasRecebidas.length} pagamento(s) efetuado(s)`}
          accentColor="blue"
        />
      </div>

      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 shadow-2xl mb-8">
        <h2 className="text-lg font-extrabold text-slate-100 mb-4 flex items-center gap-2">
          <Receipt className="w-5 h-5 text-emerald-400" />
          <span>Cobranças Pendentes</span>
        </h2>

        {loading ? (
          <div className="text-center py-10 text-slate-400 font-semibold">Carregando cobranças...</div>
        ) : contasPendentes.length === 0 ? (
          <div className="text-center py-10 text-slate-400 font-semibold">Nenhuma cobrança pendente.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/60 text-slate-400 uppercase text-[11px] font-bold tracking-wider">
                <tr>
                  <th className="p-4 whitespace-nowrap rounded-l-2xl">Cliente / Devedor</th>
                  <th className="p-4">Descrição</th>
                  <th className="p-4">Valor</th>
                  <th className="p-4">Vencimento</th>
                  <th className="p-4">Contato</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 rounded-r-2xl text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {contasPendentes.map((conta) => (
                  <tr key={conta._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-bold text-slate-100">{conta.nome_devedor}</td>
                    <td className="p-4 text-slate-300">{conta.apelido}</td>
                    <td className="p-4 font-extrabold text-emerald-400">{formatCurrency(conta.valor)}</td>
                    <td className="p-4 text-slate-400">{new Date(conta.data_vencimento).toLocaleDateString('pt-BR')}</td>
                    {/* Exibe o telefone formatado na tabela */}
                    <td className="p-4 text-xs text-slate-400  whitespace-nowrap min-w-[130px]">
                      {conta.contato ? formatarTelefone(conta.contato) : conta.email || '-'}
                    </td>
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
                        onClick={() => handleMarcarComoRecebido(conta._id)}
                        className="px-3.5 py-1.5 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white rounded-xl text-xs font-bold border border-emerald-500/30 transition-all shadow-sm flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Dar Baixa</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={fecharModal} title={contaEditando ? "Editar Cobrança" : "Cadastrar Cobrança (A Receber)"}>
        <form onSubmit={handleCriarCobranca} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Nome do Cliente / Devedor *</label>
            <input
              type="text"
              required
              value={nomeDevedor}
              onChange={(e) => setNomeDevedor(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-2xl text-slate-100 text-sm focus:outline-none focus:border-blue-500"
              placeholder="Ex: João Silva"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Título / Serviço *</label>
            <input
              type="text"
              required
              value={apelido}
              onChange={(e) => setApelido(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-2xl text-slate-100 text-sm focus:outline-none focus:border-blue-500"
              placeholder="Ex: Venda de Mel / Serviço Prestado"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Valor (R$) *</label>
              <input
                type="text"
                required
                value={valor}
                onChange={(e) => setValor(formatarMoeda(e.target.value))}
                className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-2xl text-slate-100 text-sm focus:outline-none focus:border-blue-500"
                placeholder="0,00"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Vencimento *</label>
              <input
                type="date"
                required
                value={dataVencimento}
                onChange={(e) => setDataVencimento(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-2xl text-slate-100 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Telefone</label>
              <input
                type="tel"
                value={contato}
                onChange={(e) => setContato(formatarTelefone(e.target.value))} // APLICA A MÁSCARA AQUI
                className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-2xl text-slate-100 text-sm focus:outline-none focus:border-blue-500"
                placeholder="(11) 99999-9999"
                maxLength={15} // Limita o tamanho máximo no input
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-2xl text-slate-100 text-sm focus:outline-none focus:border-blue-500"
                placeholder="cliente@email.com"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm rounded-2xl transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2"
          >
            {contaEditando ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Salvar Alterações</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Cadastrar Cobrança</span>
              </>
            )}
          </button>
        </form>
      </Modal>
    </MainLayout>
  );
}