export interface BillPayable {
  _id: string;
  usuario_id: string;
  nome_devedor: string;
  apelido: string;
  descricao?: string;
  valor: number;
  data_vencimento: string;
  contato?: string;
  email?: string;
  codigo_pagamento?: string;
  qr_code_url?: string;
  status: 'pendente' | 'pago' | 'atrasado' | string;
  pago_em?: string | null;
  criado_em?: string;
}

export interface BillReceivable {
  _id: string;
  usuario_id: string;
  nome_devedor: string;
  apelido: string;
  descricao?: string;
  valor: number;
  data_vencimento: string;
  contato?: string;
  email?: string;
  codigo_pagamento?: string;
  qr_code_url?: string;
  status: 'pendente' | 'recebido' | 'atrasado' | string;
  recebido_em?: string | null;
  notificado_em?: string | null;
  criado_em?: string;
}

export interface CreateBillInput {
  usuario_id: string;
  nome_devedor: string;
  apelido: string;
  descricao?: string;
  valor: number;
  data_vencimento: string;
  contato?: string;
  email?: string;
  codigo_pagamento?: string;
  qr_code_url?: string;
  status?: string;
}
