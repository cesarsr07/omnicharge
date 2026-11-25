import {
  AiAssistantQueryRequest,
  AiAssistantQueryResponse,
  AiDomain,
  AiPeriodFilter,
  AiQueryFilters,
  AiStatusFocus,
  AiStructuredReport,
  QuickPromptSuggestion,
} from '../types/aiAssistant';

export const AI_DOMAIN_OPTIONS: { value: AiDomain; label: string }[] = [
  { value: 'todos', label: 'Visão Geral' },
  { value: 'cobrancas', label: 'Cobranças' },
  { value: 'pagamentos', label: 'Pagamentos' },
  { value: 'devedores', label: 'Devedores' },
  { value: 'ativos', label: 'Ativos' },
];

export const AI_PERIOD_OPTIONS: { value: AiPeriodFilter; label: string }[] = [
  { value: '7d', label: 'Próximos / Últimos 7 dias' },
  { value: 'mes_atual', label: 'Mês atual' },
  { value: '30d', label: 'Últimos 30 dias' },
  { value: '90d', label: 'Último trimestre' },
];

export const AI_STATUS_OPTIONS: { value: AiStatusFocus; label: string }[] = [
  { value: 'todos', label: 'Todos os status' },
  { value: 'atrasado', label: 'Em atraso / Críticos' },
  { value: 'pendente', label: 'Pendentes' },
  { value: 'concluido', label: 'Quitados / Disponíveis' },
];

export const MOCK_QUICK_PROMPTS: QuickPromptSuggestion[] = [
  {
    id: 'prompt-cobrancas-atraso',
    label: 'Cobranças em atraso',
    prompt: 'Quais cobranças estão em atraso e exigem ação imediata neste período?',
    domain: 'cobrancas',
    defaultFilters: { domain: 'cobrancas', period: '30d', statusFocus: 'atrasado' },
  },
  {
    id: 'prompt-pagamentos-semana',
    label: 'Pagamentos da semana',
    prompt: 'Mostre o resumo de contas a pagar e saídas previstas para os próximos 7 dias.',
    domain: 'pagamentos',
    defaultFilters: { domain: 'pagamentos', period: '7d', statusFocus: 'pendente' },
  },
  {
    id: 'prompt-ranking-devedores',
    label: 'Maiores devedores',
    prompt: 'Gere um ranking dos principais devedores com valores em aberto e contato para cobrança.',
    domain: 'devedores',
    defaultFilters: { domain: 'devedores', period: 'mes_atual', statusFocus: 'atrasado' },
  },
  {
    id: 'prompt-ativos-estoque',
    label: 'Status dos ativos',
    prompt: 'Analise os ativos e equipamentos do inventário entre disponíveis, emprestados e vendidos.',
    domain: 'ativos',
    defaultFilters: { domain: 'ativos', period: 'mes_atual', statusFocus: 'todos' },
  },
  {
    id: 'prompt-fluxo-cobrancas',
    label: 'Previsão de recebimentos',
    prompt: 'Qual a previsão de recebimento das cobranças pendentes no mês atual?',
    domain: 'cobrancas',
    defaultFilters: { domain: 'cobrancas', period: 'mes_atual', statusFocus: 'pendente' },
  },
  {
    id: 'prompt-pagamentos-quitados',
    label: 'Pagamentos realizados',
    prompt: 'Liste os últimos pagamentos efetuados e o impacto no fluxo de caixa.',
    domain: 'pagamentos',
    defaultFilters: { domain: 'pagamentos', period: '30d', statusFocus: 'concluido' },
  },
];

const PERIOD_LABELS: Record<AiPeriodFilter, string> = {
  '7d': 'Últimos 7 dias',
  mes_atual: 'Mês atual',
  '30d': 'Últimos 30 dias',
  '90d': 'Último trimestre',
};

function createReportId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

function nowIso(): string {
  return new Date().toISOString();
}

function buildCobrancasReport(filters?: AiQueryFilters): AiStructuredReport {
  const periodLabel = PERIOD_LABELS[filters?.period || 'mes_atual'];
  const statusFocus = filters?.statusFocus || 'todos';

  const allRows = [
    {
      id: 'cob-1',
      status: 'atrasado',
      subtitle: 'Vencimento há 9 dias · WhatsApp ativo',
      cells: {
        cliente: 'Mercado Horizonte Ltda',
        descricao: 'Lote Maquininhas Smart POS',
        valor: 4850.0,
        vencimento: '2026-11-16',
        status: 'atrasado',
      },
    },
    {
      id: 'cob-2',
      status: 'atrasado',
      subtitle: 'Vencimento há 4 dias · 2º lembrete pendente',
      cells: {
        cliente: 'João Pedro Almeida',
        descricao: 'Parcela 2/4 — Kit Recarga',
        valor: 1620.0,
        vencimento: '2026-11-21',
        status: 'atrasado',
      },
    },
    {
      id: 'cob-3',
      status: 'pendente',
      subtitle: 'Vence em 3 dias · E-mail enviado',
      cells: {
        cliente: 'Clínica Vida Plena',
        descricao: 'Mensalidade Gestão OmniCharge',
        valor: 2390.0,
        vencimento: '2026-11-28',
        status: 'pendente',
      },
    },
    {
      id: 'cob-4',
      status: 'pendente',
      subtitle: 'Vence em 6 dias',
      cells: {
        cliente: 'Auto Center Paulista',
        descricao: 'Locação Terminais + Taxa Setup',
        valor: 3150.0,
        vencimento: '2026-12-01',
        status: 'pendente',
      },
    },
    {
      id: 'cob-5',
      status: 'recebido',
      subtitle: 'Liquidado via PIX',
      cells: {
        cliente: 'Padaria Estrela Sul',
        descricao: 'Fatura Mensal Cobrança Direta',
        valor: 1890.0,
        vencimento: '2026-11-18',
        status: 'recebido',
      },
    },
  ];

  const rows =
    statusFocus === 'atrasado'
      ? allRows.filter((r) => r.status === 'atrasado')
      : statusFocus === 'pendente'
      ? allRows.filter((r) => r.status === 'pendente')
      : statusFocus === 'concluido'
      ? allRows.filter((r) => r.status === 'recebido')
      : allRows;

  return {
    id: createReportId('rep-cobrancas'),
    title: 'Relatório Inteligente de Cobranças',
    subtitle: 'Mapeamento de contas a receber, atrasos críticos e previsibilidade de entrada',
    domain: 'cobrancas',
    periodLabel,
    generatedAt: nowIso(),
    metrics: [
      {
        id: 'm1',
        title: 'Total em Aberto',
        value: 'R$ 12.010,00',
        subtext: '4 cobranças ativas',
        accentColor: 'emerald',
      },
      {
        id: 'm2',
        title: 'Em Atraso Crítico',
        value: 'R$ 6.470,00',
        subtext: '53,9% do valor aberto',
        accentColor: 'rose',
      },
      {
        id: 'm3',
        title: 'Já Recebido no Período',
        value: 'R$ 1.890,00',
        subtext: 'Liquidação via PIX',
        accentColor: 'blue',
      },
    ],
    insights: [
      'Mercado Horizonte Ltda concentra 74,9% do valor vencido no recorte analisado.',
      'Há R$ 5.540,00 com vencimento nos próximos 7 dias com bom histórico de pagamento.',
      'Envio preventivo de lembrete 48h antes reduz atrasos recorrentes em até 32%.',
    ],
    recommendedAction:
      'Priorize o contato imediato com Mercado Horizonte Ltda e João Pedro Almeida para renegociação ou reenvio do link PIX.',
    columns: [
      { key: 'cliente', label: 'Cliente / Devedor', type: 'text' },
      { key: 'descricao', label: 'Título / Serviço', type: 'text' },
      { key: 'valor', label: 'Valor', type: 'currency', align: 'right' },
      { key: 'vencimento', label: 'Vencimento', type: 'date' },
      { key: 'status', label: 'Status', type: 'status' },
    ],
    rows,
  };
}

function buildPagamentosReport(filters?: AiQueryFilters): AiStructuredReport {
  const periodLabel = PERIOD_LABELS[filters?.period || '7d'];
  const statusFocus = filters?.statusFocus || 'todos';

  const allRows = [
    {
      id: 'pag-1',
      status: 'atrasado',
      subtitle: 'Multa diária prevista após 5 dias',
      cells: {
        credor: 'Copel Energia',
        descricao: 'Energia Matriz Operacional',
        valor: 1420.5,
        vencimento: '2026-11-22',
        status: 'atrasado',
      },
    },
    {
      id: 'pag-2',
      status: 'pendente',
      subtitle: 'Vence em 2 dias',
      cells: {
        credor: 'CloudInfra Brasil',
        descricao: 'Servidores & Banco de Dados',
        valor: 2180.0,
        vencimento: '2026-11-27',
        status: 'pendente',
      },
    },
    {
      id: 'pag-3',
      status: 'pendente',
      subtitle: 'Vence em 5 dias',
      cells: {
        credor: 'LogExpress Entregas',
        descricao: 'Frete de Equipamentos POS',
        valor: 790.0,
        vencimento: '2026-11-30',
        status: 'pendente',
      },
    },
    {
      id: 'pag-4',
      status: 'pago',
      subtitle: 'Pago em 19/11/2026',
      cells: {
        credor: 'Fornecedor TechParts',
        descricao: 'Reposição de Peças e Cabos',
        valor: 3450.0,
        vencimento: '2026-11-19',
        status: 'pago',
      },
    },
  ];

  const rows =
    statusFocus === 'atrasado'
      ? allRows.filter((r) => r.status === 'atrasado')
      : statusFocus === 'pendente'
      ? allRows.filter((r) => r.status === 'pendente')
      : statusFocus === 'concluido'
      ? allRows.filter((r) => r.status === 'pago')
      : allRows;

  return {
    id: createReportId('rep-pagamentos'),
    title: 'Relatório de Pagamentos & Contas a Pagar',
    subtitle: 'Compromissos financeiros, vencimentos próximos e impacto no saldo líquido',
    domain: 'pagamentos',
    periodLabel,
    generatedAt: nowIso(),
    metrics: [
      {
        id: 'p1',
        title: 'Pendências a Pagar',
        value: 'R$ 4.390,50',
        subtext: '3 compromissos ativos',
        accentColor: 'amber',
      },
      {
        id: 'p2',
        title: 'Contas em Atraso',
        value: 'R$ 1.420,50',
        subtext: '1 conta vencida',
        accentColor: 'rose',
      },
      {
        id: 'p3',
        title: 'Total Já Liquidado',
        value: 'R$ 3.450,00',
        subtext: 'Dentro do prazo',
        accentColor: 'indigo',
      },
    ],
    insights: [
      'Infraestrutura de nuvem (CloudInfra) representa 49,6% das saídas pendentes da semana.',
      'A conta da Copel Energia encontra-se vencida há 3 dias e deve ser priorizada para evitar encargos.',
      'O saldo projetado cobre todas as saídas previstas caso ao menos 40% das cobranças pendentes entrem.',
    ],
    recommendedAction:
      'Quite imediatamente a fatura Copel Energia (R$ 1.420,50) e agende CloudInfra Brasil para 27/11.',
    columns: [
      { key: 'credor', label: 'Credor / Fornecedor', type: 'text' },
      { key: 'descricao', label: 'Descrição', type: 'text' },
      { key: 'valor', label: 'Valor', type: 'currency', align: 'right' },
      { key: 'vencimento', label: 'Vencimento', type: 'date' },
      { key: 'status', label: 'Status', type: 'status' },
    ],
    rows,
  };
}

function buildDevedoresReport(filters?: AiQueryFilters): AiStructuredReport {
  const periodLabel = PERIOD_LABELS[filters?.period || 'mes_atual'];

  return {
    id: createReportId('rep-devedores'),
    title: 'Mapa de Devedores & Risco de Inadimplência',
    subtitle: 'Clientes com saldos em aberto ordenados por exposição financeira e dias de atraso',
    domain: 'devedores',
    periodLabel,
    generatedAt: nowIso(),
    metrics: [
      {
        id: 'd1',
        title: 'Devedores Mapeados',
        value: '4 clientes',
        subtext: '2 com atraso ativo',
        accentColor: 'rose',
      },
      {
        id: 'd2',
        title: 'Exposição Total',
        value: 'R$ 13.180,00',
        subtext: 'Ticket médio R$ 3.295,00',
        accentColor: 'amber',
      },
      {
        id: 'd3',
        title: 'Maior Concentração',
        value: '36,8%',
        subtext: 'Mercado Horizonte Ltda',
        accentColor: 'blue',
      },
    ],
    insights: [
      'Dois clientes concentram mais de R$ 6.470,00 em atraso superior a 4 dias.',
      'Todos os devedores listados possuem telefone ou e-mail cadastrado para acionamento direto.',
      'Segmentar cobranças acima de R$ 2.500,00 para atendimento humano melhora a taxa de recuperação.',
    ],
    recommendedAction:
      'Inicie régua de cobrança ativa pelos 2 primeiros colocados do ranking usando os contatos registrados.',
    columns: [
      { key: 'devedor', label: 'Devedor', type: 'text' },
      { key: 'contato', label: 'Contato', type: 'text' },
      { key: 'titulos', label: 'Títulos', type: 'text' },
      { key: 'valor_aberto', label: 'Em Aberto', type: 'currency', align: 'right' },
      { key: 'status', label: 'Situação', type: 'status' },
    ],
    rows: [
      {
        id: 'dev-1',
        status: 'devedor',
        subtitle: '9 dias em atraso · Risco Alto',
        cells: {
          devedor: 'Mercado Horizonte Ltda',
          contato: '(11) 98842-1190',
          titulos: '2 cobranças',
          valor_aberto: 4850.0,
          status: 'devedor',
        },
      },
      {
        id: 'dev-2',
        status: 'atrasado',
        subtitle: '4 dias em atraso · Risco Médio',
        cells: {
          devedor: 'João Pedro Almeida',
          contato: '(11) 97410-3321',
          titulos: '1 cobrança',
          valor_aberto: 1620.0,
          status: 'atrasado',
        },
      },
      {
        id: 'dev-3',
        status: 'pendente',
        subtitle: 'A vencer em 28/11/2026',
        cells: {
          devedor: 'Clínica Vida Plena',
          contato: 'financeiro@vidaplena.com',
          titulos: '1 cobrança',
          valor_aberto: 2390.0,
          status: 'pendente',
        },
      },
      {
        id: 'dev-4',
        status: 'pendente',
        subtitle: 'A vencer em 01/12/2026',
        cells: {
          devedor: 'Auto Center Paulista',
          contato: '(11) 96123-8840',
          titulos: '2 cobranças',
          valor_aberto: 4320.0,
          status: 'pendente',
        },
      },
    ],
  };
}

function buildAtivosReport(filters?: AiQueryFilters): AiStructuredReport {
  const periodLabel = PERIOD_LABELS[filters?.period || 'mes_atual'];
  const statusFocus = filters?.statusFocus || 'todos';

  const allRows = [
    {
      id: 'at-1',
      status: 'disponivel',
      subtitle: 'Categoria: Terminais POS · Condição: Nova',
      cells: {
        ativo: 'Terminal Smart POS A930',
        categoria: 'Terminais POS',
        responsavel: 'Estoque Matriz',
        quantidade: '14 un.',
        patrimonio: 16660.0,
        status: 'disponivel',
      },
    },
    {
      id: 'at-2',
      status: 'emprestado',
      subtitle: 'Devolução prevista: 05/12/2026',
      cells: {
        ativo: 'Kit Totem Autoatendimento',
        categoria: 'Equipamentos',
        responsavel: 'Auto Center Paulista',
        quantidade: '2 un.',
        patrimonio: 6400.0,
        status: 'emprestado',
      },
    },
    {
      id: 'at-3',
      status: 'disponivel',
      subtitle: 'Estoque baixo · Reposição sugerida',
      cells: {
        ativo: 'Leitor NFC Sem Fio',
        categoria: 'Periféricos',
        responsavel: 'Estoque Matriz',
        quantidade: '3 un.',
        patrimonio: 1350.0,
        status: 'disponivel',
      },
    },
    {
      id: 'at-4',
      status: 'vendido',
      subtitle: 'Baixado no último ciclo',
      cells: {
        ativo: 'PinPad USB Pro',
        categoria: 'Periféricos',
        responsavel: 'Mercado Horizonte Ltda',
        quantidade: '5 un.',
        patrimonio: 2750.0,
        status: 'vendido',
      },
    },
  ];

  const rows =
    statusFocus === 'concluido'
      ? allRows.filter((r) => r.status === 'disponivel')
      : statusFocus === 'pendente'
      ? allRows.filter((r) => r.status === 'emprestado')
      : allRows;

  return {
    id: createReportId('rep-ativos'),
    title: 'Diagnóstico de Ativos & Inventário',
    subtitle: 'Distribuição patrimonial, itens emprestados em campo e alertas de reposição',
    domain: 'ativos',
    periodLabel,
    generatedAt: nowIso(),
    metrics: [
      {
        id: 'a1',
        title: 'Patrimônio Analisado',
        value: 'R$ 27.160,00',
        subtext: '24 unidades mapeadas',
        accentColor: 'blue',
      },
      {
        id: 'a2',
        title: 'Ativos Disponíveis',
        value: '17 un.',
        subtext: 'Prontos para alocação/venda',
        accentColor: 'emerald',
      },
      {
        id: 'a3',
        title: 'Ativos Emprestados',
        value: '2 un.',
        subtext: 'Monitorar devolução',
        accentColor: 'amber',
      },
    ],
    insights: [
      'Leitor NFC Sem Fio atingiu nível mínimo (3 unidades) e merece pedido de reposição.',
      '2 kits de Totem estão emprestados para Auto Center Paulista com retorno previsto em 05/12.',
      'Terminais Smart POS A930 representam 61,3% do valor imobilizado em estoque.',
    ],
    recommendedAction:
      'Programe a reposição de Leitores NFC e confirme a devolução ou renovação contratual dos kits emprestados.',
    columns: [
      { key: 'ativo', label: 'Ativo / Produto', type: 'text' },
      { key: 'responsavel', label: 'Local / Responsável', type: 'text' },
      { key: 'quantidade', label: 'Qtd.', type: 'text' },
      { key: 'patrimonio', label: 'Valor Total', type: 'currency', align: 'right' },
      { key: 'status', label: 'Status', type: 'status' },
    ],
    rows,
  };
}

function buildGeralReport(filters?: AiQueryFilters): AiStructuredReport {
  const periodLabel = PERIOD_LABELS[filters?.period || 'mes_atual'];

  return {
    id: createReportId('rep-geral'),
    title: 'Panorama Executivo OmniCharge',
    subtitle: 'Visão consolidada entre recebimentos, contas a pagar, devedores e ativos',
    domain: 'geral',
    periodLabel,
    generatedAt: nowIso(),
    metrics: [
      {
        id: 'g1',
        title: 'Recebíveis Pendentes',
        value: 'R$ 12.010,00',
        subtext: 'R$ 6.470,00 vencidos',
        accentColor: 'emerald',
      },
      {
        id: 'g2',
        title: 'Pagamentos Pendentes',
        value: 'R$ 4.390,50',
        subtext: 'R$ 1.420,50 vencidos',
        accentColor: 'rose',
      },
      {
        id: 'g3',
        title: 'Patrimônio em Ativos',
        value: 'R$ 24.410,00',
        subtext: '19 unidades ativas',
        accentColor: 'indigo',
      },
    ],
    insights: [
      'O saldo potencial a receber supera em 2,7x o total de obrigações a pagar no período.',
      'Recuperar os 2 maiores devedores em atraso garante liquidez imediata para quitar todas as contas da semana.',
      'Há 2 equipamentos emprestados em campo vinculados a clientes com cobrança ativa.',
    ],
    recommendedAction:
      'Combine a cobrança dos atrasos de Mercado Horizonte Ltda com a regularização imediata da fatura Copel Energia.',
    columns: [
      { key: 'modulo', label: 'Módulo', type: 'text' },
      { key: 'indicador', label: 'Destaque Operacional', type: 'text' },
      { key: 'valor', label: 'Impacto Financeiro', type: 'currency', align: 'right' },
      { key: 'prazo', label: 'Referência', type: 'date' },
      { key: 'status', label: 'Prioridade', type: 'status' },
    ],
    rows: [
      {
        id: 'ger-1',
        status: 'atrasado',
        subtitle: 'Ação imediata recomendada',
        cells: {
          modulo: 'Cobranças',
          indicador: '2 títulos vencidos (Mercado Horizonte + João Pedro)',
          valor: 6470.0,
          prazo: '2026-11-16',
          status: 'atrasado',
        },
      },
      {
        id: 'ger-2',
        status: 'atrasado',
        subtitle: 'Conta essencial vencida',
        cells: {
          modulo: 'Pagamentos',
          indicador: 'Copel Energia + CloudInfra próximos do vencimento',
          valor: 3600.5,
          prazo: '2026-11-22',
          status: 'atrasado',
        },
      },
      {
        id: 'ger-3',
        status: 'pendente',
        subtitle: 'Carteira saudável a vencer',
        cells: {
          modulo: 'Devedores',
          indicador: 'Clínica Vida Plena + Auto Center Paulista',
          valor: 5540.0,
          prazo: '2026-11-28',
          status: 'pendente',
        },
      },
      {
        id: 'ger-4',
        status: 'emprestado',
        subtitle: 'Controle patrimonial',
        cells: {
          modulo: 'Ativos',
          indicador: '2 Kits Totem em comodato/empréstimo',
          valor: 6400.0,
          prazo: '2026-12-05',
          status: 'emprestado',
        },
      },
    ],
  };
}

function inferDomainFromPrompt(prompt: string, fallback: AiDomain = 'todos'): AiDomain {
  const normalized = prompt.toLowerCase();
  if (normalized.includes('devedor') || normalized.includes('inadimpl')) return 'devedores';
  if (
    normalized.includes('ativo') ||
    normalized.includes('inventário') ||
    normalized.includes('inventario') ||
    normalized.includes('estoque') ||
    normalized.includes('equipamento')
  ) {
    return 'ativos';
  }
  if (
    normalized.includes('pagar') ||
    normalized.includes('pagamento') ||
    normalized.includes('saída') ||
    normalized.includes('saida') ||
    normalized.includes('credor')
  ) {
    return 'pagamentos';
  }
  if (
    normalized.includes('cobran') ||
    normalized.includes('receber') ||
    normalized.includes('recebimento')
  ) {
    return 'cobrancas';
  }
  return fallback;
}

export function buildPromptFromFilters(filters: AiQueryFilters): string {
  const domainText: Record<AiDomain, string> = {
    todos: 'cobranças, pagamentos, devedores e ativos',
    cobrancas: 'cobranças e contas a receber',
    pagamentos: 'pagamentos e contas a pagar',
    devedores: 'clientes devedores e inadimplência',
    ativos: 'ativos e itens do inventário',
  };

  const statusText: Record<AiStatusFocus, string> = {
    todos: 'considerando todos os status',
    atrasado: 'com foco nos itens em atraso ou críticos',
    pendente: 'com foco nos itens pendentes',
    concluido: 'com foco nos itens quitados ou disponíveis',
  };

  return `Gerar relatório estruturado de ${domainText[filters.domain]} para o período "${PERIOD_LABELS[filters.period]}", ${statusText[filters.statusFocus]}.`;
}

export const aiAssistantApi = {
  /**
   * Ponto único de integração com a IA do OmniCharge.
   * Quando o endpoint real do backend estiver disponível, basta substituir o corpo abaixo por:
   * return fetchApi<AiAssistantQueryResponse>('/ia/consultar', { method: 'POST', body: JSON.stringify(payload) });
   */
  consultar: async (payload: AiAssistantQueryRequest): Promise<AiAssistantQueryResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 900));

    const effectiveDomain =
      payload.filters?.domain && payload.filters.domain !== 'todos'
        ? payload.filters.domain
        : inferDomainFromPrompt(payload.prompt, payload.filters?.domain || 'todos');

    let report: AiStructuredReport;
    let summaryText: string;
    let highlights: string[];

    switch (effectiveDomain) {
      case 'cobrancas':
        report = buildCobrancasReport(payload.filters);
        summaryText =
          'Analisei suas cobranças e contas a receber. Identifiquei R$ 12.010,00 em aberto, sendo R$ 6.470,00 já vencidos e prioritários para recuperação.';
        highlights = [
          'Maior pendência vencida: Mercado Horizonte Ltda (R$ 4.850,00)',
          'Previsão de R$ 5.540,00 a vencer nos próximos dias',
          'Relatório detalhado atualizado no painel ao lado',
        ];
        break;
      case 'pagamentos':
        report = buildPagamentosReport(payload.filters);
        summaryText =
          'Consolidei suas contas a pagar e saídas do período. Há R$ 4.390,50 em compromissos pendentes, com atenção imediata para a fatura vencida da Copel Energia.';
        highlights = [
          'Conta vencida: Copel Energia (R$ 1.420,50)',
          'Próximo vencimento relevante: CloudInfra Brasil em 27/11',
          'Painel atualizado com cronograma e status',
        ];
        break;
      case 'devedores':
        report = buildDevedoresReport(payload.filters);
        summaryText =
          'Mapeei seus principais devedores considerando valor em aberto, títulos pendentes e risco de atraso. Os 2 primeiros clientes concentram mais de 53% da inadimplência.';
        highlights = [
          '4 devedores mapeados com contato direto disponível',
          'Exposição total atual: R$ 13.180,00',
          'Ranking ordenado por prioridade no painel de relatórios',
        ];
        break;
      case 'ativos':
        report = buildAtivosReport(payload.filters);
        summaryText =
          'Verifiquei a posição atual dos seus ativos e equipamentos no inventário. Você possui R$ 27.160,00 distribuídos entre itens disponíveis, emprestados e baixados.';
        highlights = [
          '17 unidades disponíveis para venda ou alocação',
          '2 kits emprestados com retorno previsto em 05/12/2026',
          'Alerta de estoque baixo em Leitor NFC Sem Fio (3 un.)',
        ];
        break;
      default:
        report = buildGeralReport(payload.filters);
        summaryText =
          'Preparei um panorama executivo integrando cobranças, pagamentos, devedores e ativos. Sua carteira a receber cobre com folga as obrigações atuais, desde que os atrasos críticos sejam acionados.';
        highlights = [
          'Recebíveis pendentes superam pagamentos em 2,7x',
          '2 cobranças vencidas somam R$ 6.470,00',
          'Relatório consolidado pronto para filtragem no painel',
        ];
        break;
    }

    return {
      message: {
        id: `msg-ai-${Date.now()}`,
        role: 'assistant',
        content: summaryText,
        highlights,
        timestamp: nowIso(),
        reportId: report.id,
        reportTitle: report.title,
      },
      report,
    };
  },
};
