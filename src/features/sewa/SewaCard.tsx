import { Sewa } from '../../types';
import { formatRupiah, formatDateIndo } from '../../lib/utils';
import { SewaStatusBadge } from './SewaStatusBadge';
import { Bike, User, Calendar, Clock, CheckCircle2, Play, Ban, Trash2 } from 'lucide-react';

interface SewaCardProps {
  sewa: Sewa;
  onUpdateStatus: (sewa: Sewa, nextStatus: 'berjalan' | 'selesai' | 'dibatalkan') => void;
  onDelete: (sewa: Sewa) => void;
}

export const SewaCard = ({ sewa, onUpdateStatus, onDelete }: SewaCardProps) => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* Header: Motor name + Plat + Status Badge */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Bike className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base leading-tight">
                {sewa.nama_motor}
              </h3>
              <div className="inline-block mt-1 font-mono font-bold text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200">
                {sewa.plat_nomor}
              </div>
            </div>
          </div>

          <SewaStatusBadge status={sewa.status} />
        </div>

        {/* Customer & Booking Details */}
        <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100 space-y-2.5 my-3 text-xs">
          {/* Penyewa Info */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
            <div className="flex items-center gap-2 text-slate-700 font-semibold">
              <User className="w-4 h-4 text-indigo-500" />
              <span>{sewa.nama_penyewa}</span>
            </div>
            <span className="font-mono text-slate-500 text-[11px]">{sewa.penyewa_id}</span>
          </div>

          {/* Date & Duration Info */}
          <div className="grid grid-cols-2 gap-2 text-slate-600">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Mulai: <strong className="text-slate-800">{formatDateIndo(sewa.tanggal_mulai)}</strong></span>
            </div>
            <div className="flex items-center gap-1.5 justify-end">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Durasi: <strong className="text-slate-800">{sewa.lama_hari} hari</strong></span>
            </div>
          </div>

          {/* Pricing snapshot */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
            <span className="text-slate-500">
              {formatRupiah(sewa.harga_per_hari)} × {sewa.lama_hari} hari
            </span>
            <span className="text-sm font-extrabold text-emerald-700">
              {formatRupiah(sewa.total)}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons based on status */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <div className="text-[11px] text-slate-400 font-mono">
          ID: {sewa.id}
        </div>

        <div className="flex items-center gap-1.5">
          {sewa.status === 'dipesan' && (
            <>
              <button
                onClick={() => onUpdateStatus(sewa, 'dibatalkan')}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
              >
                <Ban className="w-3.5 h-3.5" />
                Batal
              </button>
              <button
                onClick={() => onUpdateStatus(sewa, 'berjalan')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-all active:scale-95"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                Serahkan Motor
              </button>
            </>
          )}

          {sewa.status === 'berjalan' && (
            <button
              onClick={() => onUpdateStatus(sewa, 'selesai')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition-all active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              Kembalikan Motor
            </button>
          )}

          {(sewa.status === 'selesai' || sewa.status === 'dibatalkan') && (
            <button
              onClick={() => onDelete(sewa)}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Hapus Riwayat
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
