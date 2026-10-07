import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Motor, Penyewa, Sewa, RentStatus, UIStateMode, ActiveTab } from '../types';
import { initialMotors, initialPenyewas, initialSewas } from '../lib/mockData';
import { getTodayDateString } from '../lib/utils';

interface GasRentalContextType {
  // Navigation & UI State Mode
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  uiMode: UIStateMode;
  setUiMode: (mode: UIStateMode) => void;
  isLoading: boolean;
  isError: boolean;
  triggerRetry: () => void;

  // Data Collections
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

  // Reset helper
  resetMockData: () => void;
}

const GasRentalContext = createContext<GasRentalContextType | undefined>(undefined);

const STORAGE_KEY_MOTORS = 'gas_rental_motors';
const STORAGE_KEY_PENYEWAS = 'gas_rental_penyewas';
const STORAGE_KEY_SEWAS = 'gas_rental_sewas';

export const GasRentalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dasbor');
  const [uiMode, setUiMode] = useState<UIStateMode>('normal');
  const [isSimulatedLoading, setIsSimulatedLoading] = useState<boolean>(false);
  const [revenueDate, setRevenueDate] = useState<string>(getTodayDateString());

  // Inisialisasi State dari localStorage jika ada, atau fallback ke initial mock data
  const [motors, setMotors] = useState<Motor[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_MOTORS);
    return saved ? JSON.parse(saved) : initialMotors;
  });

  const [penyewas, setPenyewas] = useState<Penyewa[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PENYEWAS);
    return saved ? JSON.parse(saved) : initialPenyewas;
  });

  const [sewas, setSewas] = useState<Sewa[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_SEWAS);
    return saved ? JSON.parse(saved) : initialSewas;
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_MOTORS, JSON.stringify(motors));
  }, [motors]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PENYEWAS, JSON.stringify(penyewas));
  }, [penyewas]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SEWAS, JSON.stringify(sewas));
  }, [sewas]);

  const triggerRetry = () => {
    setIsSimulatedLoading(true);
    setTimeout(() => {
      setIsSimulatedLoading(false);
      setUiMode('normal');
    }, 600);
  };

  const resetMockData = () => {
    setMotors(initialMotors);
    setPenyewas(initialPenyewas);
    setSewas(initialSewas);
    setUiMode('normal');
    localStorage.removeItem(STORAGE_KEY_MOTORS);
    localStorage.removeItem(STORAGE_KEY_PENYEWAS);
    localStorage.removeItem(STORAGE_KEY_SEWAS);
  };

  // Motor Operations
  const addMotor = async (motorData: Omit<Motor, 'id' | 'dibuat_pada'>) => {
    if (!motorData.merek_tipe.trim()) return { success: false, message: 'Merek dan tipe motor wajib diisi' };
    if (!motorData.plat_nomor.trim()) return { success: false, message: 'Plat nomor wajib diisi' };
    if (motorData.harga_per_hari < 0) return { success: false, message: 'Harga per hari tidak boleh negatif' };

    const newId = 'Mt' + Math.random().toString(36).substring(2, 7);
    const newMotor: Motor = {
      ...motorData,
      plat_nomor: motorData.plat_nomor.trim().toUpperCase(),
      id: newId,
      dibuat_pada: new Date().toISOString(),
    };
    setMotors((prev) => [newMotor, ...prev]);
    return { success: true };
  };

  const updateMotor = async (id: string, updateData: Partial<Omit<Motor, 'id' | 'dibuat_pada'>>) => {
    if (updateData.harga_per_hari !== undefined && updateData.harga_per_hari < 0) {
      return { success: false, message: 'Harga per hari tidak boleh negatif' };
    }
    setMotors((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              ...updateData,
              plat_nomor: updateData.plat_nomor ? updateData.plat_nomor.trim().toUpperCase() : m.plat_nomor,
            }
          : m
      )
    );
    return { success: true };
  };

  const deleteMotor = async (id: string) => {
    // Cek apakah motor sedang dipakai di sewa berjalan
    const hasActiveSewa = sewas.some((s) => s.motor_id === id && (s.status === 'berjalan' || s.status === 'dipesan'));
    if (hasActiveSewa) {
      return { success: false, message: 'Motor tidak dapat dihapus karena masih terkait transaksi aktif' };
    }
    setMotors((prev) => prev.filter((m) => m.id !== id));
    return { success: true };
  };

  // Penyewa Operations
  const addPenyewa = async (penyewaData: Omit<Penyewa, 'id' | 'dibuat_pada'>) => {
    const cleanNoWa = penyewaData.no_whatsapp.trim();
    if (!cleanNoWa.startsWith('08') || cleanNoWa.length < 10 || cleanNoWa.length > 13 || !/^\d+$/.test(cleanNoWa)) {
      return { success: false, message: 'Nomor WhatsApp harus diawali 08 dan terdiri dari 10-13 digit angka' };
    }
    if (!penyewaData.nama.trim()) return { success: false, message: 'Nama penyewa wajib diisi' };
    if (!penyewaData.asal_kota.trim()) return { success: false, message: 'Asal kota wajib diisi' };

    // Validasi: getDoc lalu setDoc -> Cek apakah no_whatsapp sudah ada
    const exists = penyewas.some((p) => p.no_whatsapp === cleanNoWa);
    if (exists) {
      return { success: false, message: 'Nomor WhatsApp sudah terdaftar' };
    }

    const newPenyewa: Penyewa = {
      ...penyewaData,
      id: cleanNoWa,
      no_whatsapp: cleanNoWa,
      dibuat_pada: new Date().toISOString(),
    };
    setPenyewas((prev) => [newPenyewa, ...prev]);
    return { success: true };
  };

  const updatePenyewa = async (id: string, updateData: Partial<Omit<Penyewa, 'id' | 'dibuat_pada'>>) => {
    setPenyewas((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updateData } : p))
    );
    return { success: true };
  };

  const deletePenyewa = async (id: string) => {
    const hasActiveSewa = sewas.some((s) => s.penyewa_id === id && (s.status === 'berjalan' || s.status === 'dipesan'));
    if (hasActiveSewa) {
      return { success: false, message: 'Penyewa tidak dapat dihapus karena masih memiliki sewa aktif' };
    }
    setPenyewas((prev) => prev.filter((p) => p.id !== id));
    return { success: true };
  };

  // Sewa Operations
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

    const total = motor.harga_per_hari * lama_hari;
    const newId = 'Sw' + Math.random().toString(36).substring(2, 7);

    const newSewa: Sewa = {
      id: newId,
      motor_id: motor.id,
      nama_motor: motor.merek_tipe,
      plat_nomor: motor.plat_nomor,
      penyewa_id: penyewa.id,
      nama_penyewa: penyewa.nama,
      harga_per_hari: motor.harga_per_hari,
      tanggal_mulai,
      lama_hari,
      total,
      status: 'dipesan',
      dibuat_pada: new Date().toISOString(),
    };

    setSewas((prev) => [newSewa, ...prev]);
    return { success: true };
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

    // Update status sewa
    setSewas((prev) =>
      prev.map((s) => (s.id === sewaId ? { ...s, status: nextStatus } : s))
    );

    // Otomasi Ketersediaan Motor (Skema Bagian 5 & PRD)
    if (nextStatus === 'berjalan') {
      // Motor sedang disewa -> tidak tersedia
      setMotors((prev) =>
        prev.map((m) => (m.id === sewa.motor_id ? { ...m, tersedia: false } : m))
      );
    } else if (nextStatus === 'selesai' || nextStatus === 'dibatalkan') {
      // Motor kembali / batal -> tersedia kembali
      setMotors((prev) =>
        prev.map((m) => (m.id === sewa.motor_id ? { ...m, tersedia: true } : m))
      );
    }

    return { success: true };
  };

  const deleteSewa = async (id: string) => {
    setSewas((prev) => prev.filter((s) => s.id !== id));
    return { success: true };
  };

  // Dasbor calculations
  const getDashboardStats = () => {
    const totalMotor = motors.length;
    const motorTersedia = motors.filter((m) => m.tersedia).length;
    const motorDisewa = motors.filter((m) => !m.tersedia).length;
    const ongoingRentals = sewas.filter((s) => s.status === 'berjalan');
    const sewaBerjalanCount = ongoingRentals.length;

    // Pendapatan dihitung dari sewa berstatus selesai yang dimulai pada tanggal terpilih (PRD 5.4)
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

  const isLoading = uiMode === 'loading' || isSimulatedLoading;
  const isError = uiMode === 'error';

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
