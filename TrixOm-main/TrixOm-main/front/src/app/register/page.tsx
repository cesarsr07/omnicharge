'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, Lock, UserPlus } from 'lucide-react';
import { useAuth } from '../../contexts/auth-context';
import { authApi } from '../../api/authApi';

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ nome: '', email: '', telefone: '', senha_hash: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await authApi.register(formData);
      login(user);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Erro ao realizar cadastro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 bg-slate-950 text-slate-100 overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md bg-slate-900/80 backdrop-blur-xl p-8 rounded-3xl border border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.8)] space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-emerald-400 to-amber-400 bg-clip-text text-transparent">
            OmniCharge
          </h1>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Crie sua conta gratuitamente
          </p>
        </div>

        <div>
          <h2 className="text-xl font-extrabold text-slate-100">Criar Conta</h2>
          <p className="text-xs text-slate-400 mt-1">Preencha os dados abaixo para começar</p>
        </div>

        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-400 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-blue-400" />
              <span>Nome Completo *</span>
            </label>
            <input
              type="text"
              required
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              className="w-full px-4 py-3 bg-slate-950/70 border border-slate-800 rounded-2xl text-slate-100 text-sm focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="Seu nome completo"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-blue-400" />
                <span>E-mail *</span>
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-slate-950/70 border border-slate-800 rounded-2xl text-slate-100 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="seu@email.com"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-blue-400" />
                <span>Telefone *</span>
              </label>
              <input
                type="tel"
                required
                value={formData.telefone}
                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                className="w-full px-4 py-3 bg-slate-950/70 border border-slate-800 rounded-2xl text-slate-100 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="(11) 99999-9999"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-blue-400" />
              <span>Senha *</span>
            </label>
            <input
              type="password"
              required
              value={formData.senha_hash}
              onChange={(e) => setFormData({ ...formData, senha_hash: e.target.value })}
              className="w-full px-4 py-3 bg-slate-950/70 border border-slate-800 rounded-2xl text-slate-100 text-sm focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white font-bold text-sm rounded-2xl transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>{loading ? 'Cadastrando...' : 'Criar Conta'}</span>
          </button>
        </form>

        <p className="text-center text-xs text-slate-400">
          Já possui conta?{' '}
          <Link href="/login" className="text-blue-400 hover:underline font-bold">
            Faça login
          </Link>
        </p>
      </div>
    </div>
  );
}
