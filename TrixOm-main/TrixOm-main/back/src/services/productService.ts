import { Product } from '../models/Product';
import { StockMovement } from '../models/StockMovement';
import { ICreateProductDTO, IProduct, IUpdateProductDTO } from '../types/product.types';

export class ProductService {
  async adicionar(dados: ICreateProductDTO): Promise<IProduct> {
    const produto = new Product(dados);
    return produto.save();
  }

  async adicionarQuantidade(id: string, usuario_id: string, quantidade: number): Promise<IProduct | null> {
    if (quantidade <= 0) {
      throw new Error('Quantidade deve ser maior que zero');
    }

    const produto = await Product.findOneAndUpdate(
      { _id: id, usuario_id },
      { $inc: { quantidade } },
      { new: true }
    );

    return produto;
  }

  async listar(filtro: { usuario_id?: string; categoria?: string; nome?: string; status?: string } = {}): Promise<IProduct[]> {
    const query: Record<string, unknown> = {};

    if (filtro.usuario_id) query.usuario_id = filtro.usuario_id;
    if (filtro.categoria) query.categoria = { $regex: `^${filtro.categoria.trim()}$`, $options: 'i' };
    if (filtro.nome) query.nome = { $regex: filtro.nome, $options: 'i' };
    if (filtro.status) query.status = filtro.status;

    return Product.find(query).sort({ nome: 1 });
  }

  async buscarPorId(id: string): Promise<IProduct | null> {
    return Product.findById(id);
  }

  async editar(id: string, usuario_id: string, dados: IUpdateProductDTO): Promise<IProduct | null> {
    return Product.findOneAndUpdate(
      { _id: id, usuario_id },
      { $set: dados },
      { new: true, runValidators: true }
    );
  }

  async excluir(id: string, usuario_id: string): Promise<{ id: string } | null> {
    const deletado = await Product.findOneAndDelete({ _id: id, usuario_id });
    if (!deletado) return null;
    return { id };
  }

  async vender(id: string, usuario_id: string, quantidade: number, cliente_id: string) {
    const produto = await Product.findOne({ _id: id, usuario_id });
    if (!produto) throw new Error('Produto não encontrado');

    if (produto.quantidade < quantidade) {
      throw new Error(`Estoque insuficiente. Disponível: ${produto.quantidade}`);
    }

    const novaQuantidade = produto.quantidade - quantidade;
    const novoStatus = novaQuantidade === 0 ? 'vendido' : 'disponivel';

    produto.quantidade = novaQuantidade;
    produto.status = novoStatus;
    await produto.save();

    const movimentacao = new StockMovement({
      produto_id: produto._id,
      usuario_id: cliente_id,
      tipo: 'saida',
      quantidade,
      valor_total: produto.preco * quantidade,
      status: 'ativo',
      observacao: `Venda de ${quantidade}x ${produto.nome}`,
    });

    await movimentacao.save();

    return { produto, movimentacao };
  }

  async emprestar(id: string, usuario_id: string, quantidade: number, cliente_id: string, dias_emprestimo: number = 30) {
    const produto = await Product.findOne({ _id: id, usuario_id });
    if (!produto) throw new Error('Produto não encontrado');

    if (produto.quantidade < quantidade) {
      throw new Error(`Estoque insuficiente. Disponível: ${produto.quantidade}`);
    }

    const novaQuantidade = produto.quantidade - quantidade;
    const novoStatus = novaQuantidade === 0 ? 'emprestado' : 'disponivel';

    produto.quantidade = novaQuantidade;
    produto.status = novoStatus;
    await produto.save();

    const movimentacao = new StockMovement({
      produto_id: produto._id,
      usuario_id: cliente_id,
      tipo: 'saida',
      quantidade,
      valor_total: 0,
      status: 'ativo',
      observacao: `Empréstimo de ${quantidade}x ${produto.nome} por ${dias_emprestimo} dias`,
    });

    await movimentacao.save();

    return { produto, movimentacao };
  }

  async devolver(movimentacao_id: string) {
    const movimentacao = await StockMovement.findById(movimentacao_id);
    if (!movimentacao || movimentacao.status !== 'ativo') {
      throw new Error('Movimentação não encontrada ou já finalizada');
    }

    movimentacao.status = 'cancelado';
    movimentacao.observacao += ' - DEVOLVIDO';
    await movimentacao.save();

    const produto = await Product.findById(movimentacao.produto_id);
    if (produto) {
      produto.quantidade += movimentacao.quantidade;
      produto.status = 'disponivel';
      await produto.save();
    }

    return { produto, movimentacao };
  }
}

export const productService = new ProductService();
