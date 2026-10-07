import { useGasRental } from '../../context/GasRentalContext';
import { formatDateIndo } from '../../lib/utils';
import { Play, Bike, User, Phone, CheckCircle2 } from 'lucide-react';

export const OngoingRentalsSection = () => {
  const { getDashboardStats, updateSewaStatus, setActiveTab } = useGasRental();
  const { ongoingRentals } = getDashboardStats();

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Play className="w-4 h-4 fill-blue-600" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Sewa Sedang Berjalan</h3>
            <p className="text-xs text-slate-500">Unit motor yang saat ini dibawa penyewa</p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('sewa')}
          className="text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl transition-colors"
        >
          Lihat Semua
        </button>
      </div>

      {ongoingRentals.length === 0 ? (
        <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
          <Bike className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-700">Tidak Ada Sewa Berjalan</p>
          <p className="text-xs text-slate-500 mt-0.5">Semua armada berada di garasi dan siap disewa.</p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {ongoingRentals.map((sewa) => (
            <div
              key={sewa.id}
              className="py-3.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100/70 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                  <Bike className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">{sewa.nama_motor}</span>
                    <span className="font-mono text-[11px] font-bold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                      {sewa.plat_nomor}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mt-1">
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-indigo-500" />
                      {sewa.nama_penyewa}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      {sewa.penyewa_id}
                    </span>
                    <span>
                      Mulai: <strong className="text-slate-700">{formatDateIndo(sewa.tanggal_mulai)}</strong> ({sewa.lama_hari} hari)
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={() => updateSewaStatus(sewa.id, 'selesai')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all active:scale-95"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Kembalikan
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
