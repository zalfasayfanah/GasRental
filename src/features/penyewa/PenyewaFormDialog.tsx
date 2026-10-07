import { useState, useEffect } from 'react';
import { Penyewa, JenisJaminan } from '../../types';
import { X, User, AlertCircle } from 'lucide-react';

interface PenyewaFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Penyewa, 'id' | 'dibuat_pada'>) => Promise<{ success: boolean; message?: string }>;
  initialData?: Penyewa | null;
}

export const PenyewaFormDialog = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: PenyewaFormDialogProps) => {
  const [nama, setNama] = useState('');
  const [noWhatsapp, setNoWhatsapp] = useState('');
  const [asalKota, setAsalKota] = useState('');
  const [jenisJaminan, setJenisJaminan] = useState<JenisJaminan>('KTP');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setNama(initialData.nama);
      setNoWhatsapp(initialData.no_whatsapp);
      setAsalKota(initialData.asal_kota);
      setJenisJaminan(initialData.jenis_jaminan);
    } else {
      setNama('');
      setNoWhatsapp('');
      setAsalKota('');
      setJenisJaminan('KTP');
    }
    setError(null);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanNama = nama.trim();
    const cleanNoWa = noWhatsapp.trim();
    const cleanKota = asalKota.trim();

    if (!cleanNama || cleanNama.length > 60) {
      setError('Nama penyewa wajib diisi (1 - 60 karakter)');
      return;
    }

    if (!cleanNoWa.startsWith('08') || cleanNoWa.length < 10 || cleanNoWa.length > 13 || !/^\d+$/.test(cleanNoWa)) {
      setError('Nomor WhatsApp harus diawali 08 dan terdiri dari 10 - 13 digit angka');
      return;
    }

    if (!cleanKota || cleanKota.length > 40) {
      setError('Asal kota wajib diisi (1 - 40 karakter)');
      return;
    }

    if (!['KTP', 'SIM', 'Paspor'].includes(jenisJaminan)) {
      setError('Jenis jaminan harus salah satu dari: KTP, SIM, atau Paspor');
      return;
    }

    setIsSubmitting(true);
    const result = await onSubmit({
      nama: cleanNama,
      no_whatsapp: cleanNoWa,
      asal_kota: cleanKota,
      jenis_jaminan: jenisJaminan,
    });
    setIsSubmitting(false);

    if (result.success) {
      onClose();
    } else {
      setError(result.message || 'Gagal menyimpan data penyewa');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">
                {initialData ? 'Ubah Data Penyewa' : 'Tambah Penyewa Baru'}
              </h3>
              <p className="text-xs text-slate-500">
                {initialData ? 'Perbarui data identitas penyewa' : 'Daftarkan data penyewa dan jenis jaminan'}
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
              Nama Lengkap Penyewa <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              maxLength={60}
              placeholder="Contoh: Putri Lestari"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-medium"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">1 - 60 karakter</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Nomor WhatsApp <span className="text-rose-500">*</span>
            </label>
            <input
              type="tel"
              required
              disabled={!!initialData}
              maxLength={13}
              placeholder="Contoh: 085712345678"
              value={noWhatsapp}
              onChange={(e) => setNoWhatsapp(e.target.value.replace(/\D/g, ''))}
              className={`w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all ${
                initialData ? 'opacity-60 cursor-not-allowed bg-slate-100' : ''
              }`}
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              {initialData ? 'Nomor WhatsApp tidak dapat diubah (Doc ID Firestore)' : 'Diawali 08, 10 - 13 angka'}
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Asal Kota <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              maxLength={40}
              placeholder="Contoh: Surabaya"
              value={asalKota}
              onChange={(e) => setAsalKota(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-medium"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">1 - 40 karakter</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Jenis Jaminan Dititipkan <span className="text-rose-500">*</span>
            </label>
            <select
              value={jenisJaminan}
              onChange={(e) => setJenisJaminan(e.target.value as JenisJaminan)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
            >
              <option value="KTP">KTP (Kartu Tanda Penduduk)</option>
              <option value="SIM">SIM (Surat Izin Mengemudi)</option>
              <option value="Paspor">Paspor (Wisatawan Mancanegara)</option>
            </select>
            <span className="text-[11px] text-slate-400 mt-1 block">Hanya KTP, SIM, atau Paspor</span>
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
              {isSubmitting ? 'Menyimpan...' : initialData ? 'Perbarui Penyewa' : 'Simpan Penyewa'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
