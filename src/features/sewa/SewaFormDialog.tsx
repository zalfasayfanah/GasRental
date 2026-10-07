import { useState, useEffect } from 'react';
import { useGasRental } from '../../context/GasRentalContext';
import { formatRupiah, getTodayDateString } from '../../lib/utils';
import { X, ClipboardList, AlertCircle, Calculator } from 'lucide-react';

interface SewaFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SewaFormDialog = ({ isOpen, onClose }: SewaFormDialogProps) => {
  const { motors, penyewas, addSewa } = useGasRental();

  // Filter motor yang hanya tersedia
  const availableMotors = motors.filter((m) => m.tersedia);

  const [motorId, setMotorId] = useState('');
  const [penyewaId, setPenyewaId] = useState('');
  const [tanggalMulai, setTanggalMulai] = useState(getTodayDateString());
  const [lamaHari, setLamaHari] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMotorId(availableMotors.length > 0 ? availableMotors[0].id : '');
      setPenyewaId(penyewas.length > 0 ? penyewas[0].id : '');
      setTanggalMulai(getTodayDateString());
      setLamaHari(1);
      setError(null);
    }
  }, [isOpen, motors, penyewas]);

  if (!isOpen) return null;

  const selectedMotor = motors.find((m) => m.id === motorId);
  const calculatedTotal = selectedMotor ? selectedMotor.harga_per_hari * (lamaHari || 0) : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!motorId) {
      setError('Silakan pilih unit motor yang tersedia');
      return;
    }

    if (!penyewaId) {
      setError('Silakan pilih data penyewa');
      return;
    }

    if (!tanggalMulai) {
      setError('Tanggal mulai sewa wajib diisi');
      return;
    }

    if (!lamaHari || lamaHari < 1 || lamaHari > 30) {
      setError('Lama sewa harus antara 1 sampai 30 hari');
      return;
    }

    setIsSubmitting(true);
    const result = await addSewa({
      motor_id: motorId,
      penyewa_id: penyewaId,
      tanggal_mulai: tanggalMulai,
      lama_hari: lamaHari,
    });
    setIsSubmitting(false);

    if (result.success) {
      onClose();
    } else {
      setError(result.message || 'Gagal membuat transaksi sewa');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ClipboardList className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Buat Sewa Baru</h3>
              <p className="text-xs text-slate-500">Pilih motor tersedia dan data penyewa</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-700">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Motor Select */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Pilih Motor Tersedia <span className="text-rose-500">*</span>
            </label>
            {availableMotors.length === 0 ? (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 font-medium">
                Tidak ada unit motor yang sedang tersedia. Tambah motor baru atau tunggu motor kembali.
              </div>
            ) : (
              <select
                value={motorId}
                onChange={(e) => setMotorId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
              >
                {availableMotors.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.merek_tipe} ({m.plat_nomor}) - {formatRupiah(m.harga_per_hari)}/hari
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Penyewa Select */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Pilih Penyewa <span className="text-rose-500">*</span>
            </label>
            {penyewas.length === 0 ? (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 font-medium">
                Belum ada penyewa terdaftar. Silakan daftarkan penyewa terlebih dahulu di menu Penyewa.
              </div>
            ) : (
              <select
                value={penyewaId}
                onChange={(e) => setPenyewaId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
              >
                {penyewas.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nama} ({p.no_whatsapp}) - {p.jenis_jaminan}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Grid: Tanggal Mulai & Lama Hari */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Tanggal Mulai <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  required
                  value={tanggalMulai}
                  onChange={(e) => setTanggalMulai(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Lama Hari <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                required
                min={1}
                max={30}
                value={lamaHari || ''}
                onChange={(e) => setLamaHari(parseInt(e.target.value, 10) || 0)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">1 - 30 hari</span>
            </div>
          </div>

          {/* Auto Calculation Card */}
          <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4">
            <div className="flex items-center justify-between text-xs text-emerald-800 font-semibold mb-1">
              <span className="flex items-center gap-1.5">
                <Calculator className="w-4 h-4 text-emerald-600" />
                Rincian Perhitungan Total:
              </span>
              <span className="text-emerald-700">
                {selectedMotor ? formatRupiah(selectedMotor.harga_per_hari) : 'Rp 0'} × {lamaHari || 0} hari
              </span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-emerald-200/60 mt-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Total Biaya Sewa:
              </span>
              <span className="text-lg font-extrabold text-emerald-700">
                {formatRupiah(calculatedTotal)}
              </span>
            </div>
            <div className="text-[11px] text-emerald-600/90 mt-1">
              *Status awal transaksi adalah <span className="font-bold">dipesan</span>.
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting || availableMotors.length === 0 || penyewas.length === 0}
              className="px-5 py-2 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-600/20 transition-all active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? 'Menyimpan...' : 'Simpan Sewa'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
