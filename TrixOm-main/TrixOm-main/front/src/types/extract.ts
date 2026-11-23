export interface FinancialExtractItem {
  _id: string;
  usuario_id: string;
  tipo: 'Entrada' | 'Saida';
  categoria?: string;
  titulo: string;
  descricao?: string;
  valor: number;
  data_vencimento?: string;
  data_pagamento?: string;
  status: 'Pendente' | 'Pago' | 'Atrasado';
  codigo_pix?: string;
  qr_code_url?: string;
  origem_tipo?: string;
  origem_id?: string;
  nome_contato?: string;
  criado_em?: string;
}

export interface FinancialBalance {
  mes: number;
  ano: number;
  total_entradas: number;
  total_saidas: number;
  saldo_liquido: number;
  qtd_entradas: number;
  qtd_saidas: number;
}
