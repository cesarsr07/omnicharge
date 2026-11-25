export type AiDomain = 'todos' | 'cobrancas' | 'pagamentos' | 'devedores' | 'ativos';

export type AiPeriodFilter = '7d' | 'mes_atual' | '30d' | '90d';

export type AiStatusFocus = 'todos' | 'atrasado' | 'pendente' | 'concluido';

export interface AiQueryFilters {
  domain: AiDomain;
  period: AiPeriodFilter;
  statusFocus: AiStatusFocus;
}

export interface QuickPromptSuggestion {
  id: string;
  label: string;
  prompt: string;
  domain: Exclude<AiDomain, 'todos'>;
  defaultFilters?: Partial<AiQueryFilters>;
}

export type ReportAccentColor = 'blue' | 'emerald' | 'amber' | 'rose' | 'indigo';

export interface AiReportMetric {
  id: string;
  title: string;
  value: string;
  subtext?: string;
  accentColor: ReportAccentColor;
}

export interface AiReportColumn {
  key: string;
  label: string;
  align?: 'left' | 'right';
  type?: 'text' | 'currency' | 'date' | 'status';
}

export interface AiReportRow {
  id: string;
  status?: string;
  cells: Record<string, string | number>;
  subtitle?: string;
}

export interface AiStructuredReport {
  id: string;
  title: string;
  subtitle: string;
  domain: Exclude<AiDomain, 'todos'> | 'geral';
  periodLabel: string;
  generatedAt: string;
  metrics: AiReportMetric[];
  insights: string[];
  recommendedAction: string;
  columns: AiReportColumn[];
  rows: AiReportRow[];
}

export interface AiChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  highlights?: string[];
  timestamp: string;
  reportId?: string;
  reportTitle?: string;
}

export interface AiAssistantQueryRequest {
  usuario_id: string;
  prompt: string;
  filters?: AiQueryFilters;
  history?: Pick<AiChatMessage, 'role' | 'content'>[];
}

export interface AiAssistantQueryResponse {
  message: AiChatMessage;
  report?: AiStructuredReport;
}
