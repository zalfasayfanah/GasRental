import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Motor, Penyewa, Sewa, RentStatus, UIStateMode, ActiveTab } from '../types';
import { getTodayDateString } from '../lib/utils';
import { motorService } from '../services/motorService';
import { penyewaService } from '../services/penyewaService';
import { sewaService } from '../services/sewaService';
import { initialMotors, initialPenyewas } from '../lib/mockData';

interface GasRentalContextType {
  // Navigation & UI State Mode
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  uiMode: UIStateMode;
  setUiMode: (mode: UIStateMode) => void;
  isLoading: boolean;
  isError: boolean;
  triggerRetry: () => void;

  // Data Collections (Live Firestore)
  motors: Motor[];
  penyewas: Penyewa[];
  sewas: Sewa[];

  // Motor CRUD
  addMotor: (motor: Omit<Motor, 'id' | 'dibuat_pada'>) => Promise<{ success: boolean; message?: string }>;
  updateMotor: (id: string, motor: Partial<Omit<Motor, 'id' | 'dibuat_pada'>>) => Promise<{ success: boolean; message?: string }>;
  deleteMotor: (id: string) => Promise<{ success: boolean; message?: string }>;

  // Penyewa CRUD
  addPenyewa: (penyewa: Omit<Penyewa, 'id' | 'dibuat_pada'>) => Promise<{ success: boolean; message?: string }>;
  updatePenyewa: (id: string, penyewa: Partial<Omit<Penyewa, 'id' | 'dibuat_pada'>>) => Promise<{ success: boolean; message?: string }>;
  deletePenyewa: (id: string) => Promise<{ success: boolean; message?: string }>;

  // Sewa CRUD & Status Transitions
  addSewa: (data: {
    motor_id: string;
    penyewa_id: string;
    tanggal_mulai: string;
    lama_hari: number;
  }) => Promise<{ success: boolean; message?: string }>;
  updateSewaStatus: (sewaId: string, nextStatus: RentStatus) => Promise<{ success: boolean; message?: string }>;
  deleteSewa: (id: string) => Promise<{ success: boolean; message?: string }>;

  // Dashboard calculations
  revenueDate: string;
  setRevenueDate: (date: string) => void;
  getDashboardStats: () => {
    totalMotor: number;
    motorTersedia: number;
    motorDisewa: number;
    sewaBerjalanCount: number;
    totalPendapatanHari: number;
    ongoingRentals: Sewa[];
  };

  // Seed sample data to Firestore if empty
  seedSampleData: () => Promise<void>;
  resetMockData: () => void;
}

const GasRentalContext = createContext<GasRentalContextType | undefined>(undefined);

export const GasRentalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dasbor');
  const [uiMode, setUiMode] = useState<UIStateMode>('normal');
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);
  const [isFetchError, setIsFetchError] = useState<boolean>(false);
  const [revenueDate, setRevenueDate] = useState<string>(getTodayDateString());

  // Firestore Data States
  const [motors, setMotors] = useState<Motor[]>([]);
  const [penyewas, setPenyewas] = useState<Penyewa[]>([]);
  const [sewas, setSewas] = useState<Sewa[]>([]);

  // Fetch all collections from Firestore
  const fetchAllData = useCallback(async () => {
    setIsLoadingData(true);
    setIsFetchError(false);
    try {
      const [motorsData, penyewasData, sewasData] = await Promise.all([
        motorService.getMotors(),
        penyewaService.getPenyewas(),
        sewaService.getSewas(),
      ]);

      setMotors(motorsData);
      setPenyewas(penyewasData);
      setSewas(sewasData);
    } catch (err) {
      console.error('Error fetching Firestore collections:', err);
      setIsFetchError(true);
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const triggerRetry = () => {
    fetchAllData();
    setUiMode('normal');
  };

  // Helper to seed initial sample data into Firestore if database is freshly initialized
  const seedSampleData = async () => {
    setIsLoadingData(true);
    try {
      for (const m of initialMotors) {
        await motorService.addMotor({
          merek_tipe: m.merek_tipe,
          plat_nomor: m.plat_nomor,
          harga_per_hari: m.harga_per_hari,
          tersedia: m.tersedia,
        });
      }
      for (const p of initialPenyewas) {
        await penyewaService.addPenyewa({
          nama: p.nama,
          no_whatsapp: p.no_whatsapp,
          asal_kota: p.asal_kota,
          jenis_jaminan: p.jenis_jaminan,
        });
      }
      await fetchAllData();
    } catch (err) {
      console.error('Error seeding data:', err);
    } finally {
      setIsLoadingData(false);
    }
  };

  const resetMockData = () => {
    fetchAllData();
    setUiMode('normal');
  };

  // Motor Operations (Firestore)
  const addMotor = async (motorData: Omit<Motor, 'id' | 'dibuat_pada'>) => {
    if (!motorData.merek_tipe.trim()) return { success: false, message: 'Merek dan tipe motor wajib diisi' };
    if (!motorData.plat_nomor.trim()) return { success: false, message: 'Plat nomor wajib diisi' };
    if (motorData.harga_per_hari < 0) return { success: false, message: 'Harga per hari tidak boleh negatif' };

    try {
      await motorService.addMotor(motorData);
      await fetchAllData();
      return { success: true };
    } catch (err: any) {
      console.error('Error adding motor:', err);
      return { success: false, message: err.message || 'Gagal menyimpan data motor ke Firestore' };
    }
  };

  const updateMotor = async (id: string, updateData: Partial<Omit<Motor, 'id' | 'dibuat_pada'>>) => {
    if (updateData.harga_per_hari !== undefined && updateData.harga_per_hari < 0) {
      return { success: false, message: 'Harga per hari tidak boleh negatif' };
    }
    try {
      await motorService.updateMotor(id, updateData);
      await fetchAllData();
      return { success: true };
    } catch (err: any) {
      console.error('Error updating motor:', err);
      return { success: false, message: err.message || 'Gagal memperbarui data motor di Firestore' };
    }
  };

  const deleteMotor = async (id: string) => {
    const hasActiveSewa = sewas.some((s) => s.motor_id === id && (s.status === 'berjalan' || s.status === 'dipesan'));
    if (hasActiveSewa) {
      return { success: false, message: 'Motor tidak dapat dihapus karena masih terkait transaksi aktif' };
    }
    try {
      await motorService.deleteMotor(id);
      await fetchAllData();
      return { success: true };
    } catch (err: any) {
      console.error('Error deleting motor:', err);
      return { success: false, message: err.message || 'Gagal menghapus motor dari Firestore' };
    }
  };

  // Penyewa Operations (Firestore)
  const addPenyewa = async (penyewaData: Omit<Penyewa, 'id' | 'dibuat_pada'>) => {
    const cleanNoWa = penyewaData.no_whatsapp.trim();
    if (!cleanNoWa.startsWith('08') || cleanNoWa.length < 10 || cleanNoWa.length > 13 || !/^\d+$/.test(cleanNoWa)) {
      return { success: false, message: 'Nomor WhatsApp harus diawali 08 dan terdiri dari 10-13 digit angka' };
    }
    if (!penyewaData.nama.trim()) return { success: false, message: 'Nama penyewa wajib diisi' };
    if (!penyewaData.asal_kota.trim()) return { success: false, message: 'Asal kota wajib diisi' };

    try {
      await penyewaService.addPenyewa(penyewaData);
      await fetchAllData();
      return { success: true };
    } catch (err: any) {
      console.error('Error adding penyewa:', err);
      return { success: false, message: err.message || 'Gagal menyimpan data penyewa' };
    }
  };

  const updatePenyewa = async (id: string, updateData: Partial<Omit<Penyewa, 'id' | 'dibuat_pada'>>) => {
    try {
      await penyewaService.updatePenyewa(id, updateData);
      await fetchAllData();
      return { success: true };
    } catch (err: any) {
      console.error('Error updating penyewa:', err);
      return { success: false, message: err.message || 'Gagal memperbarui data penyewa di Firestore' };
    }
  };

  const deletePenyewa = async (id: string) => {
    const hasActiveSewa = sewas.some((s) => s.penyewa_id === id && (s.status === 'berjalan' || s.status === 'dipesan'));
    if (hasActiveSewa) {
      return { success: false, message: 'Penyewa tidak dapat dihapus karena masih memiliki sewa aktif' };
    }
    try {
      await penyewaService.deletePenyewa(id);
      await fetchAllData();
      return { success: true };
    } catch (err: any) {
      console.error('Error deleting penyewa:', err);
      return { success: false, message: err.message || 'Gagal menghapus penyewa dari Firestore' };
    }
  };

  // Sewa Operations (Firestore)
  const addSewa = async ({
    motor_id,
    penyewa_id,
    tanggal_mulai,
    lama_hari,
  }: {
    motor_id: string;
    penyewa_id: string;
    tanggal_mulai: string;
    lama_hari: number;
  }) => {
    if (lama_hari < 1 || lama_hari > 30) {
      return { success: false, message: 'Lama sewa harus antara 1 sampai 30 hari' };
    }
    const motor = motors.find((m) => m.id === motor_id);
    if (!motor) return { success: false, message: 'Motor tidak ditemukan' };
    if (!motor.tersedia) return { success: false, message: 'Motor sedang tidak tersedia' };

    const penyewa = penyewas.find((p) => p.id === penyewa_id);
    if (!penyewa) return { success: false, message: 'Penyewa tidak ditemukan' };

    try {
      await sewaService.addSewa({
        motor_id: motor.id,
        nama_motor: motor.merek_tipe,
        plat_nomor: motor.plat_nomor,
        penyewa_id: penyewa.id,
        nama_penyewa: penyewa.nama,
        harga_per_hari: motor.harga_per_hari,
        tanggal_mulai,
        lama_hari,
      });
      await fetchAllData();
      return { success: true };
    } catch (err: any) {
      console.error('Error creating sewa:', err);
      return { success: false, message: err.message || 'Gagal membuat transaksi sewa di Firestore' };
    }
  };

  const updateSewaStatus = async (sewaId: string, nextStatus: RentStatus) => {
    const sewa = sewas.find((s) => s.id === sewaId);
    if (!sewa) return { success: false, message: 'Sewa tidak ditemukan' };

    // Aturan transisi status PRD:
    // dipesan -> berjalan | dibatalkan
    // berjalan -> selesai
    if (sewa.status === 'dipesan') {
      if (nextStatus !== 'berjalan' && nextStatus !== 'dibatalkan') {
        return { success: false, message: 'Status dipesan hanya boleh berubah ke berjalan atau dibatalkan' };
      }
    } else if (sewa.status === 'berjalan') {
      if (nextStatus !== 'selesai') {
        return { success: false, message: 'Status berjalan hanya boleh berubah ke selesai' };
      }
    } else {
      return { success: false, message: 'Status transaksi yang sudah selesai atau dibatalkan tidak dapat diubah lagi' };
    }

    try {
      await sewaService.updateSewaStatus(sewaId, sewa.motor_id, nextStatus);
      await fetchAllData();
      return { success: true };
    } catch (err: any) {
      console.error('Error updating status sewa:', err);
      return { success: false, message: err.message || 'Gagal mengubah status sewa di Firestore' };
    }
  };

  const deleteSewa = async (id: string) => {
    try {
      await sewaService.deleteSewa(id);
      await fetchAllData();
      return { success: true };
    } catch (err: any) {
      console.error('Error deleting sewa:', err);
      return { success: false, message: err.message || 'Gagal menghapus sewa dari Firestore' };
    }
  };

  // Dasbor calculations
  const getDashboardStats = () => {
    const totalMotor = motors.length;
    const motorTersedia = motors.filter((m) => m.tersedia).length;
    const motorDisewa = motors.filter((m) => !m.tersedia).length;
    const ongoingRentals = sewas.filter((s) => s.status === 'berjalan');
    const sewaBerjalanCount = ongoingRentals.length;

    const totalPendapatanHari = sewas
      .filter((s) => s.status === 'selesai' && s.tanggal_mulai === revenueDate)
      .reduce((acc, curr) => acc + curr.total, 0);

    return {
      totalMotor,
      motorTersedia,
      motorDisewa,
      sewaBerjalanCount,
      totalPendapatanHari,
      ongoingRentals,
    };
  };

  const isLoading = uiMode === 'loading' || isLoadingData;
  const isError = uiMode === 'error' || isFetchError;

  return (
    <GasRentalContext.Provider
      value={{
        activeTab,
        setActiveTab,
        uiMode,
        setUiMode,
        isLoading,
        isError,
        triggerRetry,
        motors: uiMode === 'empty' ? [] : motors,
        penyewas: uiMode === 'empty' ? [] : penyewas,
        sewas: uiMode === 'empty' ? [] : sewas,
        addMotor,
        updateMotor,
        deleteMotor,
        addPenyewa,
        updatePenyewa,
        deletePenyewa,
        addSewa,
        updateSewaStatus,
        deleteSewa,
        revenueDate,
        setRevenueDate,
        getDashboardStats,
        seedSampleData,
        resetMockData,
      }}
    >
      {children}
    </GasRentalContext.Provider>
  );
};

export const useGasRental = () => {
  const context = useContext(GasRentalContext);
  if (!context) {
    throw new Error('useGasRental must be used within a GasRentalProvider');
  }
  return context;
};
