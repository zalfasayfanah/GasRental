import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Penyewa } from '../types';

const COLLECTION_NAME = 'penyewa';

export const penyewaService = {
  // Read: getDocs(query(collection(db, "penyewa"), orderBy("nama"), limit(20)))
  async getPenyewas(): Promise<Penyewa[]> {
    const q = query(
      collection(db, COLLECTION_NAME),
      orderBy('nama'),
      limit(20)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        nama: data.nama,
        no_whatsapp: data.no_whatsapp,
        asal_kota: data.asal_kota,
        jenis_jaminan: data.jenis_jaminan,
        dibuat_pada: data.dibuat_pada?.toDate?.() ? data.dibuat_pada.toDate().toISOString() : new Date().toISOString(),
      };
    });
  },

  // Create: getDoc lalu setDoc(doc(db, "penyewa", noWhatsapp), {...})
  async addPenyewa(data: Omit<Penyewa, 'id' | 'dibuat_pada'>): Promise<{ id: string }> {
    const cleanNoWa = data.no_whatsapp.trim();
    const docRef = doc(db, COLLECTION_NAME, cleanNoWa);

    // Cek apakah nomor WhatsApp sudah terdaftar
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      throw new Error('Nomor WhatsApp sudah terdaftar');
    }

    await setDoc(docRef, {
      nama: data.nama.trim(),
      no_whatsapp: cleanNoWa,
      asal_kota: data.asal_kota.trim(),
      jenis_jaminan: data.jenis_jaminan,
      dibuat_pada: serverTimestamp(),
    });

    return { id: cleanNoWa };
  },

  // Update: updateDoc(doc(db, "penyewa", noWhatsapp), {...})
  async updatePenyewa(id: string, data: Partial<Omit<Penyewa, 'id' | 'dibuat_pada'>>): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    const updatePayload: Record<string, any> = {};
    if (data.nama !== undefined) updatePayload.nama = data.nama.trim();
    if (data.asal_kota !== undefined) updatePayload.asal_kota = data.asal_kota.trim();
    if (data.jenis_jaminan !== undefined) updatePayload.jenis_jaminan = data.jenis_jaminan;

    await updateDoc(docRef, updatePayload);
  },

  // Delete: deleteDoc(doc(db, "penyewa", noWhatsapp))
  async deletePenyewa(id: string): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  },
};
