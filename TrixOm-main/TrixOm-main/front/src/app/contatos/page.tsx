'use client';

import React, { useEffect, useState } from 'react';
import {
  Users,
  UserCheck,
  Building,
  Plus,
  Search,
  Trash2,
  Contact as ContactIcon,
} from 'lucide-react';
import { MainLayout } from '../../components/layout/MainLayout';
import { Header } from '../../components/layout/Header';
import { MetricCard } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { useAuth } from '../../contexts/auth-context';
import { contactApi } from '../../api/contactApi';
import { Contact } from '../../types/contact';

export default function ContatosPage() {
  const { user } = useAuth();
  const [contatos, setContatos] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [termoBusca, setTermoBusca] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  // Form state
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState('Ambos');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [observacao, setObservacao] = useState('');

  const carregarContatos = async () => {
    if (!user?._id) return;
    try {
      setLoading(true);
      const lista = await contactApi.listar(user._id, termoBusca || undefined);
      setContatos(lista);
    } catch (err) {
      console.error('Erro ao carregar contatos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarContatos();
  }, [user, termoBusca]);

  const handleCriarContato = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?._id) return;

    try {
      await contactApi.criar({
        usuario_id: user._id,
        nome,
        tipo,
        telefone,
        email,
        observacao,
      });

      setModalOpen(false);
      setNome('');
      setTipo('Ambos');
      setTelefone('');
      setEmail('');
      setObservacao('');
      carregarContatos();
    } catch (err: any) {
      alert(err.message || 'Erro ao criar contato');
    }
  };

  const handleExcluir = async (id: string) => {
    if (!user?._id || !confirm('Deseja excluir este contato?')) return;
    try {
      await contactApi.excluir(id, user._id);
      carregarContatos();
    } catch (err: any) {
      alert(err.message || 'Erro ao excluir contato');
    }
  };

  const devedores = contatos.filter((c) => c.tipo === 'Devedor');
  const credores = contatos.filter((c) => c.tipo === 'Credor');

  return (
    <MainLayout>
      <Header
        title="Central de Contatos"
        subtitle="Gerencie seus clientes, fornecedores, devedores e credores"
        actionButton={
          <button
            onClick={() => setModalOpen(true)}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 font-bold text-white text-sm rounded-2xl shadow-lg shadow-blue-500/25 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Contato</span>
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <MetricCard
          icon={<Users className="w-6 h-6 text-white" />}
          title="Total de Contatos"
          value={contatos.length.toString()}
          subtext="Contatos registrados no sistema"
          accentColor="blue"
        />
        <MetricCard
          icon={<UserCheck className="w-6 h-6 text-white" />}
          title="Clientes / Devedores"
          value={devedores.length.toString()}
          subtext="Para envio de cobranças"
          accentColor="emerald"
        />
        <MetricCard
          icon={<Building className="w-6 h-6 text-white" />}
          title="Fornecedores / Credores"
          value={credores.length.toString()}
          subtext="Para gestão de contas a pagar"
          accentColor="amber"
        />
      </div>

      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-lg font-extrabold text-slate-100 flex items-center gap-2">
            <ContactIcon className="w-5 h-5 text-blue-400" />
            <span>Lista de Contatos</span>
          </h2>
          <div className="w-full sm:w-72 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
              placeholder="Buscar por nome..."
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-950/80 border border-slate-300 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-slate-100 text-xs font-semibold focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-10 text-slate-400 font-semibold">Carregando contatos...</div>
        ) : contatos.length === 0 ? (
          <div className="text-center py-10 text-slate-400 font-semibold">Nenhum contato encontrado.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/60 text-slate-400 uppercase text-[11px] font-bold tracking-wider">
                <tr>
                  <th className="p-4 rounded-l-2xl">Nome</th>
                  <th className="p-4">Tipo</th>
                  <th className="p-4">Telefone</th>
                  <th className="p-4">E-mail</th>
                  <th className="p-4">Observações</th>
                  <th className="p-4 rounded-r-2xl text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {contatos.map((c) => (
                  <tr key={c._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-bold text-slate-100">{c.nome}</td>
                    <td className="p-4">
                      <span className="inline-flex px-3 py-1 rounded-full text-xs font-bold bg-slate-800/80 text-slate-300 border border-slate-700/80">
                        {c.tipo}
                      </span>
                    </td>
                    <td className="p-4 text-slate-300 whitespace-nowrap">{c.telefone || '-'}</td>
                    <td className="p-4 text-slate-300 whitespace-nowrap">{c.email || '-'}</td>
                    <td className="p-4 text-xs text-slate-400 min-w-[150px]">{c.observacao || '-'}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleExcluir(c._id)}
                        className="px-3.5 py-1.5 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white rounded-xl text-xs font-bold border border-rose-500/30 transition-all shadow-sm flex items-center gap-1.5 ml-auto"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Excluir</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Cadastrar Novo Contato">
        <form onSubmit={handleCriarContato} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Nome Completo *</label>
            <input
              type="text"
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full px-4 py-2.5 bg-white dark:bg-slate-950/80 border border-slate-300 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-blue-500"
              placeholder="Ex: Maria Oliveira"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Tipo de Contato</label>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="w-full px-4 py-2.5 bg-white dark:bg-slate-950/80 border border-slate-300 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="Ambos">Ambos (Cliente & Fornecedor)</option>
              <option value="Devedor">Cliente / Devedor</option>
              <option value="Credor">Fornecedor / Credor</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Telefone</label>
              <input
                type="tel"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                className="w-full px-4 py-2.5 bg-white dark:bg-slate-950/80 border border-slate-300 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-blue-500"
                placeholder="(11) 98888-8888"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-white dark:bg-slate-950/80 border border-slate-300 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-blue-500"
                placeholder="contato@email.com"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Observações</label>
            <textarea
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              className="w-full px-4 py-2.5 bg-white dark:bg-slate-950/80 border border-slate-300 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-blue-500 h-20"
              placeholder="Anotações do contato..."
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm rounded-2xl transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Salvar Contato</span>
          </button>
        </form>
      </Modal>
    </MainLayout>
  );
}
