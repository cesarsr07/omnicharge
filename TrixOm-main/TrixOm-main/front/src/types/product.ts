export interface Product {
  _id: string;
  usuario_id: string;
  nome: string;
  categoria: string;
  preco: number;
  quantidade: number;
  qualidade: string;
  descricao?: string;
  tipo_atribuicao?: string;
  responsavel?: string;
  data_devolucao?: string | null;
  foto?: string;
  status: 'disponivel' | 'vendido' | 'emprestado' | 'indisponivel' | string;
  criado_em?: string;
}

export interface CreateProductInput {
  usuario_id: string;
  nome: string;
  categoria: string;
  preco: number;
  quantidade: number;
  qualidade?: string;
  descricao?: string;
  tipo_atribuicao?: string;
  responsavel?: string;
  data_devolucao?: string | null;
  foto?: string;
  status?: string;
}

export interface StockMovement {
  _id: string;
  produto_id: string;
  usuario_id: string;
  tipo: 'entrada' | 'saida' | string;
  quantidade: number;
  valor_total: number;
  data_movimentacao: string;
  status: string;
  observacao?: string;
}
