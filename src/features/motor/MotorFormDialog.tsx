import { useState, useEffect } from 'react';
import { Motor } from '../../types';
import { X, Bike, AlertCircle } from 'lucide-react';

interface MotorFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Motor, 'id' | 'dibuat_pada'>) => Promise<{ success: boolean; message?: string }>;
  initialData?: Motor | null;
}

export const MotorFormDialog = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: MotorFormDialogProps) => {
  const [merekTipe, setMerekTipe] = useState('');
  const [platNomor, setPlatNomor] = useState('');
  const [hargaPerHari, setHargaPerHari] = useState<string>('75000');
  const [tersedia, setTersedia] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setMerekTipe(initialData.merek_tipe);
      setPlatNomor(initialData.plat_nomor);
      setHargaPerHari(initialData.harga_per_hari.toString());
      setTersedia(initialData.tersedia);
    } else {
      setMerekTipe('');
      setPlatNomor('');
      setHargaPerHari('75000');
      setTersedia(true);
    }
    setError(null);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    const cleanMerek = merekTipe.trim();
    const cleanPlat = platNomor.trim().toUpperCase();
    const parsedHarga = parseInt(hargaPerHari, 10);

    if (!cleanMerek || cleanMerek.length > 40) {
      setError('Merek dan tipe motor wajib diisi (1 - 40 karakter)');
      return;
    }

    if (!cleanPlat || cleanPlat.length < 3 || cleanPlat.length > 12) {
      setError('Plat nomor wajib diisi (3 - 12 karakter, contoh: DK 1234 AB)');
      return;
    }

    if (isNaN(parsedHarga) || parsedHarga < 0) {
      setError('Harga sewa per hari harus angka bulat minimal 0');
      return;
    }

    setIsSubmitting(true);
    const result = await onSubmit({
      merek_tipe: cleanMerek,
      plat_nomor: cleanPlat,
      harga_per_hari: parsedHarga,
      tersedia,
    });
    setIsSubmitting(false);

    if (result.success) {
      onClose();
    } else {
      setError(result.message || 'Gagal menyimpan data motor');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Bike className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">
                {initialData ? 'Ubah Data Motor' : 'Tambah Motor Baru'}
              </h3>
              <p className="text-xs text-slate-500">
                {initialData ? 'Perbarui informasi armada motor' : 'Daftarkan unit motor baru ke armada'}
              </p>
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
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Merek & Tipe Motor <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              maxLength={40}
              placeholder="Contoh: Honda Vario 125"
              value={merekTipe}
              onChange={(e) => setMerekTipe(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-medium"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">Maksimal 40 karakter</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Plat Nomor <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              maxLength={12}
              placeholder="Contoh: DK 1234 AB"
              value={platNomor}
              onChange={(e) => setPlatNomor(e.target.value.toUpperCase())}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all tracking-wider uppercase"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">3 - 12 karakter, huruf kapital</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Harga Sewa per Hari (Rp) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              required
              min={0}
              step={1000}
              placeholder="Contoh: 80000"
              value={hargaPerHari}
              onChange={(e) => setHargaPerHari(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">Nominal rupiah bulat, minimal 0</span>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
              <input
                type="checkbox"
                checked={tersedia}
                onChange={(e) => setTersedia(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
              />
              <div>
                <div className="text-xs font-bold text-slate-800">Status Tersedia untuk Disewa</div>
                <div className="text-[11px] text-slate-500">Centang jika motor siap disewakan kepada pelanggan</div>
              </div>
            </label>
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
              disabled={isSubmitting}
              className="px-5 py-2 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-600/20 transition-all active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? 'Menyimpan...' : initialData ? 'Perbarui Motor' : 'Simpan Motor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
