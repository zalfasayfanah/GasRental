import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Sewa, RentStatus } from '../types';

const COLLECTION_NAME = 'sewa';

export const sewaService = {
  // Read: getDocs(query(collection(db, "sewa"), orderBy("dibuat_pada", "desc"), limit(20)))
  async getSewas(): Promise<Sewa[]> {
    const q = query(
      collection(db, COLLECTION_NAME),
      orderBy('dibuat_pada', 'desc'),
      limit(20)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        motor_id: data.motor_id,
        nama_motor: data.nama_motor,
        plat_nomor: data.plat_nomor,
        penyewa_id: data.penyewa_id,
        nama_penyewa: data.nama_penyewa,
        harga_per_hari: data.harga_per_hari,
        tanggal_mulai: data.tanggal_mulai,
        lama_hari: data.lama_hari,
        total: data.total,
        status: data.status as RentStatus,
        dibuat_pada: data.dibuat_pada?.toDate?.() ? data.dibuat_pada.toDate().toISOString() : new Date().toISOString(),
      };
    });
  },

  // Create: addDoc(collection(db, "sewa"), {...}) with snapshot fields
  async addSewa(data: {
    motor_id: string;
    nama_motor: string;
    plat_nomor: string;
    penyewa_id: string;
    nama_penyewa: string;
    harga_per_hari: number;
    tanggal_mulai: string;
    lama_hari: number;
  }): Promise<{ id: string }> {
    const total = data.harga_per_hari * data.lama_hari;

    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      motor_id: data.motor_id,
      nama_motor: data.nama_motor,
      plat_nomor: data.plat_nomor,
      penyewa_id: data.penyewa_id,
      nama_penyewa: data.nama_penyewa,
      harga_per_hari: Number(data.harga_per_hari),
      tanggal_mulai: data.tanggal_mulai,
      lama_hari: Number(data.lama_hari),
      total: Number(total),
      status: 'dipesan',
      dibuat_pada: serverTimestamp(),
    });

    return { id: docRef.id };
  },

  // Update Status & Sync Motor Availability (PRD 5.3 & Skema 5)
  async updateSewaStatus(
    sewaId: string,
    motorId: string,
    nextStatus: RentStatus
  ): Promise<void> {
    const sewaRef = doc(db, COLLECTION_NAME, sewaId);
    await updateDoc(sewaRef, { status: nextStatus });

    // Sync status ketersediaan motor
    const motorRef = doc(db, 'motor', motorId);
    if (nextStatus === 'berjalan') {
      await updateDoc(motorRef, { tersedia: false });
    } else if (nextStatus === 'selesai' || nextStatus === 'dibatalkan') {
      await updateDoc(motorRef, { tersedia: true });
    }
  },

  // Delete: deleteDoc(doc(db, "sewa", id))
  async deleteSewa(id: string): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  },
};
