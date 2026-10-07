// Types conforming directly to docs/Skema-Firestore-Gas-Rental.md & docs/PRD-Gas-Rental.md

export type RentStatus = 'dipesan' | 'berjalan' | 'selesai' | 'dibatalkan';

export type JenisJaminan = 'KTP' | 'SIM' | 'Paspor';

export interface Motor {
  id: string;
  merek_tipe: string;      // 1 - 40 char
  plat_nomor: string;      // Uppercase, 3 - 12 char, e.g. "DK 1234 AB"
  harga_per_hari: number;  // Bulat >= 0
  tersedia: boolean;       // true = bisa disewa, false = sedang disewa / perawatan
  dibuat_pada: string;     // ISO String or formatted date
}

export interface Penyewa {
  id: string;              // Same as no_whatsapp
  nama: string;            // 1 - 60 char
  no_whatsapp: string;     // Diawali 08, 10 - 13 angka
  asal_kota: string;       // 1 - 40 char
  jenis_jaminan: JenisJaminan; // "KTP" | "SIM" | "Paspor"
  dibuat_pada: string;     // ISO String or formatted date
}

export interface Sewa {
  id: string;
  motor_id: string;        // ID dokumen motor
  nama_motor: string;      // Salinan merek_tipe saat sewa dibuat
  plat_nomor: string;      // Salinan plat_nomor saat sewa dibuat
  penyewa_id: string;      // ID dokumen penyewa (no_whatsapp)
  nama_penyewa: string;    // Salinan nama penyewa saat sewa dibuat
  harga_per_hari: number;  // Salinan harga motor saat sewa dibuat
  tanggal_mulai: string;   // Format YYYY-MM-DD
  lama_hari: number;       // 1 - 30 hari
  total: number;           // harga_per_hari * lama_hari
  status: RentStatus;      // dipesan | berjalan | selesai | dibatalkan
  dibuat_pada: string;     // ISO String or formatted date
}

export type UIStateMode = 'normal' | 'loading' | 'empty' | 'error';
export type ActiveTab = 'dasbor' | 'motor' | 'penyewa' | 'sewa';
