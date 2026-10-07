import { Penyewa } from '../../types';
import { User, Phone, MapPin, ShieldCheck, Edit2, Trash2 } from 'lucide-react';

interface PenyewaCardProps {
  penyewa: Penyewa;
  onEdit: (penyewa: Penyewa) => void;
  onDelete: (penyewa: Penyewa) => void;
}

export const PenyewaCard = ({ penyewa, onEdit, onDelete }: PenyewaCardProps) => {
  const getBadgeColor = (jaminan: string) => {
    switch (jaminan) {
      case 'KTP':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'SIM':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Paspor':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* Header: Name + Jaminan Badge */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base leading-tight">
                {penyewa.nama}
              </h3>
              <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{penyewa.asal_kota}</span>
              </div>
            </div>
          </div>

          <span
            className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border ${getBadgeColor(
              penyewa.jenis_jaminan
            )}`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            {penyewa.jenis_jaminan}
          </span>
        </div>

        {/* WhatsApp Phone Info */}
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 my-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-700">
            <Phone className="w-4 h-4 text-emerald-600" />
            <span className="font-mono font-bold text-sm tracking-wide">
              {penyewa.no_whatsapp}
            </span>
          </div>
          <a
            href={`https://wa.me/62${penyewa.no_whatsapp.replace(/^0/, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2 py-1 rounded-lg transition-colors"
          >
            Chat WA
          </a>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
        <button
          onClick={() => onEdit(penyewa)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors active:scale-95"
        >
          <Edit2 className="w-3.5 h-3.5 text-slate-500" />
          Ubah
        </button>

        <button
          onClick={() => onDelete(penyewa)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors active:scale-95"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Hapus
        </button>
      </div>
    </div>
  );
};
