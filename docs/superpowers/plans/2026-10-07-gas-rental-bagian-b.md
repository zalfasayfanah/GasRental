# Gas Rental (Bagian B: Menghubungkan Data dan Menayangkan) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Menghubungkan antarmuka Gas Rental dengan Cloud Firestore asli (Firebase Modular SDK), menyusun aturan keamanan & validasi basis data (`firestore.rules`), serta memastikan kesiapan penayangan publik ke Netlify.

**Architecture:** Menggunakan Firebase JavaScript SDK v10/v11 (modular: `addDoc`, `setDoc`, `getDoc`, `getDocs`, `updateDoc`, `deleteDoc`, `serverTimestamp`, `query`, `where`, `orderBy`, `limit`). Konfigurasi kredensial disimpan aman dalam environment variable `.env`. Aturan data dijaga oleh formulir di sisi klien dan `firestore.rules` di sisi server Firestore.

**Tech Stack:** React, TypeScript, Vite, Firebase JS SDK (Modular Firestore), Firestore Security Rules, Netlify CLI / Platform.

**Spec:** [docs/superpowers/specs/2026-10-07-gas-rental-design.md](file:///d:/MaSelf/Bootcamp%20Plan%20Indo/GasRental/docs/superpowers/specs/2026-10-07-gas-rental-design.md)

---

## Global Constraints

- Sesuai dengan skema data Firestore di `docs/Skema-Firestore-Gas-Rental.md` dan PRD Bagian 8.
- Nama koleksi dan field harus persis:
  - `motor`: `merek_tipe`, `plat_nomor`, `harga_per_hari`, `tersedia`, `dibuat_pada` (serverTimestamp).
  - `penyewa`: `nama`, `no_whatsapp` (sebagai Document ID), `asal_kota`, `jenis_jaminan`, `dibuat_pada` (serverTimestamp).
  - `sewa`: `motor_id`, `nama_motor`, `plat_nomor`, `penyewa_id`, `nama_penyewa`, `harga_per_hari`, `tanggal_mulai`, `lama_hari`, `total`, `status`, `dibuat_pada` (serverTimestamp).
- Kredensial Firebase tidak boleh di-commit secara hardcoded ke repositori publik (gunakan `.env`).
- Query pembacaan daftar dibatasi dengan `limit` dan diurutkan sesuai ketentuan PRD.

## Review Focus

1. **Penyewa Doc ID**: `penyewa` harus menggunakan nomor WhatsApp sebagai Doc ID (`setDoc(doc(db, "penyewa", no_whatsapp))`) dan mengecek keberadaan dokumen dengan `getDoc` sebelum simpan.
2. **Snapshot Transaksi Sewa**: Saat sewa baru dibuat, `nama_motor`, `plat_nomor`, `nama_penyewa`, dan `harga_per_hari` harus disalin ke dokumen `sewa` agar transaksi masa lalu tidak berubah jika master diedit.
3. **Otomasi Ketersediaan Motor**: Perubahan status sewa ke `berjalan` mengupdate motor menjadi `tersedia: false`. Perubahan ke `selesai` atau `dibatalkan` mengupdate motor menjadi `tersedia: true`.
4. **Keamanan Data**: `firestore.rules` wajib menolak field kosong, harga negatif, durasi di luar 1-30 hari, dan transisi status sewa yang tidak sah.
5. **Netlify Routing**: Rewrite rule di `netlify.toml` memastikan refresh halaman di URL mana pun tidak menghasilkan error 404.

---

## Rincian Task Eksekusi

### Task 1: Pemasangan Firebase SDK & Konfigurasi Lingkungan (`.env` & `firebase.ts`)

**Files:**
- Create: `.env`, `src/lib/firebase.ts`
- Modify: `package.json`

**Interfaces:**
- Produces: Inisialisasi instance `db` (Firestore) dan `app` (FirebaseApp) siap pakai.

- [ ] **Step 1: Install dependency `firebase` menggunakan npm**
- [ ] **Step 2: Buat file `.env` berisi `VITE_FIREBASE_*` dari `firebaseConfig` pengguna**
- [ ] **Step 3: Buat `src/lib/firebase.ts` untuk menginisialisasi Firebase App dan Cloud Firestore (`getFirestore`)**
- [ ] **Step 4: Verifikasi build & koneksi instance Firebase**
- [ ] **Step 5: Commit:** `git commit -m "feat: install firebase sdk and setup firestore initialization"`

---

### Task 2: Pembuatan Service Layer Firestore Modular (`motor`, `penyewa`, `sewa`)

**Files:**
- Create: `src/services/motorService.ts`, `src/services/penyewaService.ts`, `src/services/sewaService.ts`

**Interfaces:**
- Consumes: `db` dari `src/lib/firebase.ts`, types dari `src/types/index.ts`
- Produces: Fungsi async modular CRUD untuk masing-masing koleksi Firestore (`getMotors`, `addMotor`, `updateMotor`, `deleteMotor`, `getPenyewas`, `addPenyewa`, `getSewas`, `addSewa`, `updateSewaStatus`, `deleteSewa`).

- [ ] **Step 1: Implementasikan `src/services/motorService.ts` (`addDoc`, `getDocs`, `updateDoc`, `deleteDoc`, `orderBy("merek_tipe")`, `limit(20)`)**
- [ ] **Step 2: Implementasikan `src/services/penyewaService.ts` (`getDoc` untuk cek duplikat nomor WA, `setDoc` dengan doc ID no_whatsapp, `getDocs`, `updateDoc`, `deleteDoc`)**
- [ ] **Step 3: Implementasikan `src/services/sewaService.ts` (`addDoc` dengan snapshot field & `serverTimestamp()`, `getDocs` orderBy `dibuat_pada desc`, `updateDoc` untuk status sewa sekaligus sinkronisasi status `tersedia` pada dokumen `motor`)**
- [ ] **Step 4: Commit:** `git commit -m "feat: implement modular firestore services for motor, penyewa, and sewa"`

---

### Task 3: Integrasi State Context dengan Cloud Firestore Asli

**Files:**
- Modify: `src/context/GasRentalContext.tsx`

**Interfaces:**
- Consumes: `motorService`, `penyewaService`, `sewaService`
- Produces: Aplikasi membaca dan menulis data langsung ke Cloud Firestore dengan penanganan loading nyata, error handling, dan query dasbor Firestore.

- [ ] **Step 1: Hubungkan `useEffect` pemanggilan data awal dari Firestore saat aplikasi dibuka**
- [ ] **Step 2: Hubungkan operasi tambah, edit, hapus Motor ke Firestore**
- [ ] **Step 3: Hubungkan operasi tambah, edit, hapus Penyewa ke Firestore**
- [ ] **Step 4: Hubungkan operasi tambah sewa & perubahan status sewa ke Firestore**
- [ ] **Step 5: Hubungkan kalkulasi dasbor (motor tersedia/disewa, sewa berjalan, omzet selesai) dengan query Firestore**
- [ ] **Step 6: Commit:** `git commit -m "feat: connect app state context to live cloud firestore"`

---

### Task 4: Pembuatan Aturan Keamanan Firestore (`firestore.rules`)

**Files:**
- Create: `firestore.rules`

**Interfaces:**
- Produces: Berkas keamanan Firestore yang menegakkan aturan validasi schema, tipe data, dan alur status transaksi di level basis data.

- [ ] **Step 1: Tulis aturan untuk koleksi `motor` (validasi merek_tipe <= 40 char, plat_nomor 3-12 char, harga_per_hari >= 0, tersedia boolean)**
- [ ] **Step 2: Tulis aturan untuk koleksi `penyewa` (nama & asal_kota terisi, ID dokumen sama dengan no_whatsapp dan diawali 08, jenis_jaminan hanya KTP/SIM/Paspor)**
- [ ] **Step 3: Tulis aturan untuk koleksi `sewa` (lama_hari 1-30, harga & total sesuai rumus, status awal dipesan, alur transisi status sewa)**
- [ ] **Step 4: Siapkan panduan deploy rules ke Firebase Console / Firebase CLI**
- [ ] **Step 5: Commit:** `git commit -m "feat: add comprehensive firestore security rules"`

---

### Task 5: Pengujian Menyeluruh, Verifikasi Build & Kesiapan Deploy Netlify

**Files:**
- Create/Modify: `netlify.toml`, `README.md`

- [ ] **Step 1: Jalankan unit test (`npm run test`) untuk memastikan aturan data tetap valid**
- [ ] **Step 2: Jalankan build produksi (`npm run build`) dan pastikan tidak ada error TypeScript atau Vite**
- [ ] **Step 3: Verifikasi konfigurasi `netlify.toml` untuk rewrite SPA**
- [ ] **Step 4: Susun panduan langkah deploy ke Netlify di `README.md`**
- [ ] **Step 5: Commit:** `git commit -m "chore: finalize build verification and netlify deployment configuration"`
