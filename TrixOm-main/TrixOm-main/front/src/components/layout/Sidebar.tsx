'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Wallet,
  Receipt,
  Package,
  Users,
  ChevronLeft,
  ChevronRight,
  Settings,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../contexts/auth-context';
import { ProfilePopover } from '../ui/ProfilePopover';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { label: 'Cobranças', icon: Wallet, href: '/cobrancas' },
    { label: 'Extrato', icon: Receipt, href: '/extrato' },
    { label: 'Inventário', icon: Package, href: '/inventario' },
    { label: 'Contatos', icon: Users, href: '/contatos' },
    { label: 'Assistente IA', icon: Sparkles, href: '/assistente' },
  ];

  const getInicial = (nome?: string) => {
    return nome ? nome.charAt(0).toUpperCase() : 'U';
  };

  return (
    <aside
      className={`relative hidden md:flex flex-col justify-between p-4 bg-white text-slate-900 min-h-screen border-r border-slate-200/90 shadow-xl shrink-0 transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Popover de Perfil ao Clicar no Card (Renderizado via Portal z-[100]) */}
      <ProfilePopover isOpen={showProfile} onClose={() => setShowProfile(false)} />

      <div>
        {/* Brand & Toggle Header */}
        <div className="mb-8 px-2 py-2 flex items-center justify-between">
          {!isCollapsed && (
            <div>
              <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 bg-clip-text text-transparent">
                OmniCharge
              </h1>
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500 mt-0.5">
                Fintech & Gestão
              </p>
            </div>
          )}
          {isCollapsed && (
            <div className="mx-auto font-black text-xl bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent tracking-wider">
              OC
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? 'Expandir Menu' : 'Recolher Menu'}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors border border-slate-200 shadow-sm"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* User Card Interativo (Com Fundo de Alto Contraste) */}
        {user && (
          <div
            onClick={() => setShowProfile(!showProfile)}
            role="button"
            tabIndex={0}
            title="Clique para ver/editar perfil, tema e sair da conta"
            className={`mb-6 p-3 bg-slate-100/90 hover:bg-slate-100 rounded-2xl flex items-center border border-slate-200/90 cursor-pointer transition-all ${
              showProfile ? 'ring-2 ring-blue-500/50 border-blue-500 bg-slate-100' : ''
            } ${isCollapsed ? 'justify-center' : 'gap-3'}`}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-emerald-500 flex items-center justify-center font-bold text-white shadow-md shadow-blue-500/20 shrink-0">
              {getInicial(user.nome)}
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden flex-1">
                <div className="text-sm font-bold text-slate-900 truncate flex items-center justify-between">
                  <span>{user.nome}</span>
                  <Settings className="w-3.5 h-3.5 text-blue-600" />
                </div>
                <div className="text-xs text-slate-500 capitalize">{user.tipo || 'Administrador'}</div>
              </div>
            )}
          </div>
        )}

        {/* Navigation Links */}
        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const IconComponent = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                title={isCollapsed ? item.label : undefined}
                className={`flex items-center rounded-2xl font-semibold text-sm transition-all ${
                  isCollapsed ? 'justify-center p-3.5' : 'gap-3 px-4 py-3'
                } ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 border border-blue-500/30'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
                }`}
              >
                <IconComponent className="w-5 h-5 shrink-0" />
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};
