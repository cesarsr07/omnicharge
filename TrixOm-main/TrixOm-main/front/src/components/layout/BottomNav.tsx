'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Wallet,
  Receipt,
  Package,
  Users,
  User,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../contexts/auth-context';
import { ProfilePopover } from '../ui/ProfilePopover';

export const BottomNav: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [showProfile, setShowProfile] = useState(false);

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { label: 'Cobranças', icon: Wallet, href: '/cobrancas' },
    { label: 'Extrato', icon: Receipt, href: '/extrato' },
    { label: 'Inventário', icon: Package, href: '/inventario' },
    { label: 'Contatos', icon: Users, href: '/contatos' },
    { label: 'IA', icon: Sparkles, href: '/assistente' },
  ];

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const getInicial = (nome?: string) => {
    return nome ? nome.charAt(0).toUpperCase() : 'U';
  };

  return (
    <>
      <ProfilePopover isOpen={showProfile} onClose={() => setShowProfile(false)} />

      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/80 px-2 py-2 flex items-center justify-around shadow-2xl">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const IconComponent = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'text-blue-400 font-bold scale-105'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <IconComponent className="w-5 h-5" />
              <span className="text-[10px]">{item.label}</span>
            </Link>
          );
        })}

        <button
          onClick={() => setShowProfile(!showProfile)}
          title="Ver/Editar perfil"
          className="flex flex-col items-center gap-1 p-2 rounded-xl text-slate-400 hover:text-blue-400 transition-colors"
        >
          <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-blue-600 to-emerald-500 text-white text-[10px] font-bold flex items-center justify-center shadow-md">
            {getInicial(user?.nome)}
          </div>
          <span className="text-[10px]">Perfil</span>
        </button>

        <button
          onClick={handleLogout}
          title="Sair do sistema"
          className="flex flex-col items-center gap-1 p-2 rounded-xl text-slate-400 hover:text-rose-400 transition-colors"
        >
          <LogOut className="w-5 h-5 text-rose-400" />
          <span className="text-[10px] text-rose-400">Sair</span>
        </button>
      </nav>
    </>
  );
};
