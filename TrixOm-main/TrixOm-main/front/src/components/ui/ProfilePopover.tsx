'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import {
  User,
  X,
  GripVertical,
  Moon,
  Sun,
  Save,
  LogOut,
  Edit3,
} from 'lucide-react';
import { useAuth } from '../../contexts/auth-context';
import { authApi } from '../../api/authApi';

interface ProfilePopoverProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfilePopover: React.FC<ProfilePopoverProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const { user, updateUser, theme, toggleTheme, logout } = useAuth();
  const [mounted, setMounted] = useState(false);

  const [nome, setNome] = useState(user?.nome || '');
  const [telefone, setTelefone] = useState(user?.telefone || '');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Estados de arrasto (Draggable)
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [relPosition, setRelPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (user) {
      setNome(user.nome || '');
      setTelefone(user.telefone || '');
    }
  }, [user]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      setPosition({
        x: e.clientX - relPosition.x,
        y: e.clientY - relPosition.y,
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, relPosition]);

  if (!isOpen || !user || !mounted) return null;

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setRelPosition({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    setLoading(true);

    try {
      if (user._id) {
        await authApi.updateProfile(user._id, { nome, telefone });
      }
      updateUser({ nome, telefone });
      setMsg({ text: 'Perfil atualizado com sucesso!', type: 'success' });
      setTimeout(() => setMsg(null), 3000);
    } catch (err: any) {
      setMsg({ text: err.message || 'Erro ao atualizar perfil', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const popoverContent = (
    <div
      style={{
        left: `${24 + position.x}px`,
        top: `${80 + position.y}px`,
      }}
      className="fixed z-[100] w-80 bg-white/90 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-700/80 rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.15)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.8)] p-5 text-slate-900 dark:text-slate-100 backdrop-blur-xl transition-shadow"
    >
      {/* Header Arrastável (Drag Handle) com Fechar */}
      <div
        onMouseDown={handleMouseDown}
        className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 mb-4 cursor-grab active:cursor-grabbing select-none"
        title="Clique e arraste para mover a janela"
      >
        <div className="flex items-center gap-2">
          <GripVertical className="w-4 h-4 text-slate-400" />
          <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">Meu Perfil</h3>
        </div>
        <button
          onClick={onClose}
          type="button"
          title="Fechar"
          className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 text-xs font-bold w-7 h-7 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/60 dark:hover:bg-slate-800 flex items-center justify-center transition-colors border border-slate-200 dark:border-slate-700/50"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {msg && (
        <div
          className={`p-2.5 rounded-xl text-xs mb-3 font-semibold ${
            msg.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
              : 'bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400'
          }`}
        >
          {msg.text}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-3">
        {/* Campo E-mail (Apenas Leitura) */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
            E-mail <span className="text-slate-400 dark:text-slate-500">(Somente leitura)</span>
          </label>
          <input
            type="email"
            disabled
            value={user.email}
            className="w-full px-3.5 py-2 bg-slate-100/90 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-600 dark:text-slate-400 text-xs cursor-not-allowed"
          />
        </div>

        {/* Campo Tipo de Conta (Apenas Leitura) */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
            Tipo de Conta <span className="text-slate-400 dark:text-slate-500">(Somente leitura)</span>
          </label>
          <input
            type="text"
            disabled
            value={user.tipo || 'Cliente'}
            className="w-full px-3.5 py-2 bg-slate-100/90 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-600 dark:text-slate-400 text-xs cursor-not-allowed capitalize"
          />
        </div>

        {/* Campo Nome (Editável) */}
        <div>
          <label className="block text-[11px] font-semibold text-blue-600 dark:text-blue-400 mb-1 flex items-center gap-1">
            <span>Nome Completo</span>
            <Edit3 className="w-3 h-3" />
          </label>
          <input
            type="text"
            required
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full px-3.5 py-2 bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Campo Telefone (Editável) */}
        <div>
          <label className="block text-[11px] font-semibold text-blue-600 dark:text-blue-400 mb-1 flex items-center gap-1">
            <span>Telefone / WhatsApp</span>
            <Edit3 className="w-3 h-3" />
          </label>
          <input
            type="tel"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            className="w-full px-3.5 py-2 bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:border-blue-500"
            placeholder="(11) 99999-9999"
          />
        </div>

        {/* Alternador de Tema (Modo Claro / Escuro) */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-1.5">
            {theme === 'dark' ? <Moon className="w-4 h-4 text-indigo-500" /> : <Sun className="w-4 h-4 text-amber-500" />}
            <span>Aparência</span>
          </span>
          <button
            type="button"
            onClick={toggleTheme}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-all shadow-sm flex items-center gap-1.5"
          >
            {theme === 'dark' ? 'Modo Escuro' : 'Modo Claro'}
          </button>
        </div>

        {/* Botão Salvar Alterações */}
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>{loading ? 'Salvando...' : 'Salvar Perfil'}</span>
        </button>
      </form>

      {/* Botão de Sair Integrado */}
      <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 font-bold text-xs rounded-xl border border-rose-500/30 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sair da Conta</span>
        </button>
      </div>
    </div>
  );

  return createPortal(popoverContent, document.body);
};
