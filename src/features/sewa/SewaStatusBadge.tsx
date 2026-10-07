import { RentStatus } from '../../types';
import { Clock, Play, CheckCircle2, XCircle } from 'lucide-react';

interface SewaStatusBadgeProps {
  status: RentStatus;
}

export const SewaStatusBadge = ({ status }: SewaStatusBadgeProps) => {
  switch (status) {
    case 'dipesan':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100/90 text-amber-800 border border-amber-200">
          <Clock className="w-3.5 h-3.5" />
          Dipesan
        </span>
      );
    case 'berjalan':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100/90 text-blue-800 border border-blue-200">
          <Play className="w-3.5 h-3.5 fill-blue-800" />
          Berjalan
        </span>
      );
    case 'selesai':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100/90 text-emerald-800 border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Selesai
        </span>
      );
    case 'dibatalkan':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
          <XCircle className="w-3.5 h-3.5" />
          Dibatalkan
        </span>
      );
    default:
      return null;
  }
};
