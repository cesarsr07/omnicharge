'use client';

export default function AdminPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <header className="border-b border-slate-700 pb-4">
        <h1 className="text-3xl font-bold text-sky-400">Painel Administrativo</h1>
        <p className="text-slate-400">Gerenciamento geral da plataforma omin.</p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-slate-800 rounded-xl border border-slate-700">
          <h3 className="font-semibold text-xl text-slate-200">Usuários Ativos</h3>
          <p className="text-3xl font-bold text-sky-500 mt-2">1,248</p>
        </div>
        <div className="p-6 bg-slate-800 rounded-xl border border-slate-700">
          <h3 className="font-semibold text-xl text-slate-200">Turmas Criadas</h3>
          <p className="text-3xl font-bold text-sky-500 mt-2">42</p>
        </div>
        <div className="p-6 bg-slate-800 rounded-xl border border-slate-700">
          <h3 className="font-semibold text-xl text-slate-200">Mentores Cadastrados</h3>
          <p className="text-3xl font-bold text-sky-500 mt-2">18</p>
        </div>
      </div>
    </div>
  );
}
