import { useGasRental } from '../../context/GasRentalContext';
import { formatRupiah, formatDateIndo } from '../../lib/utils';
import { DollarSign, Calendar, TrendingUp, CheckCircle } from 'lucide-react';

export const RevenueSection = () => {
  const { sewas, revenueDate, setRevenueDate } = useGasRental();

  // Filter sewa yang statusnya selesai dan tanggal_mulai sesuai filter
  const completedRentalsOnDate = sewas.filter(
    (s) => s.status === 'selesai' && s.tanggal_mulai === revenueDate
  );

  const totalRevenue = completedRentalsOnDate.reduce((acc, curr) => acc + curr.total, 0);

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-5">
      {/* Header & Date Picker */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <DollarSign className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Laporan Pendapatan</h3>
            <p className="text-xs text-slate-500">Omzet dari transaksi sewa yang berstatus selesai</p>
          </div>
        </div>

        {/* Date Selector */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Pilih Tanggal:</span>
            <input
              type="date"
              value={revenueDate}
              onChange={(e) => setRevenueDate(e.target.value)}
              className="bg-transparent font-bold text-slate-900 focus:outline-none cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Revenue Highlight Banner */}
      <div className="bg-gradient-to-tr from-emerald-800 to-teal-700 rounded-2xl p-5 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-emerald-200 text-xs font-semibold uppercase tracking-wider">
              <TrendingUp className="w-4 h-4" />
              <span>Pendapatan Selesai · {formatDateIndo(revenueDate)}</span>
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-1 text-white">
              {formatRupiah(totalRevenue)}
            </div>
            <p className="text-xs text-emerald-100/90 mt-1">
              Dari total {completedRentalsOnDate.length} transaksi selesai pada tanggal ini
            </p>
          </div>
        </div>
      </div>

      {/* Breakdown list */}
      {completedRentalsOnDate.length > 0 && (
        <div className="space-y-2 pt-2">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Rincian Transaksi Selesai:
          </div>
          <div className="divide-y divide-slate-100 bg-slate-50 rounded-2xl p-3 border border-slate-100">
            {completedRentalsOnDate.map((sewa) => (
              <div key={sewa.id} className="py-2 first:pt-0 last:pb-0 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="font-bold text-slate-800">{sewa.nama_motor}</span>
                  <span className="text-slate-500">({sewa.nama_penyewa})</span>
                </div>
                <div className="font-mono font-extrabold text-emerald-700">
                  {formatRupiah(sewa.total)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
