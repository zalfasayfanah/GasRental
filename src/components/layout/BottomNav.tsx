import React from 'react';
import { useGasRental } from '../../context/GasRentalContext';
import { LayoutDashboard, Bike, Users, ClipboardList } from 'lucide-react';
import { ActiveTab } from '../../types';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab } = useGasRental();

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dasbor', label: 'Dasbor', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'motor', label: 'Motor', icon: <Bike className="w-5 h-5" /> },
    { id: 'penyewa', label: 'Penyewa', icon: <Users className="w-5 h-5" /> },
    { id: 'sewa', label: 'Sewa', icon: <ClipboardList className="w-5 h-5" /> },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-150 ${
                isActive
                  ? 'text-emerald-600 font-bold scale-105'
                  : 'text-slate-400 hover:text-slate-600 font-medium'
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition-colors ${
                  isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-transparent'
                }`}
              >
                {item.icon}
              </div>
              <span className="text-[10px] mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
