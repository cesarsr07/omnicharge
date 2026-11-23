'use client';

import React, { useState } from 'react';

export default function ForgotPassPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-900">
      <div className="w-full max-w-md bg-slate-800 p-8 rounded-xl border border-slate-700 space-y-6">
        <h1 className="text-2xl font-bold text-sky-400 text-center">Recuperação de Senha</h1>
        {submitted ? (
          <div className="p-4 bg-sky-950/60 border border-sky-600/50 rounded-lg text-sky-200 text-center">
            Instruções de recuperação foram enviadas para <strong>{email}</strong>.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300">
                E-mail cadastrado
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="mt-1 w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-sky-500"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-lg transition-colors"
            >
              Enviar Link de Recuperação
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
