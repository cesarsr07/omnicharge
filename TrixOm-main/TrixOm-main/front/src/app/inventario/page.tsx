'use client';

import React, { useEffect, useState, useMemo } from 'react';
import {
  Package,
  CircleDollarSign,
  Tags,
  Plus,
  ShoppingCart,
  Tag,
  Search,
  X,
} from 'lucide-react';
import { MainLayout } from '../../components/layout/MainLayout';
import { Header } from '../../components/layout/Header';
import { MetricCard } from '../../components/ui/Card';
import { StatusBadge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { useAuth } from '../../contexts/auth-context';
import { productApi } from '../../api/productApi';
import { Product } from '../../types/product';

export default function InventarioPage() {
  const { user } = useAuth();
  const [produtos, setProdutos] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  // Estados de filtro
  const [busca, setBusca] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('todas');
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [filtroQualidade, setFiltroQualidade] = useState('todas');

  // Form state
  const [nome, setNome] = useState('');
  const [categoria, setCategoria] = useState('');
  const [preco, setPreco] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [qualidade, setQualidade] = useState('Nova');
  const [descricao, setDescricao] = useState('');

  const carregarProdutos = async () => {
    if (!user?._id) return;
    try {
      setLoading(true);
      const lista = await productApi.listar(user._id);
      setProdutos(lista);
    } catch (err) {
      console.error('Erro ao carregar produtos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarProdutos();
  }, [user]);

  const handleCriarProduto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?._id) return;

    try {
      await productApi.adicionar({
        usuario_id: user._id,
        nome,
        categoria,
        preco: parseFloat(preco || '0'),
        quantidade: parseInt(quantidade || '0'),
        qualidade,
        descricao,
      });

      setModalOpen(false);
      setNome('');
      setCategoria('');
      setPreco('');
      setQuantidade('');
      setQualidade('Nova');
      setDescricao('');
      carregarProdutos();
    } catch (err: any) {
      alert(err.message || 'Erro ao criar produto');
    }
  };

  const handleVender = async (id: string) => {
    if (!user?._id) return;
    const qtdStr = prompt('Quantidade a vender:', '1');
    if (!qtdStr) return;
    const qtd = parseInt(qtdStr);
    if (isNaN(qtd) || qtd <= 0) return alert('Quantidade inválida');

    try {
      await productApi.vender(id, user._id, qtd, user._id);
      carregarProdutos();
    } catch (err: any) {
      alert(err.message || 'Erro na venda');
    }
  };

  // Lista dinâmica de categorias únicas existentes no estoque
  const categoriasUnicas = useMemo(() => {
    return Array.from(new Set(produtos.map((p) => p.categoria).filter(Boolean)));
  }, [produtos]);

  // Lista dinâmica de status únicos existentes
  const statusUnicos = useMemo(() => {
    return Array.from(new Set(produtos.map((p) => p.status).filter(Boolean)));
  }, [produtos]);

  // Filtragem em tempo real
  const produtosFiltrados = useMemo(() => {
    return produtos.filter((prod) => {
      const termo = busca.toLowerCase().trim();
      const matchTexto =
        !termo ||
        prod.nome.toLowerCase().includes(termo) ||
        (prod.descricao && prod.descricao.toLowerCase().includes(termo));

      const matchCategoria =
        filtroCategoria === 'todas' || prod.categoria === filtroCategoria;

      const matchStatus =
        filtroStatus === 'todos' || prod.status === filtroStatus;

      const matchQualidade =
        filtroQualidade === 'todas' || prod.qualidade === filtroQualidade;

      return matchTexto && matchCategoria && matchStatus && matchQualidade;
    });
  }, [produtos, busca, filtroCategoria, filtroStatus, filtroQualidade]);

  const temFiltroAtivo =
    busca.trim() !== '' ||
    filtroCategoria !== 'todas' ||
    filtroStatus !== 'todos' ||
    filtroQualidade !== 'todas';

  const limparFiltros = () => {
    setBusca('');
    setFiltroCategoria('todas');
    setFiltroStatus('todos');
    setFiltroQualidade('todas');
  };

  const totalProdutos = produtos.reduce((acc, p) => acc + p.quantidade, 0);
  const valorTotalEstoque = produtos.reduce((acc, p) => acc + p.preco * p.quantidade, 0);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  return (
    <MainLayout>
      <Header
        title="Inventário & Produtos"
        subtitle="Gerencie seu estoque, controle vendas e atribuições de equipamentos"
        actionButton={
          <button
            onClick={() => setModalOpen(true)}
            className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 font-bold text-white text-sm rounded-2xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Produto</span>
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <MetricCard
          icon={<Package className="w-6 h-6 text-white" />}
          title="Itens no Estoque"
          value={totalProdutos.toString()}
          subtext={`${produtos.length} tipo(s) de produto(s)`}
          accentColor="blue"
        />
        <MetricCard
          icon={<CircleDollarSign className="w-6 h-6 text-white" />}
          title="Valor Total do Estoque"
          value={formatCurrency(valorTotalEstoque)}
          subtext="Patrimônio em mercadorias"
          accentColor="emerald"
        />
        <MetricCard
          icon={<Tags className="w-6 h-6 text-white" />}
          title="Categorias Ativas"
          value={categoriasUnicas.length.toString()}
          subtext="Divisão de catálogo"
          accentColor="indigo"
        />
      </div>

      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-4 sm:p-6 shadow-2xl">
        {/* Cabeçalho do Catálogo + Contador */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          <h2 className="text-lg font-extrabold text-slate-100 flex items-center gap-2">
            <Tag className="w-5 h-5 text-blue-400" />
            <span>Catálogo de Produtos</span>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300">
              {produtosFiltrados.length}
            </span>
          </h2>

          {temFiltroAtivo && (
            <button
              onClick={limparFiltros}
              className="self-start sm:self-auto text-xs font-bold text-slate-400 hover:text-blue-400 flex items-center gap-1.5 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>Limpar filtros</span>
            </button>
          )}
        </div>

        {/* Barra de Pesquisa e Filtros Responsiva */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 mb-6">
          <div className="sm:col-span-2 lg:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por nome ou descrição..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950/70 border border-slate-800/90 rounded-2xl text-slate-100 placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="lg:col-span-3">
            <select
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950/70 border border-slate-800/90 rounded-2xl text-slate-200 text-xs sm:text-sm focus:outline-none focus:border-blue-500 transition-colors"
            >
              <option value="todas">Categoria: Todas</option>
              {categoriasUnicas.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="lg:col-span-2">
            <select
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950/70 border border-slate-800/90 rounded-2xl text-slate-200 text-xs sm:text-sm focus:outline-none focus:border-blue-500 transition-colors"
            >
              <option value="todos">Status: Todos</option>
              {statusUnicos.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          <div className="lg:col-span-2">
            <select
              value={filtroQualidade}
              onChange={(e) => setFiltroQualidade(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950/70 border border-slate-800/90 rounded-2xl text-slate-200 text-xs sm:text-sm focus:outline-none focus:border-blue-500 transition-colors"
            >
              <option value="todas">Qualidade: Todas</option>
              <option value="Nova">Nova</option>
              <option value="Usada">Usada</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-10 text-slate-400 font-semibold">Carregando estoque...</div>
        ) : produtos.length === 0 ? (
          <div className="text-center py-10 text-slate-400 font-semibold">Nenhum produto cadastrado no estoque.</div>
        ) : produtosFiltrados.length === 0 ? (
          <div className="text-center py-10 space-y-2">
            <p className="text-slate-300 font-semibold">Nenhum produto corresponde aos filtros selecionados.</p>
            <button
              onClick={limparFiltros}
              className="text-xs font-bold text-blue-400 hover:text-blue-300 underline"
            >
              Resetar filtros
            </button>
          </div>
        ) : (
          <>
            {/* Visão Desktop: Tabela */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-950/60 text-slate-400 uppercase text-[11px] font-bold tracking-wider">
                  <tr>
                    <th className="p-4 rounded-l-2xl">Produto</th>
                    <th className="p-4">Categoria</th>
                    <th className="p-4">Preço Unitário</th>
                    <th className="p-4">Estoque</th>
                    <th className="p-4">Qualidade</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 rounded-r-2xl text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {produtosFiltrados.map((prod) => (
                    <tr key={prod._id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-slate-100">{prod.nome}</div>
                        {prod.descricao && <div className="text-xs text-slate-400">{prod.descricao}</div>}
                      </td>
                      <td className="p-4 text-xs font-semibold text-slate-300">{prod.categoria}</td>
                      <td className="p-4 font-extrabold text-slate-100">{formatCurrency(prod.preco)}</td>
                      <td className="p-4 font-extrabold text-blue-400">{prod.quantidade} un.</td>
                      <td className="p-4 text-xs font-semibold text-slate-400">{prod.qualidade}</td>
                      <td className="p-4">
                        <StatusBadge status={prod.status} />
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleVender(prod._id)}
                          disabled={prod.quantidade === 0}
                          className="px-3.5 py-1.5 bg-blue-500/10 hover:bg-blue-500 text-blue-400 hover:text-white rounded-xl text-xs font-bold border border-blue-500/30 transition-all shadow-sm flex items-center gap-1.5 ml-auto disabled:opacity-50"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span>Vender</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Visão Mobile: Cards Empilhados */}
            <div className="grid grid-cols-1 gap-3 md:hidden">
              {produtosFiltrados.map((prod) => (
                <div
                  key={prod._id}
                  className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-bold text-slate-100 text-base">{prod.nome}</div>
                      {prod.descricao && (
                        <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{prod.descricao}</p>
                      )}
                    </div>
                    <StatusBadge status={prod.status} />
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-semibold">
                      {prod.categoria}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 font-semibold">
                      {prod.qualidade}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 font-extrabold">
                      {prod.quantidade} un.
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-800/60">
                    <div>
                      <span className="block text-[11px] uppercase tracking-wider text-slate-500 font-bold">
                        Preço Unitário
                      </span>
                      <span className="font-extrabold text-slate-100 text-sm">
                        {formatCurrency(prod.preco)}
                      </span>
                    </div>

                    <button
                      onClick={() => handleVender(prod._id)}
                      disabled={prod.quantidade === 0}
                      className="px-4 py-2 bg-blue-500/10 hover:bg-blue-500 text-blue-400 hover:text-white rounded-xl text-xs font-bold border border-blue-500/30 transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-50"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>Vender</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Cadastrar Produto no Estoque">
        <form onSubmit={handleCriarProduto} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Nome do Produto *</label>
            <input
              type="text"
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-2xl text-slate-100 text-sm focus:outline-none focus:border-blue-500"
              placeholder="Ex: Mel Silvestre 1kg"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Categoria *</label>
            <input
              type="text"
              required
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-2xl text-slate-100 text-sm focus:outline-none focus:border-blue-500"
              placeholder="Ex: Alimentos, Equipamentos"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Preço (R$)</label>
              <input
                type="number"
                step="0.01"
                value={preco}
                onChange={(e) => setPreco(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-2xl text-slate-100 text-sm focus:outline-none focus:border-blue-500"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Quantidade *</label>
              <input
                type="number"
                required
                value={quantidade}
                onChange={(e) => setQuantidade(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-2xl text-slate-100 text-sm focus:outline-none focus:border-blue-500"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Qualidade</label>
              <select
                value={qualidade}
                onChange={(e) => setQualidade(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-2xl text-slate-100 text-sm focus:outline-none focus:border-blue-500"
              >
                <option value="Nova">Nova</option>
                <option value="Usada">Usada</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Descrição</label>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-2xl text-slate-100 text-sm focus:outline-none focus:border-blue-500 h-20"
              placeholder="Detalhes do produto..."
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm rounded-2xl transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Salvar Produto</span>
          </button>
        </form>
      </Modal>
    </MainLayout>
  );
}