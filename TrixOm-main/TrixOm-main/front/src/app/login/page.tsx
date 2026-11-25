'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Zap, Mail, Lock, LogIn } from 'lucide-react';
import { useAuth } from '../../contexts/auth-context';
import { authApi } from '../../api/authApi';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('useremail@example.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await authApi.login(email, password);
      login(user);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Erro ao realizar login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 bg-slate-950 text-slate-100 overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md bg-slate-900/80 backdrop-blur-xl p-8 rounded-3xl border border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.8)] space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-blue-600 via-emerald-500 to-amber-500 shadow-lg shadow-blue-500/20 mb-2">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-emerald-400 to-amber-400 bg-clip-text text-transparent">
            OmniCharge
          </h1>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Crédito Inteligente & Gestão Financeira
          </p>
        </div>

        <div>
          <h2 className="text-xl font-extrabold text-slate-100">Bem-vindo de volta 👋</h2>
          <p className="text-xs text-slate-400 mt-1">Faça login para acessar sua plataforma</p>
        </div>

        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-400 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-blue-400" />
              <span>E-mail teste</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950/70 border border-slate-800 rounded-2xl text-slate-100 text-sm focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="seu@email.com"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-blue-400" />
              <span>Senha</span>
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950/70 border border-slate-800 rounded-2xl text-slate-100 text-sm focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white font-bold text-sm rounded-2xl transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>{loading ? 'Entrando...' : 'Entrar na Plataforma'}</span>
          </button>
        </form>

        <p className="text-center text-xs text-slate-400">
          Não tem uma conta?{' '}
          <Link href="/register" className="text-emerald-400 hover:underline font-bold">
            Cadastre-se grátis
          </Link>
        </p>
      </div>
    </div>
  );
}
