import React from 'react';
import { useGasRental } from '../../context/GasRentalContext';
import { LayoutDashboard, Bike, Users, ClipboardList } from 'lucide-react';
import { ActiveTab } from '../../types';

export const Navbar: React.FC = () => {
  const { activeTab, setActiveTab } = useGasRental();

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dasbor', label: 'Dasbor', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'motor', label: 'Motor', icon: <Bike className="w-4 h-4" /> },
    { id: 'penyewa', label: 'Penyewa', icon: <Users className="w-4 h-4" /> },
    { id: 'sewa', label: 'Sewa', icon: <ClipboardList className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
            <Bike className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-slate-900 tracking-tight leading-none">
              Gas Rental
            </h1>
            <span className="text-[11px] font-semibold text-emerald-600 tracking-wide uppercase">
              Rental Motor Harian
            </span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-white text-emerald-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* User Role Pill */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Staf & Pemilik</span>
        </div>
      </div>
    </header>
  );
};
