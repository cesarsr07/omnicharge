'use client';

import React, { useState } from 'react';
import { Sparkles, MessageSquare, FileBarChart2, AlertCircle } from 'lucide-react';
import { MainLayout } from '../../components/layout/MainLayout';
import { Header } from '../../components/layout/Header';
import { VisualPromptBuilder } from '../../components/ai/VisualPromptBuilder';
import { AssistantChatPanel } from '../../components/ai/AssistantChatPanel';
import { AiReportPanel } from '../../components/ai/AiReportPanel';
import { useAuth } from '../../contexts/auth-context';
import {
  aiAssistantApi,
  buildPromptFromFilters,
  MOCK_QUICK_PROMPTS,
} from '../../api/aiAssistantApi';
import {
  AiChatMessage,
  AiQueryFilters,
  AiStructuredReport,
  QuickPromptSuggestion,
} from '../../types/aiAssistant';

const INITIAL_FILTERS: AiQueryFilters = {
  domain: 'todos',
  period: 'mes_atual',
  statusFocus: 'todos',
};

export default function AssistentePage() {
  const { user } = useAuth();

  const [filters, setFilters] = useState<AiQueryFilters>(INITIAL_FILTERS);
  const [messages, setMessages] = useState<AiChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [reports, setReports] = useState<AiStructuredReport[]>([]);
  const [activeReportId, setActiveReportId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState<'chat' | 'report'>('chat');

  const executeQuery = async (
    promptText: string,
    queryFilters: AiQueryFilters = filters,
    focusReportOnMobile = false
  ) => {
    const trimmed = promptText.trim();
    if (!trimmed || isLoading) return;

    setErrorMsg(null);
    const userMessage: AiChatMessage = {
      id: `msg-user-${Date.now()}`,
      role: 'user',
      content: trimmed,
      timestamp: new Date().toISOString(),
    };

    const nextHistory = [...messages, userMessage].map((m) => ({
      role: m.role,
      content: m.content,
    }));

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await aiAssistantApi.consultar({
        usuario_id: user?._id || 'demo-user',
        prompt: trimmed,
        filters: queryFilters,
        history: nextHistory,
      });

      setMessages((prev) => [...prev, response.message]);

      if (response.report) {
        const generatedReport = response.report;
        setReports((prev) => [generatedReport, ...prev]);
        setActiveReportId(generatedReport.id);
        if (focusReportOnMobile) {
          setMobileTab('report');
        }
      }
    } catch (err: any) {
      setErrorMsg(
        err?.message || 'Não foi possível processar a consulta da IA. Tente novamente.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendInput = () => {
    executeQuery(inputValue, filters);
  };

  const handleTriggerFilteredQuery = () => {
    const generatedPrompt = buildPromptFromFilters(filters);
    executeQuery(generatedPrompt, filters);
  };

  const handleSelectQuickPrompt = (suggestion: QuickPromptSuggestion) => {
    const nextFilters: AiQueryFilters = {
      domain: suggestion.defaultFilters?.domain || suggestion.domain,
      period: suggestion.defaultFilters?.period || filters.period,
      statusFocus: suggestion.defaultFilters?.statusFocus || filters.statusFocus,
    };
    setFilters(nextFilters);
    executeQuery(suggestion.prompt, nextFilters);
  };

  const handleGenerateSampleReport = () => {
    executeQuery(
      'Gere um panorama executivo consolidado de cobranças, pagamentos, devedores e ativos.',
      INITIAL_FILTERS,
      true
    );
  };

  const handleViewReport = (reportId: string) => {
    setActiveReportId(reportId);
    setMobileTab('report');
  };

  const handleClearConversation = () => {
    setMessages([]);
    setErrorMsg(null);
  };

  return (
    <MainLayout>
      <Header
        title="Assistente Financeiro IA"
        subtitle="Converse com a inteligência OmniCharge, dispare prompts visuais e explore relatórios estruturados"
        actionButton={
          <button
            type="button"
            disabled={isLoading}
            onClick={handleGenerateSampleReport}
            className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 font-bold text-white text-sm rounded-2xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>Panorama Executivo</span>
          </button>
        }
      />

      {errorMsg && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs sm:text-sm font-semibold flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Construtor de Prompts Visuais */}
      <div className="mb-6">
        <VisualPromptBuilder
          filters={filters}
          onChangeFilters={setFilters}
          quickPrompts={MOCK_QUICK_PROMPTS}
          onSelectQuickPrompt={handleSelectQuickPrompt}
          onTriggerFilteredQuery={handleTriggerFilteredQuery}
          isLoading={isLoading}
        />
      </div>

      {/* Alternador responsivo para telas menores que xl */}
      <div className="xl:hidden grid grid-cols-2 gap-2 mb-4 p-1.5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
        <button
          type="button"
          onClick={() => setMobileTab('chat')}
          className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
            mobileTab === 'chat'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Conversa ({messages.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('report')}
          className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
            mobileTab === 'report'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileBarChart2 className="w-4 h-4" />
          <span>Relatórios ({reports.length})</span>
        </button>
      </div>

      {/* Workspace principal: Chat + Painel de Relatórios */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        <div className={`xl:col-span-5 ${mobileTab === 'chat' ? 'block' : 'hidden xl:block'}`}>
          <AssistantChatPanel
            messages={messages}
            isLoading={isLoading}
            userName={user?.nome}
            inputValue={inputValue}
            onInputChange={setInputValue}
            onSendMessage={handleSendInput}
            onClearConversation={handleClearConversation}
            onSelectQuickPrompt={handleSelectQuickPrompt}
            onViewReport={handleViewReport}
            activeReportId={activeReportId}
            quickPrompts={MOCK_QUICK_PROMPTS}
          />
        </div>

        <div className={`xl:col-span-7 ${mobileTab === 'report' ? 'block' : 'hidden xl:block'}`}>
          <AiReportPanel
            reports={reports}
            activeReportId={activeReportId}
            onSelectReport={setActiveReportId}
            isLoading={isLoading}
            onGenerateSampleReport={handleGenerateSampleReport}
          />
        </div>
      </div>
    </MainLayout>
  );
}
