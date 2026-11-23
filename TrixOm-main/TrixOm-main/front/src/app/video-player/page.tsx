'use client';

export default function VideoPlayerPage() {
  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-sky-400">Player de Vídeo de Aprendizado</h1>
      
      <div className="aspect-video w-full bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center relative overflow-hidden">
        <p className="text-slate-400">[ Video Container Placeholder ]</p>
      </div>

      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 space-y-4">
        <h2 className="text-xl font-semibold text-slate-100">Comentários e Dúvidas</h2>
        <div className="space-y-3">
          <div className="p-4 bg-slate-900 rounded-lg border border-slate-700">
            <p className="font-semibold text-sky-400 text-sm">João Silva • 02:45</p>
            <p className="text-slate-300 mt-1">Como foi feita a conexão do Mongoose com o Atlas?</p>
          </div>
        </div>
      </div>
    </div>
  );
}
