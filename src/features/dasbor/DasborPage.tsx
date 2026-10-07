import { useGasRental } from '../../context/GasRentalContext';
import { StatCard } from './StatCard';
import { OngoingRentalsSection } from './OngoingRentalsSection';
import { RevenueSection } from './RevenueSection';
import { SkeletonLoader } from '../../components/common/SkeletonLoader';
import { ErrorState } from '../../components/common/ErrorState';
import { formatRupiah } from '../../lib/utils';
import { Bike, Clock, Play, DollarSign, LayoutDashboard } from 'lucide-react';

export const DasborPage = () => {
  const {
    isLoading,
    isError,
    triggerRetry,
    getDashboardStats,
  } = useGasRental();

  const {
    motorTersedia,
    motorDisewa,
    sewaBerjalanCount,
    totalPendapatanHari,
  } = getDashboardStats();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <SkeletonLoader type="stats" />
        <SkeletonLoader count={2} type="card" />
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        title="Gagal Memuat Dasbor"
        message="Tidak dapat memuat ringkasan data rental dari server. Silakan coba kembali."
        onRetry={triggerRetry}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider">
          <LayoutDashboard className="w-4 h-4" />
          <span>Ikhtisar Usaha</span>
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
          Dasbor Gas Rental
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Pantau status ketersediaan armada motor, transaksi aktif, dan pendapatan harian secara real-time.
        </p>
      </div>

      {/* 4 Stat Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <StatCard
          title="Motor Tersedia"
          value={motorTersedia}
          subtitle="Siap untuk disewa"
          icon={<Bike className="w-5 h-5" />}
          variant="emerald"
        />

        <StatCard
          title="Motor Disewa"
          value={motorDisewa}
          subtitle="Sedang dibawa penyewa"
          icon={<Clock className="w-5 h-5" />}
          variant="amber"
        />

        <StatCard
          title="Sewa Berjalan"
          value={sewaBerjalanCount}
          subtitle="Transaksi aktif"
          icon={<Play className="w-5 h-5 fill-white" />}
          variant="blue"
        />

        <StatCard
          title="Pendapatan Hari Ini"
          value={formatRupiah(totalPendapatanHari)}
          subtitle="Status selesai"
          icon={<DollarSign className="w-5 h-5" />}
          variant="indigo"
        />
      </div>

      {/* Ongoing Rentals Section */}
      <OngoingRentalsSection />

      {/* Revenue Section with Date Filter */}
      <RevenueSection />
    </div>
  );
};
