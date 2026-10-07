import { useState, useMemo } from 'react';
import { useGasRental } from '../../context/GasRentalContext';
import { Penyewa } from '../../types';
import { PenyewaCard } from './PenyewaCard';
import { PenyewaFormDialog } from './PenyewaFormDialog';
import { PenyewaSearch } from './PenyewaSearch';
import { SkeletonLoader } from '../../components/common/SkeletonLoader';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorState } from '../../components/common/ErrorState';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Plus, Users, AlertCircle } from 'lucide-react';

export const PenyewaPage = () => {
  const {
    penyewas,
    isLoading,
    isError,
    triggerRetry,
    addPenyewa,
    updatePenyewa,
    deletePenyewa,
  } = useGasRental();

  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedPenyewa, setSelectedPenyewa] = useState<Penyewa | null>(null);
  const [penyewaToDelete, setPenyewaToDelete] = useState<Penyewa | null>(null);
  const [deleteErrorMessage, setDeleteErrorMessage] = useState<string | null>(null);

  const filteredPenyewas = useMemo(() => {
    if (!searchQuery.trim()) return penyewas;
    const q = searchQuery.toLowerCase().trim();
    return penyewas.filter(
      (p) =>
        p.nama.toLowerCase().includes(q) ||
        p.no_whatsapp.includes(q) ||
        p.asal_kota.toLowerCase().includes(q)
    );
  }, [penyewas, searchQuery]);

  const handleOpenAdd = () => {
    setSelectedPenyewa(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (penyewa: Penyewa) => {
    setSelectedPenyewa(penyewa);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (data: Omit<Penyewa, 'id' | 'dibuat_pada'>) => {
    if (selectedPenyewa) {
      return await updatePenyewa(selectedPenyewa.id, data);
    } else {
      return await addPenyewa(data);
    }
  };

  const handleConfirmDelete = async () => {
    if (!penyewaToDelete) return;
    setDeleteErrorMessage(null);
    const result = await deletePenyewa(penyewaToDelete.id);
    if (!result.success) {
      setDeleteErrorMessage(result.message || 'Gagal menghapus data penyewa');
    }
    setPenyewaToDelete(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider">
            <Users className="w-4 h-4" />
            <span>Master Data</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            Daftar Penyewa
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Kelola data pelanggan, nomor WhatsApp, kota asal, dan jenis jaminan identitas.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-2xl shadow-md shadow-emerald-600/20 transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Tambah Penyewa
        </button>
      </div>

      {/* Search Bar */}
      <PenyewaSearch query={searchQuery} onChange={setSearchQuery} />

      {/* Delete Error Notification */}
      {deleteErrorMessage && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between gap-2 text-xs text-rose-800">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{deleteErrorMessage}</span>
          </div>
          <button
            onClick={() => setDeleteErrorMessage(null)}
            className="text-rose-600 hover:text-rose-800 font-bold"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Feedback States & Content */}
      {isLoading ? (
        <SkeletonLoader count={3} type="card" />
      ) : isError ? (
        <ErrorState
          title="Gagal Memuat Daftar Penyewa"
          message="Tidak dapat mengambil data penyewa dari server. Silakan coba kembali."
          onRetry={triggerRetry}
        />
      ) : penyewas.length === 0 ? (
        <EmptyState
          title="Belum Ada Data Penyewa"
          description="Belum ada penyewa yang terdaftar di sistem. Mulai dengan mendaftarkan penyewa baru."
          actionLabel="Tambah Penyewa"
          onAction={handleOpenAdd}
          icon={<Users className="w-7 h-7" />}
        />
      ) : filteredPenyewas.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 text-slate-500 text-sm">
          Tidak ada penyewa yang cocok dengan kata kunci &quot;{searchQuery}&quot;.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredPenyewas.map((penyewa) => (
            <PenyewaCard
              key={penyewa.id}
              penyewa={penyewa}
              onEdit={handleOpenEdit}
              onDelete={(p) => setPenyewaToDelete(p)}
            />
          ))}
        </div>
      )}

      {/* Form Dialog for Add / Edit */}
      <PenyewaFormDialog
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedPenyewa}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!penyewaToDelete}
        onClose={() => setPenyewaToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Hapus Data Penyewa?"
        description={`Apakah Anda yakin ingin menghapus data penyewa "${penyewaToDelete?.nama}" (${penyewaToDelete?.no_whatsapp})? Tindakan ini tidak dapat dibatalkan.`}
        confirmLabel="Hapus Penyewa"
        cancelLabel="Batal"
        variant="danger"
      />
    </div>
  );
};
