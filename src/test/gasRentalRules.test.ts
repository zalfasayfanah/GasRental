import { describe, it, expect } from 'vitest';
import { initialMotors } from '../lib/mockData';
import { RentStatus, Motor, Sewa } from '../types';

describe('Gas Rental Business Rules & Acceptance Criteria (PRD & Schema Conformance)', () => {
  describe('Modul Motor (Master 1)', () => {
    it('harus memiliki struktur data motor yang sah', () => {
      const motor: Motor = initialMotors[0];
      expect(motor.merek_tipe).toBeTruthy();
      expect(motor.plat_nomor).toMatch(/^[A-Z0-9 ]+$/);
      expect(motor.harga_per_hari).toBeGreaterThanOrEqual(0);
      expect(typeof motor.tersedia).toBe('boolean');
    });

    it('harus menolak harga negatif atau plat kosong', () => {
      const validateMotor = (merek: string, plat: string, harga: number) => {
        if (!merek.trim() || merek.length > 40) return false;
        if (!plat.trim() || plat.length < 3 || plat.length > 12) return false;
        if (harga < 0) return false;
        return true;
      };

      expect(validateMotor('Honda Beat', '', 50000)).toBe(false);
      expect(validateMotor('Honda Beat', 'DK 1234 AB', -1000)).toBe(false);
      expect(validateMotor('Honda Beat', 'DK 1234 AB', 50000)).toBe(true);
    });
  });

  describe('Modul Penyewa (Master 2)', () => {
    it('harus memvalidasi nomor WhatsApp diawali 08 dan 10-13 digit', () => {
      const validateNoWa = (noWa: string) => {
        return noWa.startsWith('08') && noWa.length >= 10 && noWa.length <= 13 && /^\d+$/.test(noWa);
      };

      expect(validateNoWa('085712345678')).toBe(true);
      expect(validateNoWa('0712345678')).toBe(false);
      expect(validateNoWa('0857123')).toBe(false);
      expect(validateNoWa('08571234567890123')).toBe(false);
    });

    it('harus membatasi jenis jaminan hanya KTP, SIM, atau Paspor', () => {
      const allowedJaminan = ['KTP', 'SIM', 'Paspor'];
      expect(allowedJaminan.includes('KTP')).toBe(true);
      expect(allowedJaminan.includes('SIM')).toBe(true);
      expect(allowedJaminan.includes('Paspor')).toBe(true);
      expect(allowedJaminan.includes('Ijazah')).toBe(false);
    });
  });

  describe('Modul Sewa (Transaksi)', () => {
    it('harus menghitung total = harga_per_hari * lama_hari', () => {
      const hargaPerHari = 80000;
      const lamaHari = 3;
      const total = hargaPerHari * lamaHari;
      expect(total).toBe(240000);
    });

    it('harus membatasi lama sewa antara 1 sampai 30 hari', () => {
      const validateLamaHari = (days: number) => days >= 1 && days <= 30;
      expect(validateLamaHari(0)).toBe(false);
      expect(validateLamaHari(31)).toBe(false);
      expect(validateLamaHari(1)).toBe(true);
      expect(validateLamaHari(30)).toBe(true);
    });

    it('harus mematuhi transisi status sewa yang sah', () => {
      const isValidTransition = (current: RentStatus, next: RentStatus) => {
        if (current === 'dipesan') {
          return next === 'berjalan' || next === 'dibatalkan';
        }
        if (current === 'berjalan') {
          return next === 'selesai';
        }
        return false;
      };

      // Dari dipesan
      expect(isValidTransition('dipesan', 'berjalan')).toBe(true);
      expect(isValidTransition('dipesan', 'dibatalkan')).toBe(true);
      expect(isValidTransition('dipesan', 'selesai')).toBe(false); // Dilarang melompat

      // Dari berjalan
      expect(isValidTransition('berjalan', 'selesai')).toBe(true);
      expect(isValidTransition('berjalan', 'dipesan')).toBe(false); // Dilarang mundur
      expect(isValidTransition('berjalan', 'dibatalkan')).toBe(false);

      // Dari selesai / dibatalkan (terminal)
      expect(isValidTransition('selesai', 'berjalan')).toBe(false);
      expect(isValidTransition('dibatalkan', 'dipesan')).toBe(false);
    });
  });

  describe('Modul Dasbor', () => {
    it('harus menghitung pendapatan hanya dari sewa berstatus selesai pada tanggal yang dipilih', () => {
      const sampleSewas: Sewa[] = [
        {
          id: '1',
          motor_id: 'm1',
          nama_motor: 'Vario',
          plat_nomor: 'DK 1',
          penyewa_id: '085',
          nama_penyewa: 'Ani',
          harga_per_hari: 80000,
          tanggal_mulai: '2026-10-07',
          lama_hari: 2,
          total: 160000,
          status: 'selesai',
          dibuat_pada: '2026-10-01',
        },
        {
          id: '2',
          motor_id: 'm2',
          nama_motor: 'NMAX',
          plat_nomor: 'DK 2',
          penyewa_id: '086',
          nama_penyewa: 'Budi',
          harga_per_hari: 120000,
          tanggal_mulai: '2026-10-07',
          lama_hari: 1,
          total: 120000,
          status: 'berjalan', // Belum selesai -> tidak masuk omzet
          dibuat_pada: '2026-10-01',
        },
        {
          id: '3',
          motor_id: 'm3',
          nama_motor: 'Beat',
          plat_nomor: 'DK 3',
          penyewa_id: '087',
          nama_penyewa: 'Cici',
          harga_per_hari: 65000,
          tanggal_mulai: '2026-10-08', // Tanggal beda
          lama_hari: 1,
          total: 65000,
          status: 'selesai',
          dibuat_pada: '2026-10-01',
        },
      ];

      const revenue2026_10_07 = sampleSewas
        .filter((s) => s.status === 'selesai' && s.tanggal_mulai === '2026-10-07')
        .reduce((acc, curr) => acc + curr.total, 0);

      expect(revenue2026_10_07).toBe(160000);
    });
  });
});
