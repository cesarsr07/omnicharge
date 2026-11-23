'use client';

export default function MenthorPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <header className="border-b border-slate-700 pb-4">
        <h1 className="text-3xl font-bold text-sky-400">Painel do Mentor</h1>
        <p className="text-slate-400">Acompanhe suas turmas, alunos e feedbacks.</p>
      </header>

      <section className="bg-slate-800 p-6 rounded-xl border border-slate-700">
        <h2 className="text-xl font-semibold text-slate-200 mb-4">Minhas Turmas Ativas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-900 rounded-lg border border-slate-700">
            <h3 className="font-semibold text-sky-400">Turma Fullstack Alpha</h3>
            <p className="text-sm text-slate-400 mt-1">24 alunos • Próxima sessão: Terça, 19:00</p>
          </div>
          <div className="p-4 bg-slate-900 rounded-lg border border-slate-700">
            <h3 className="font-semibold text-sky-400">Turma Node.js Avancado</h3>
            <p className="text-sm text-slate-400 mt-1">18 alunos • Próxima sessão: Quinta, 20:00</p>
          </div>
        </div>
      </section>
    </div>
  );
}
