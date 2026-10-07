import { useState } from 'react';
import { useGasRental } from '../../context/GasRentalContext';
import { Motor } from '../../types';
import { MotorCard } from './MotorCard';
import { MotorFormDialog } from './MotorFormDialog';
import { SkeletonLoader } from '../../components/common/SkeletonLoader';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorState } from '../../components/common/ErrorState';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Plus, Bike, AlertCircle } from 'lucide-react';

export const MotorPage = () => {
  const {
    motors,
    isLoading,
    isError,
    triggerRetry,
    addMotor,
    updateMotor,
    deleteMotor,
  } = useGasRental();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedMotor, setSelectedMotor] = useState<Motor | null>(null);
  const [motorToDelete, setMotorToDelete] = useState<Motor | null>(null);
  const [deleteErrorMessage, setDeleteErrorMessage] = useState<string | null>(null);

  const handleOpenAdd = () => {
    setSelectedMotor(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (motor: Motor) => {
    setSelectedMotor(motor);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (data: Omit<Motor, 'id' | 'dibuat_pada'>) => {
    if (selectedMotor) {
      return await updateMotor(selectedMotor.id, data);
    } else {
      return await addMotor(data);
    }
  };

  const handleConfirmDelete = async () => {
    if (!motorToDelete) return;
    setDeleteErrorMessage(null);
    const result = await deleteMotor(motorToDelete.id);
    if (!result.success) {
      setDeleteErrorMessage(result.message || 'Gagal menghapus motor');
    }
    setMotorToDelete(null);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider">
            <Bike className="w-4 h-4" />
            <span>Master Data</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            Daftar Armada Motor
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Kelola unit motor, nomor plat, harga sewa per hari, dan status ketersediaan.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-2xl shadow-md shadow-emerald-600/20 transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Tambah Motor
        </button>
      </div>

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

      {/* Content Rendering based on 3 States */}
      {isLoading ? (
        <SkeletonLoader count={3} type="card" />
      ) : isError ? (
        <ErrorState
          title="Gagal Memuat Daftar Motor"
          message="Tidak dapat memuat koleksi motor dari server. Silakan coba kembali."
          onRetry={triggerRetry}
        />
      ) : motors.length === 0 ? (
        <EmptyState
          title="Belum Ada Data Motor"
          description="Belum ada unit motor yang terdaftar di sistem. Mulai dengan menambahkan unit motor pertama Anda."
          actionLabel="Tambah Motor"
          onAction={handleOpenAdd}
          icon={<Bike className="w-7 h-7" />}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {motors.map((motor) => (
            <MotorCard
              key={motor.id}
              motor={motor}
              onEdit={handleOpenEdit}
              onDelete={(m) => setMotorToDelete(m)}
            />
          ))}
        </div>
      )}

      {/* Form Dialog for Add / Edit */}
      <MotorFormDialog
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedMotor}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!motorToDelete}
        onClose={() => setMotorToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Hapus Unit Motor?"
        description={`Apakah Anda yakin ingin menghapus "${motorToDelete?.merek_tipe}" (${motorToDelete?.plat_nomor})? Tindakan ini tidak dapat dibatalkan.`}
        confirmLabel="Hapus Motor"
        cancelLabel="Batal"
        variant="danger"
      />
    </div>
  );
};
