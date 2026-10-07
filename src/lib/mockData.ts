import { Motor, Penyewa, Sewa } from '../types';

export const initialMotors: Motor[] = [
  {
    id: 'Mt45bRw',
    merek_tipe: 'Honda Vario 125',
    plat_nomor: 'DK 1234 AB',
    harga_per_hari: 80000,
    tersedia: true,
    dibuat_pada: '2026-10-01T08:00:00Z',
  },
  {
    id: 'Mt78kLp',
    merek_tipe: 'Yamaha NMAX 155',
    plat_nomor: 'DK 5678 CD',
    harga_per_hari: 120000,
    tersedia: false, // Sedang disewa
    dibuat_pada: '2026-10-01T08:15:00Z',
  },
  {
    id: 'Mt92xYq',
    merek_tipe: 'Honda Beat Street',
    plat_nomor: 'DK 9988 EF',
    harga_per_hari: 65000,
    tersedia: true,
    dibuat_pada: '2026-10-01T08:30:00Z',
  },
  {
    id: 'Mt33zKx',
    merek_tipe: 'Honda Scoopy Prestige',
    plat_nomor: 'DK 4455 GH',
    harga_per_hari: 75000,
    tersedia: true,
    dibuat_pada: '2026-10-01T08:45:00Z',
  },
];

export const initialPenyewas: Penyewa[] = [
  {
    id: '085712345678',
    nama: 'Putri Lestari',
    no_whatsapp: '085712345678',
    asal_kota: 'Surabaya',
    jenis_jaminan: 'KTP',
    dibuat_pada: '2026-10-01T08:20:00Z',
  },
  {
    id: '081298765432',
    nama: 'Budi Santoso',
    no_whatsapp: '081298765432',
    asal_kota: 'Jakarta',
    jenis_jaminan: 'SIM',
    dibuat_pada: '2026-10-01T08:40:00Z',
  },
  {
    id: '081377889900',
    nama: 'Michael Johnson',
    no_whatsapp: '081377889900',
    asal_kota: 'Melbourne',
    jenis_jaminan: 'Paspor',
    dibuat_pada: '2026-10-01T09:00:00Z',
  },
];

export const initialSewas: Sewa[] = [
  {
    id: 'Sw19cTn',
    motor_id: 'Mt45bRw',
    nama_motor: 'Honda Vario 125',
    plat_nomor: 'DK 1234 AB',
    penyewa_id: '085712345678',
    nama_penyewa: 'Putri Lestari',
    harga_per_hari: 80000,
    tanggal_mulai: '2026-10-07',
    lama_hari: 3,
    total: 240000,
    status: 'dipesan',
    dibuat_pada: '2026-10-01T09:00:00Z',
  },
  {
    id: 'Sw88pLm',
    motor_id: 'Mt78kLp',
    nama_motor: 'Yamaha NMAX 155',
    plat_nomor: 'DK 5678 CD',
    penyewa_id: '081298765432',
    nama_penyewa: 'Budi Santoso',
    harga_per_hari: 120000,
    tanggal_mulai: '2026-10-07',
    lama_hari: 2,
    total: 240000,
    status: 'berjalan',
    dibuat_pada: '2026-10-02T10:00:00Z',
  },
  {
    id: 'Sw44qRt',
    motor_id: 'Mt92xYq',
    nama_motor: 'Honda Beat Street',
    plat_nomor: 'DK 9988 EF',
    penyewa_id: '081377889900',
    nama_penyewa: 'Michael Johnson',
    harga_per_hari: 65000,
    tanggal_mulai: '2026-10-07',
    lama_hari: 1,
    total: 65000,
    status: 'selesai',
    dibuat_pada: '2026-10-03T11:00:00Z',
  },
];
