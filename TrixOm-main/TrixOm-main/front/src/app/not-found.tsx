import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-6 bg-slate-900 text-slate-100">
      <h2 className="text-4xl font-bold text-sky-400">404 - Página Não Encontrada</h2>
      <p className="mt-2 text-slate-400">A página que você está procurando não existe ou foi movida.</p>
      <Link
        href="/"
        className="mt-6 px-6 py-3 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold transition-colors"
      >
        Voltar para o Início
      </Link>
    </div>
  );
}
