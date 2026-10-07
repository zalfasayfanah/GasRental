# Design Specification: Gas Rental Web Application

## 1. Ringkasan Eksekutif & Tujuan
Aplikasi web responsif mobile-first untuk **Gas Rental (Rental Motor)** milik Bayu. Aplikasi ini mempermudah pencatatan unit motor, penyewa, transaksi sewa, ketersediaan unit secara real-time, serta pelaporan pendapatan harian.

Pengerjaan dibagi menjadi 2 fase besar:
- **Bagian A (Fokus Tahap Ini)**: Pembangunan UI lengkap dengan Mock Data State (CRUD master motor, penyewa, transaksi sewa, alur perubahan status sewa, dasbor statistik, serta 3 status state UI: loading, empty state, dan error state dengan retry).
- **Bagian B (Tahap Berikutnya)**: Integrasi Cloud Firestore (Firebase Modular SDK), Form Validation & Firestore Security Rules (`firestore.rules`), serta Konfigurasi Deploy Netlify.

---

## 2. Tech Stack & Arsitektur

- **Framework**: React 18 / 19 + Vite + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui (radix-ui primitives, Lucide React icons)
- **State Management (Bagian A)**: React State / Context / Hook-based repository mock yang mensimulasikan delay asynchronous, loading state, error state, dan manipulasi data lokal (in-memory / localStorage fallback).
- **Routing & Navigasi**: Mobile Bottom Navigation Bar & Top Header Navigation mencakup 4 modul:
  1. `Dasbor`
  2. `Motor` (Master 1)
  3. `Penyewa` (Master 2)
  4. `Sewa` (Transaksi & Status)

---

## 3. Struktur Data & Urutan Pengerjaan Koleksi

Mengikuti **Skema Firestore Gas Rental** & **PRD Bagian 5**:

### 1. Koleksi `motor` (Master Unit)
- `merek_tipe` (string, 1-40 char)
- `plat_nomor` (string, 3-12 char, huruf kapital, misal `DK 1234 AB`)
- `harga_per_hari` (number bulat $\ge 0$)
- `tersedia` (boolean: true = tersedia, false = disewa/perawatan)
- `dibuat_pada` (timestamp / ISO date string)

### 2. Koleksi `penyewa` (Master Orang)
- `nama` (string, 1-60 char)
- `no_whatsapp` (string, diawali 08, 10-13 digit, juga bertindak sebagai Doc ID)
- `asal_kota` (string, 1-40 char)
- `jenis_jaminan` (enum string: `KTP` | `SIM` | `Paspor`)
- `dibuat_pada` (timestamp / ISO date string)

### 3. Koleksi `sewa` (Transaksi)
- `motor_id` (string)
- `nama_motor` (string, snapshot `merek_tipe`)
- `plat_nomor` (string, snapshot `plat_nomor`)
- `penyewa_id` (string, `no_whatsapp`)
- `nama_penyewa` (string, snapshot `nama`)
- `harga_per_hari` (number bulat, snapshot harga saat sewa dibuat)
- `tanggal_mulai` (string `YYYY-MM-DD`)
- `lama_hari` (number bulat 1-30)
- `total` (number bulat: `harga_per_hari * lama_hari`)
- `status` (enum: `dipesan` | `berjalan` | `selesai` | `dibatalkan`)
- `dibuat_pada` (timestamp / ISO date string)

### Aturan Transisi Status Sewa:
- `dipesan` $\rightarrow$ `berjalan` (motor otomatis jadi `tersedia: false`) atau `dibatalkan` (motor tetap `tersedia: true`).
- `berjalan` $\rightarrow$ `selesai` (motor otomatis kembali `tersedia: true`).
- Status tidak boleh melompat atau mundur (misal dari `dipesan` langsung `selesai` dilarang).

---

## 4. Rincian Tampilan UI per Modul (Bagian A)

### A. Modul Motor
- **Daftar Motor**: Menampilkan kartu unit (Merek & Tipe, Plat Nomor, Harga/hari formatted Rupiah, Badge status `Tersedia` / `Disewa`).
- **Formulir Motor (Dialog / Sheet)**: Input Merek & Tipe, Plat Nomor (auto-uppercase), Harga per hari, Toggle ketersediaan awal.
- **Aksi Ubah & Hapus**: Edit modal dan Confirm Dialog saat menghapus.

### B. Modul Penyewa
- **Pencarian**: Filter real-time berdasarkan nama atau no WhatsApp.
- **Daftar Penyewa**: Menampilkan nama, No WhatsApp (klik untuk chat WA opsional), Asal Kota, Badge Jenis Jaminan (KTP / SIM / Paspor).
- **Formulir Penyewa**: Input Nama, No WhatsApp (validasi format `08...`), Asal Kota, Select Jenis Jaminan.
- **Aksi Ubah & Hapus**: Dialog konfirmasi sebelum menghapus.

### C. Modul Sewa (Transaksi)
- **Filter Tabs**: `Semua`, `Dipesan`, `Berjalan`, `Selesai`, `Dibatalkan`.
- **Formulir Sewa Baru**:
  - Select Motor (hanya motor yang `tersedia: true` yang dapat dipilih).
  - Select Penyewa (pilih dari daftar penyewa terdaftar).
  - Date picker Tanggal Mulai (`YYYY-MM-DD`).
  - Input Lama Hari (1 - 30 hari).
  - Preview Otomatis Total Biaya (`harga_per_hari * lama_hari`).
- **Kartu Sewa**: Snapshot detail motor & penyewa, tanggal mulai, lama hari, total harga, badge status.
- **Aksi Transisi Status**:
  - Jika `dipesan`: Tombol "Serahkan Motor" ($\rightarrow$ `berjalan`) dan "Batalkan Sewa" ($\rightarrow$ `dibatalkan` dengan konfirmasi).
  - Jika `berjalan`: Tombol "Kembalikan Motor" ($\rightarrow$ `selesai` dengan konfirmasi).

### D. Modul Dasbor
- **Stat Cards**:
  - Total Motor Tersedia
  - Total Motor Sedang Disewa
  - Total Sewa Berjalan
- **Daftar Sewa Berjalan**: Daftar cepat unit yang sedang dibawa penyewa beserta kontak penyewa.
- **Filter Pendapatan**: Date picker untuk memilih tanggal, menampilkan total omzet dari sewa berstatus `selesai` yang dimulai pada tanggal tersebut.

---

## 5. Tiga State Antarmuka (Feedback States)
Setiap modul mengimplementasikan 3 state UI yang konsisten:
1. **Loading State**: Skeleton cards & pulse animations saat memuat data.
2. **Empty State**: Ilustrasi/ikon informatif + teks penjelasan (misal: "Belum ada motor yang terdaftar") + Tombol Aksi Primer ("Tambah Motor").
3. **Error State**: Banner/Card peringatan galat yang ramah pengguna + Tombol "Coba Lagi" (*Retry action*).
*(Disediakan toggle / simulation control di development bar/mock store untuk dengan mudah menguji kondisi Loading, Empty, dan Error).*

---

## 6. Template Environment & Deploy Readiness
- Menyiapkan `.env.example` dengan placeholder variabel Firebase:
  ```env
  VITE_FIREBASE_API_KEY=
  VITE_FIREBASE_AUTH_DOMAIN=
  VITE_FIREBASE_PROJECT_ID=
  VITE_FIREBASE_STORAGE_BUCKET=
  VITE_FIREBASE_MESSAGING_SENDER_ID=
  VITE_FIREBASE_APP_ID=
  ```
- Menyiapkan `netlify.toml` untuk rewrite client-side routing.
