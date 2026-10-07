import { useState, useMemo } from 'react';
import { useGasRental } from '../../context/GasRentalContext';
import { Sewa, RentStatus } from '../../types';
import { SewaCard } from './SewaCard';
import { SewaFormDialog } from './SewaFormDialog';
import { SkeletonLoader } from '../../components/common/SkeletonLoader';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorState } from '../../components/common/ErrorState';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Plus, ClipboardList, AlertCircle } from 'lucide-react';

export const SewaPage = () => {
  const {
    sewas,
    isLoading,
    isError,
    triggerRetry,
    updateSewaStatus,
    deleteSewa,
  } = useGasRental();

  const [filterTab, setFilterTab] = useState<'semua' | RentStatus>('semua');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [sewaToUpdate, setSewaToUpdate] = useState<{ sewa: Sewa; nextStatus: 'berjalan' | 'selesai' | 'dibatalkan' } | null>(null);
  const [sewaToDelete, setSewaToDelete] = useState<Sewa | null>(null);
  const [statusErrorMessage, setStatusErrorMessage] = useState<string | null>(null);

  const filteredSewas = useMemo(() => {
    if (filterTab === 'semua') return sewas;
    return sewas.filter((s) => s.status === filterTab);
  }, [sewas, filterTab]);

  const tabs: { id: 'semua' | RentStatus; label: string; count?: number }[] = [
    { id: 'semua', label: 'Semua', count: sewas.length },
    { id: 'dipesan', label: 'Dipesan', count: sewas.filter((s) => s.status === 'dipesan').length },
    { id: 'berjalan', label: 'Berjalan', count: sewas.filter((s) => s.status === 'berjalan').length },
    { id: 'selesai', label: 'Selesai', count: sewas.filter((s) => s.status === 'selesai').length },
    { id: 'dibatalkan', label: 'Dibatalkan', count: sewas.filter((s) => s.status === 'dibatalkan').length },
  ];

  const handleStatusClick = (sewa: Sewa, nextStatus: 'berjalan' | 'selesai' | 'dibatalkan') => {
    if (nextStatus === 'berjalan') {
      // Serah terima bisa langsung atau lewat konfirmasi
      updateSewaStatus(sewa.id, 'berjalan');
    } else {
      // Selesai atau Dibatalkan minta konfirmasi
      setSewaToUpdate({ sewa, nextStatus });
    }
  };

  const handleConfirmStatusChange = async () => {
    if (!sewaToUpdate) return;
    setStatusErrorMessage(null);
    const result = await updateSewaStatus(sewaToUpdate.sewa.id, sewaToUpdate.nextStatus);
    if (!result.success) {
      setStatusErrorMessage(result.message || 'Gagal mengubah status sewa');
    }
    setSewaToUpdate(null);
  };

  const handleConfirmDelete = async () => {
    if (!sewaToDelete) return;
    await deleteSewa(sewaToDelete.id);
    setSewaToDelete(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider">
            <ClipboardList className="w-4 h-4" />
            <span>Transaksi & Jadwal</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            Daftar Sewa Motor
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Kelola status sewa, serah terima armada, pengembalian, dan pembatalan sewa.
          </p>
        </div>

        <button
          onClick={() => setIsFormOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-2xl shadow-md shadow-emerald-600/20 transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Sewa Baru
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {tabs.map((tab) => {
          const isActive = filterTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setFilterTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-slate-700 text-emerald-300'
                      : 'bg-slate-100 text-slate-600 font-semibold'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Status Error Alert */}
      {statusErrorMessage && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between gap-2 text-xs text-rose-800">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{statusErrorMessage}</span>
          </div>
          <button
            onClick={() => setStatusErrorMessage(null)}
            className="text-rose-600 hover:text-rose-800 font-bold"
          >
            Tutup
          </button>
        </div>
      )}

      {/* 3 States & List Content */}
      {isLoading ? (
        <SkeletonLoader count={3} type="card" />
      ) : isError ? (
        <ErrorState
          title="Gagal Memuat Transaksi Sewa"
          message="Terjadi kesalahan saat memuat data transaksi dari server. Silakan coba kembali."
          onRetry={triggerRetry}
        />
      ) : sewas.length === 0 ? (
        <EmptyState
          title="Belum Ada Transaksi Sewa"
          description="Belum ada catatan sewa yang dibuat. Mulai dengan membuat transaksi sewa baru."
          actionLabel="Buat Sewa Baru"
          onAction={() => setIsFormOpen(true)}
          icon={<ClipboardList className="w-7 h-7" />}
        />
      ) : filteredSewas.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 text-slate-500 text-sm">
          Tidak ada data sewa dengan status &quot;{filterTab}&quot;.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredSewas.map((sewa) => (
            <SewaCard
              key={sewa.id}
              sewa={sewa}
              onUpdateStatus={handleStatusClick}
              onDelete={(s) => setSewaToDelete(s)}
            />
          ))}
        </div>
      )}

      {/* New Sewa Dialog */}
      <SewaFormDialog
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
      />

      {/* Confirm Status Change Dialog */}
      <ConfirmDialog
        isOpen={!!sewaToUpdate}
        onClose={() => setSewaToUpdate(null)}
        onConfirm={handleConfirmStatusChange}
        title={
          sewaToUpdate?.nextStatus === 'selesai'
            ? 'Konfirmasi Pengembalian Motor'
            : 'Konfirmasi Pembatalan Sewa'
        }
        description={
          sewaToUpdate?.nextStatus === 'selesai'
            ? `Pastikan motor "${sewaToUpdate.sewa.nama_motor}" (${sewaToUpdate.sewa.plat_nomor}) sudah dikembalikan oleh ${sewaToUpdate.sewa.nama_penyewa} dan dalam kondisi baik. Motor akan otomatis ditandai "Tersedia".`
            : `Apakah Anda yakin ingin membatalkan sewa untuk ${sewaToUpdate?.sewa.nama_penyewa}? Status akan menjadi "Dibatalkan" dan motor tetap tersedia.`
        }
        confirmLabel={
          sewaToUpdate?.nextStatus === 'selesai' ? 'Ya, Selesaikan Sewa' : 'Ya, Batalkan Sewa'
        }
        cancelLabel="Kembali"
        variant={sewaToUpdate?.nextStatus === 'selesai' ? 'primary' : 'danger'}
      />

      {/* Confirm Delete Record Dialog */}
      <ConfirmDialog
        isOpen={!!sewaToDelete}
        onClose={() => setSewaToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Hapus Riwayat Sewa?"
        description={`Apakah Anda yakin ingin menghapus data riwayat sewa ID ${sewaToDelete?.id}?`}
        confirmLabel="Hapus Riwayat"
        cancelLabel="Batal"
        variant="danger"
      />
    </div>
  );
};
