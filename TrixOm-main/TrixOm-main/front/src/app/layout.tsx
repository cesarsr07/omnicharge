import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/contexts/auth-context';
import { ClassProvider } from '@/contexts/ClassContext';
import { LoadingProvider } from '@/contexts/LoadingContext';

export const metadata: Metadata = {
  title: 'Plataforma omin',
  description: 'Plataforma omin de Aprendizado e Mentoria',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased min-h-screen bg-slate-900 text-slate-100">
        <LoadingProvider>
          <AuthProvider>
            <ClassProvider>
              {children}
            </ClassProvider>
          </AuthProvider>
        </LoadingProvider>
      </body>
    </html>
  );
}
