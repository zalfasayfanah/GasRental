# Gas Rental (Rental Motor) 🛵

Aplikasi web manajemen rental motor harian responsif mobile-first untuk **Gas Rental** milik Bayu, dibangun dengan **React + TypeScript + Vite + Tailwind CSS + Cloud Firestore** dan siap di-deploy ke **Netlify**.

---

## 🚀 Fitur Utama

1. **Modul Motor (Master 1)**:
   - Manajemen unit motor, plat nomor, harga sewa per hari, dan status ketersediaan (*Tersedia* / *Disewa*).
   - CRUD penuh dengan modal formulir dan dialog konfirmasi hapus.
2. **Modul Penyewa (Master 2)**:
   - Pencarian instan berdasarkan nama / nomor WhatsApp.
   - Pendaftaran penyewa baru dengan ID Dokumen nomor WhatsApp (diawali `08...`, 10-13 digit).
   - Pilihan jenis jaminan identitas (*KTP*, *SIM*, *Paspor*).
3. **Modul Sewa (Transaksi)**:
   - Filter tab status (`Semua`, `Dipesan`, `Berjalan`, `Selesai`, `Dibatalkan`).
   - Formulir sewa baru otomatis memvalidasi motor tersedia & menghitung total biaya sewa (`harga_per_hari × lama_hari`).
   - Alur transisi status:
     - `dipesan` $\rightarrow$ `berjalan` (motor otomatis ditandai tidak tersedia).
     - `berjalan` $\rightarrow$ `selesai` (motor otomatis kembali tersedia).
     - `dipesan` $\rightarrow$ `dibatalkan` (motor tetap tersedia).
4. **Modul Dasbor**:
   - Kartu statistik armada: unit tersedia, unit disewa, dan transaksi sewa aktif.
   - Daftar cepat unit yang sedang berjalan beserta kontak WhatsApp penyewa.
   - Laporan omzet/pendapatan berdasarkan tanggal mulai untuk transaksi berstatus `selesai`.
5. **3 Feedback State UI**:
   - Loading skeleton saat memuat data.
   - Empty state informatif dengan tombol aksi penambahan data.
   - Error state dengan tombol *Coba Lagi* (*Retry*).

---

## 🛠️ Menjalankan Proyek Secara Lokal

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Setup Environment Variable**:
   Pastikan file `.env` sudah ada dan berisi konfigurasi Firebase:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

3. **Jalankan Development Server**:
   ```bash
   npm run dev
   ```

4. **Jalankan Pengujian (Testing)**:
   ```bash
   npm run test
   ```

5. **Build Produksi**:
   ```bash
   npm run build
   ```

---

## 🔒 Memasang Security Rules di Firebase Console

1. Buka [Firebase Console](https://console.firebase.google.com/).
2. Pilih project `Sesi1Bootcamp` $\rightarrow$ menu **Firestore Database** $\rightarrow$ tab **Rules**.
3. Salin seluruh isi dari berkas `firestore.rules` di repositori ini.
4. Tempelkan ke editor Rules di Firebase Console, lalu klik tombol **Publish**.

---

## 🌐 Cara Deploy ke Netlify

1. **Hubungkan GitHub Repo ke Netlify**:
   - Buka dashboard [Netlify](https://app.netlify.com/) dan pilih **Add new site** $\rightarrow$ **Import an existing project** $\rightarrow$ **GitHub**.
   - Pilih repositori `GasRental`.
2. **Build Settings**:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
3. **Environment Variables di Netlify**:
   - Tambahkan variabel `VITE_FIREBASE_*` (sesuai isi file `.env`) pada menu **Site configuration** $\rightarrow$ **Environment variables**.
4. **Deploy**:
   - Klik **Deploy site**. Aplikasi akan langsung terbit ke URL publik Netlify!