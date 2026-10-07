# Gas Rental (Bagian A: Membangun UI dengan Data Contoh) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Membangun seluruh antarmuka (UI) web responsif mobile-first untuk aplikasi **Gas Rental** dengan data contoh (mock state), mencakup 4 modul (Dasbor, Motor, Penyewa, Sewa), alur perubahan status sewa, aksi CRUD lengkap dengan dialog konfirmasi, dan 3 feedback state (loading, empty, error dengan coba lagi).

**Architecture:** Menggunakan React + Vite + TypeScript dengan Tailwind CSS & komponen berbasis shadcn/radix-ui. Menggunakan Mock Repository / State Manager lokal yang merefleksikan struktur Firestore dan mensimulasikan latensi asynchronous, loading, error, serta CRUD lengkap.

**Tech Stack:** React, TypeScript, Vite, Tailwind CSS, Lucide React, Radix UI Primitives, Vitest / Testing Library.

**Spec:** [docs/superpowers/specs/2026-10-07-gas-rental-design.md](file:///d:/MaSelf/Bootcamp%20Plan%20Indo/GasRental/docs/superpowers/specs/2026-10-07-gas-rental-design.md)

---

## Global Constraints

- Sesuai dengan skema data Firestore di `docs/Skema-Firestore-Gas-Rental.md` dan PRD di `docs/PRD-Gas-Rental.md`.
- Nama koleksi dan field harus persis:
  - `motor`: `merek_tipe`, `plat_nomor`, `harga_per_hari`, `tersedia`, `dibuat_pada`
  - `penyewa`: `nama`, `no_whatsapp`, `asal_kota`, `jenis_jaminan`, `dibuat_pada`
  - `sewa`: `motor_id`, `nama_motor`, `plat_nomor`, `penyewa_id`, `nama_penyewa`, `harga_per_hari`, `tanggal_mulai`, `lama_hari`, `total`, `status`, `dibuat_pada`
- Alur status sewa: `dipesan` $\rightarrow$ `berjalan` | `dibatalkan`, `berjalan` $\rightarrow$ `selesai`.
- Setiap modul harus memiliki penanganan 3 state: Loading skeleton, Empty state (dengan tombol aksi), dan Error state (dengan tombol Coba Lagi).
- Format mata uang Rupiah (`Rp 80.000`), format tanggal `YYYY-MM-DD`.

## Review Focus

1. **Pilihan Motor pada Sewa Baru**: Hanya motor dengan status `tersedia: true` yang boleh muncul dan dapat dipilih saat membuat sewa baru.
2. **Kalkulasi Total Biaya Otomatis**: Total biaya harus otomatis terhitung `harga_per_hari * lama_hari` saat form sewa diisi.
3. **Penyewa No WhatsApp Unik**: Pendaftaran penyewa baru dengan nomor WhatsApp yang sudah ada harus ditolak ("Nomor WhatsApp sudah terdaftar").
4. **Otomasi Ketersediaan Motor**: Ketika sewa berubah status ke `berjalan`, motor terkait otomatis menjadi `tersedia: false`. Ketika sewa `selesai` atau `dibatalkan`, motor kembali `tersedia: true`.
5. **State Feedback**: Setiap halaman dapat dengan mudah disimulasikan / diverifikasi pada kondisi *loading*, *empty*, dan *error*.

---

## Rincian Task Eksekusi

### Task 1: Inisialisasi Proyek Vite, Tailwind CSS, & Konfigurasi Dasar

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `tailwind.config.js`, `postcss.config.js`, `index.html`, `src/index.css`, `src/main.tsx`, `src/App.tsx`, `.env.example`, `netlify.toml`

**Interfaces:**
- Produces: Lingkungan build Vite + React + TypeScript + Tailwind CSS siap pakai.

- [ ] **Step 1: Inisialisasi Vite + React + TypeScript project**
- [ ] **Step 2: Install dependencies (Tailwind CSS, clsx, tailwind-merge, lucide-react, radix-ui primitives)**
- [ ] **Step 3: Setup `tailwind.config.js` & `src/index.css` dengan design tokens warna, radius, dan font inter**
- [ ] **Step 4: Buat `.env.example` dan `netlify.toml`**
- [ ] **Step 5: Verifikasi build & dev server berjalan tanpa error (`npm run build`)**
- [ ] **Step 6: Commit:** `git commit -m "feat: initialize vite react ts project with tailwind css"`

---

### Task 2: Types, Mock Data Skema Firestore, & Mock Store Manager

**Files:**
- Create: `src/types/index.ts`, `src/lib/mockData.ts`, `src/lib/utils.ts`, `src/context/GasRentalContext.tsx`

**Interfaces:**
- Produces: `Motor`, `Penyewa`, `Sewa`, `RentStatus`, `JenisJaminan`, helper `formatRupiah`, `formatDate`, dan React Context / Hook `useGasRental()` untuk mengelola CRUD in-memory + simulasi delay & error states.

- [ ] **Step 1: Tulis interface TypeScript di `src/types/index.ts` sesuai Skema Firestore**
- [ ] **Step 2: Tulis data awal contoh di `src/lib/mockData.ts` (sesuai contoh dokumen PRD & Skema)**
- [ ] **Step 3: Implementasikan utility formatter di `src/lib/utils.ts` (`formatRupiah`, `formatDate`)**
- [ ] **Step 4: Implementasikan `GasRentalContext.tsx` dengan fungsi CRUD (add, update, delete, updateSewaStatus) dan state simulator (loading, error, empty, normal)**
- [ ] **Step 5: Commit:** `git commit -m "feat: add schema types, mock data, and state manager context"`

---

### Task 3: Komponen Layout & Feedback States (Loading, Empty, Error, Confirm)

**Files:**
- Create: `src/components/layout/Navbar.tsx`, `src/components/layout/BottomNav.tsx`, `src/components/layout/AppLayout.tsx`, `src/components/common/SkeletonLoader.tsx`, `src/components/common/EmptyState.tsx`, `src/components/common/ErrorState.tsx`, `src/components/common/ConfirmDialog.tsx`, `src/components/common/DevSimulatorBar.tsx`

**Interfaces:**
- Consumes: `useGasRental()`
- Produces: Komponen navigasi responsif & komponen standar feedback state yang dapat digunakan di semua modul.

- [ ] **Step 1: Buat komponen `SkeletonLoader.tsx` untuk kartu dan daftar**
- [ ] **Step 2: Buat komponen `EmptyState.tsx` dengan ikon, judul, deskripsi, dan tombol aksi**
- [ ] **Step 3: Buat komponen `ErrorState.tsx` dengan pesan informatif dan tombol "Coba Lagi"**
- [ ] **Step 4: Buat komponen `ConfirmDialog.tsx` modal konfirmasi aksi berbahaya (Hapus / Batal)**
- [ ] **Step 5: Buat `Navbar.tsx`, `BottomNav.tsx`, dan `AppLayout.tsx` dengan 4 menu utama: Dasbor, Motor, Penyewa, Sewa**
- [ ] **Step 6: Buat `DevSimulatorBar.tsx` (bar pengontrol simulasi state: normal/loading/error/empty)**
- [ ] **Step 7: Commit:** `git commit -m "feat: add layout, navigation, and reusable feedback state components"`

---

### Task 4: Modul Motor (Master 1) UI & CRUD

**Files:**
- Create: `src/features/motor/MotorPage.tsx`, `src/features/motor/MotorCard.tsx`, `src/features/motor/MotorFormDialog.tsx`

**Interfaces:**
- Consumes: `useGasRental()`, `Motor`, `ConfirmDialog`, `EmptyState`, `ErrorState`, `SkeletonLoader`
- Produces: Halaman manajemen motor lengkap dengan badge status ketersediaan, form tambah/edit, dan dialog konfirmasi hapus.

- [ ] **Step 1: Buat `MotorCard.tsx` dengan visual unit, plat nomor, harga sewa per hari, badge ketersediaan (Tersedia / Disewa), tombol Edit & Hapus**
- [ ] **Step 2: Buat `MotorFormDialog.tsx` dengan validasi: Merek & tipe (1-40 char), Plat nomor (3-12 char uppercase), Harga per hari ($\ge 0$), Toggle ketersediaan**
- [ ] **Step 3: Buat `MotorPage.tsx` yang menggabungkan daftar motor, integrasi 3 state, modal tambah/edit, dan dialog hapus**
- [ ] **Step 4: Verifikasi fungsionalitas CRUD motor dan visual feedback di browser**
- [ ] **Step 5: Commit:** `git commit -m "feat: implement motor master module with full CRUD and state handling"`

---

### Task 5: Modul Penyewa (Master 2) UI & CRUD

**Files:**
- Create: `src/features/penyewa/PenyewaPage.tsx`, `src/features/penyewa/PenyewaCard.tsx`, `src/features/penyewa/PenyewaFormDialog.tsx`, `src/features/penyewa/PenyewaSearch.tsx`

**Interfaces:**
- Consumes: `useGasRental()`, `Penyewa`, `ConfirmDialog`, `EmptyState`, `ErrorState`, `SkeletonLoader`
- Produces: Halaman manajemen penyewa dengan pencarian instan (nama / no WA), form tambah/edit dengan pencegahan No WA duplikat, dan dialog hapus.

- [ ] **Step 1: Buat `PenyewaSearch.tsx` untuk filter pencarian berdasarkan nama dan nomor WhatsApp**
- [ ] **Step 2: Buat `PenyewaCard.tsx` dengan nama penyewa, nomor WhatsApp, kota asal, dan badge jenis jaminan (KTP / SIM / Paspor)**
- [ ] **Step 3: Buat `PenyewaFormDialog.tsx` dengan validasi: Nama (1-60 char), No WhatsApp (`08...`, 10-13 digit), Kota (1-40 char), Select jenis jaminan (`KTP` | `SIM` | `Paspor`), dan pengecekan duplikasi No WhatsApp saat tambah baru**
- [ ] **Step 4: Buat `PenyewaPage.tsx` yang menyatukan pencarian, daftar, integrasi 3 state, tambah/edit, dan dialog hapus**
- [ ] **Step 5: Verifikasi fungsionalitas pencarian dan CRUD penyewa**
- [ ] **Step 6: Commit:** `git commit -m "feat: implement penyewa master module with search and CRUD"`

---

### Task 6: Modul Sewa (Transaksi) UI, Formulir & Alur Transisi Status

**Files:**
- Create: `src/features/sewa/SewaPage.tsx`, `src/features/sewa/SewaCard.tsx`, `src/features/sewa/SewaFormDialog.tsx`, `src/features/sewa/SewaStatusBadge.tsx`

**Interfaces:**
- Consumes: `useGasRental()`, `Sewa`, `Motor`, `Penyewa`, `ConfirmDialog`, `EmptyState`, `ErrorState`, `SkeletonLoader`
- Produces: Halaman transaksi sewa dengan tabs filter status, form sewa baru dengan kalkulasi total otomatis, dan tombol aksi transisi status (`dipesan` $\rightarrow$ `berjalan` $\rightarrow$ `selesai` / `dibatalkan`).

- [ ] **Step 1: Buat `SewaStatusBadge.tsx` dengan styling warna berbeda per status (`dipesan`, `berjalan`, `selesai`, `dibatalkan`)**
- [ ] **Step 2: Buat `SewaFormDialog.tsx`: dropdown pilih motor (hanya yang tersedia), dropdown pilih penyewa, pemilih tanggal mulai, input lama hari (1-30), preview otomatis total biaya**
- [ ] **Step 3: Buat `SewaCard.tsx` dengan rincian transaksi lengkap dan tombol aksi transisi:**
  - Jika `dipesan`: Tombol "Serahkan Motor" (ubah ke `berjalan`) dan "Batalkan" (ubah ke `dibatalkan` dengan konfirmasi)
  - Jika `berjalan`: Tombol "Selesaikan Sewa" (ubah ke `selesai` dengan konfirmasi)
- [ ] **Step 4: Buat `SewaPage.tsx` dengan filter Tabs (`Semua`, `Dipesan`, `Berjalan`, `Selesai`, `Dibatalkan`), integrasi 3 state, dan tombol Sewa Baru**
- [ ] **Step 5: Verifikasi otomasi ketersediaan motor saat status sewa berubah**
- [ ] **Step 6: Commit:** `git commit -m "feat: implement sewa transaction module with status transitions"`

---

### Task 7: Modul Dasbor Ringkasan & Filter Pendapatan

**Files:**
- Create: `src/features/dasbor/DasborPage.tsx`, `src/features/dasbor/StatCard.tsx`, `src/features/dasbor/RevenueSection.tsx`, `src/features/dasbor/OngoingRentalsSection.tsx`

**Interfaces:**
- Consumes: `useGasRental()`, `StatCard`, `SkeletonLoader`, `EmptyState`, `ErrorState`
- Produces: Halaman dasbor dengan ringkasan armada (tersedia vs disewa), daftar sewa yang sedang aktif berjalan, dan filter pendapatan harian dari transaksi selesai.

- [ ] **Step 1: Buat komponen `StatCard.tsx` dengan angka highlight, label, dan ikon relevan**
- [ ] **Step 2: Buat `OngoingRentalsSection.tsx` menampilkan daftar unit yang sedang disewa beserta kontak penyewa**
- [ ] **Step 3: Buat `RevenueSection.tsx` dengan input pemilih tanggal (`YYYY-MM-DD`) dan perhitungan total omzet dari sewa berstatus `selesai` pada tanggal tersebut**
- [ ] **Step 4: Buat `DasborPage.tsx` dengan integrasi 3 state (skeleton loading saat filter tanggal berubah)**
- [ ] **Step 5: Commit:** `git commit -m "feat: implement dashboard module with stats, ongoing rentals, and revenue calculation"`

---

### Task 8: Integrasi Keseluruhan, Polish Responsif, & Verifikasi Acceptance Criteria Bagian A

**Files:**
- Modify: `src/App.tsx`, `src/index.css`

- [ ] **Step 1: Satukan semua modul di `App.tsx` dengan navigasi aktif dan state manager**
- [ ] **Step 2: Uji coba responsivitas tampilan mobile (< 640px) dan desktop**
- [ ] **Step 3: Uji mandiri simulasi 3 state (Normal, Loading, Empty, Error dengan Retry)**
- [ ] **Step 4: Uji mandiri acceptance criteria:**
  - Tambah motor baru $\rightarrow$ muncul di daftar dan bisa dipilih di form sewa
  - Tambah penyewa $\rightarrow$ No WA duplikat ditolak
  - Buat sewa baru $\rightarrow$ total dihitung otomatis, motor jadi tersewa saat diserahkan
  - Selesaikan sewa $\rightarrow$ motor kembali tersedia, pendapatan dasbor terakumulasi
- [ ] **Step 5: Commit:** `git commit -m "feat: complete and verify Part A UI with mock data and feedback states"`
