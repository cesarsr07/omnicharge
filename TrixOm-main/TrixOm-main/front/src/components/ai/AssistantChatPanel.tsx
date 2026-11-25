'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  Sparkles,
  Send,
  RotateCcw,
  FileBarChart2,
  Copy,
  Check,
  MessageSquareText,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';
import { AiChatMessage, QuickPromptSuggestion } from '../../types/aiAssistant';

interface AssistantChatPanelProps {
  messages: AiChatMessage[];
  isLoading: boolean;
  userName?: string;
  inputValue: string;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  onClearConversation: () => void;
  onSelectQuickPrompt: (suggestion: QuickPromptSuggestion) => void;
  onViewReport: (reportId: string) => void;
  activeReportId?: string | null;
  quickPrompts: QuickPromptSuggestion[];
}

export const AssistantChatPanel: React.FC<AssistantChatPanelProps> = ({
  messages,
  isLoading,
  userName,
  inputValue,
  onInputChange,
  onSendMessage,
  onClearConversation,
  onSelectQuickPrompt,
  onViewReport,
  activeReportId,
  quickPrompts,
}) => {
  const scrollEndRef = useRef<HTMLDivElement | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    scrollEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading && inputValue.trim()) {
        onSendMessage();
      }
    }
  };

  const handleCopy = async (message: AiChatMessage) => {
    try {
      const fullText = message.highlights?.length
        ? `${message.content}\n\n• ${message.highlights.join('\n• ')}`
        : message.content;
      await navigator.clipboard.writeText(fullText);
      setCopiedId(message.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Clipboard indisponível em contextos sem permissão
    }
  };

  const formatTime = (iso: string) => {
    return new Date(iso).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const userInitial = userName ? userName.charAt(0).toUpperCase() : 'U';

  return (
    <section
      aria-label="Chat do Assistente OmniCharge IA"
      className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-3xl shadow-2xl flex flex-col h-[580px] lg:h-[640px] overflow-hidden"
    >
      {/* Cabeçalho do Chat */}
      <div className="px-5 py-4 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-emerald-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-extrabold text-slate-100 truncate">
                Assistente OmniCharge
              </h2>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {isLoading ? 'Analisando' : 'Online'}
              </span>
            </div>
            <p className="text-xs text-slate-400 truncate">
              Consultas inteligentes sobre cobranças, pagamentos, devedores e ativos
            </p>
          </div>
        </div>

        {messages.length > 0 && (
          <button
            type="button"
            onClick={onClearConversation}
            disabled={isLoading}
            title="Iniciar nova conversa"
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/70 transition-colors flex items-center gap-1.5 shrink-0 disabled:opacity-50"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Nova conversa</span>
          </button>
        )}
      </div>

      {/* Área de Mensagens / Empty State */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
        {messages.length === 0 && !isLoading ? (
          <div className="h-full flex flex-col justify-center items-center text-center max-w-lg mx-auto py-4 space-y-5">
            <div className="w-14 h-14 rounded-3xl bg-gradient-to-tr from-blue-600/20 via-indigo-600/20 to-emerald-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <MessageSquareText className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-base sm:text-lg font-extrabold text-slate-100">
                Como posso apoiar sua gestão hoje?
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Pergunte em linguagem natural ou use os filtros visuais acima. A cada consulta,
                eu respondo no chat e monto um relatório estruturado no painel ao lado.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full text-left">
              {quickPrompts.slice(0, 4).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectQuickPrompt(item)}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/90 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all group text-left"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-extrabold text-slate-900 dark:text-slate-100 group-hover:text-blue-500 transition-colors">
                      {item.label}
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500 transition-colors shrink-0" />
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                    {item.prompt}
                  </p>
                </button>
              ))}
            </div>

            <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Ambiente inicial com dados simulados pronto para integração com a API</span>
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg) => {
              const isUser = msg.role === 'user';

              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                      isUser
                        ? 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20'
                        : 'bg-gradient-to-tr from-blue-600/20 to-emerald-500/20 border border-blue-500/30 text-blue-400'
                    }`}
                  >
                    {isUser ? userInitial : <Sparkles className="w-4 h-4" />}
                  </div>

                  {/* Balão da mensagem */}
                  <div
                    className={`max-w-[85%] space-y-2 ${
                      isUser ? 'items-end text-right' : 'items-start text-left'
                    }`}
                  >
                    <div
                      className={`rounded-3xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                        isUser
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-md shadow-lg shadow-blue-500/20 text-left'
                          : 'bg-slate-50 dark:bg-slate-950/75 border border-slate-200 dark:border-slate-800/90 text-slate-800 dark:text-slate-200 rounded-tl-md'
                      }`}
                    >
                      <p className="whitespace-pre-line">{msg.content}</p>

                      {!isUser && msg.highlights && msg.highlights.length > 0 && (
                        <ul className="mt-2.5 pt-2.5 border-t border-slate-200 dark:border-slate-800/80 space-y-1.5">
                          {msg.highlights.map((item, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {/* Metadados e ações da mensagem */}
                    <div
                      className={`flex flex-wrap items-center gap-2 px-1 ${
                        isUser ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <span className="text-[11px] text-slate-400">
                        {isUser ? 'Você' : 'OmniCharge IA'} · {formatTime(msg.timestamp)}
                      </span>

                      {!isUser && (
                        <button
                          type="button"
                          onClick={() => handleCopy(msg)}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-400 hover:text-blue-400 transition-colors"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">Copiado</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copiar</span>
                            </>
                          )}
                        </button>
                      )}

                      {!isUser && msg.reportId && (
                        <button
                          type="button"
                          onClick={() => onViewReport(msg.reportId!)}
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border transition-all ${
                            activeReportId === msg.reportId
                              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                              : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30 hover:bg-blue-500 hover:text-white'
                          }`}
                        >
                          <FileBarChart2 className="w-3 h-3" />
                          <span>
                            {activeReportId === msg.reportId
                              ? 'Relatório em exibição'
                              : 'Abrir relatório'}
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Estado de carregando / digitando */}
            {isLoading && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600/20 to-emerald-500/20 border border-blue-500/30 text-blue-400 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 animate-pulse" />
                </div>
                <div className="rounded-3xl rounded-tl-md px-4 py-3 bg-slate-50 dark:bg-slate-950/75 border border-slate-200 dark:border-slate-800/90 flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" />
                  </div>
                  <span className="text-xs font-semibold text-slate-400">
                    Analisando dados e estruturando relatório...
                  </span>
                </div>
              </div>
            )}

            <div ref={scrollEndRef} />
          </>
        )}
      </div>

      {/* Campo de Entrada */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!isLoading && inputValue.trim()) {
            onSendMessage();
          }
        }}
        className="p-3 sm:p-4 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-950/40"
      >
        <div className="flex items-end gap-2.5">
          <textarea
            rows={2}
            value={inputValue}
            disabled={isLoading}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Digite sua pergunta (Enter para enviar, Shift+Enter para quebrar linha)..."
            className="flex-1 resize-none px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-2xl text-slate-100 placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="px-4 sm:px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-lg shadow-blue-500/25 transition-all flex items-center gap-2 shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Enviar</span>
          </button>
        </div>
      </form>
    </section>
  );
};
