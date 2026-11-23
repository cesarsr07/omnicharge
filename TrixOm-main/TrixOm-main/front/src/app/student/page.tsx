'use client';

export default function StudentPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <header className="border-b border-slate-700 pb-4">
        <h1 className="text-3xl font-bold text-sky-400">Área do Estudante</h1>
        <p className="text-slate-400">Acesse seus cursos, trilhas de aprendizado e tarefas.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-slate-800 rounded-xl border border-slate-700">
          <h3 className="font-semibold text-xl text-slate-200">Progresso Geral</h3>
          <div className="w-full bg-slate-900 rounded-full h-4 mt-4 overflow-hidden">
            <div className="bg-sky-500 h-4 rounded-full w-3/4"></div>
          </div>
          <p className="text-sm text-slate-400 mt-2">75% concluído</p>
        </div>
        <div className="p-6 bg-slate-800 rounded-xl border border-slate-700">
          <h3 className="font-semibold text-xl text-slate-200">Próxima Aula</h3>
          <p className="text-slate-300 mt-2">Arquitetura Clean Code com Node.js</p>
        </div>
        <div className="p-6 bg-slate-800 rounded-xl border border-slate-700">
          <h3 className="font-semibold text-xl text-slate-200">Metas Concluídas</h3>
          <p className="text-3xl font-bold text-sky-500 mt-2">12 / 15</p>
        </div>
      </div>
    </div>
  );
}
