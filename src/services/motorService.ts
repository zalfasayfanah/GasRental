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
import { Motor } from '../types';

const COLLECTION_NAME = 'motor';

export const motorService = {
  // Read: getDocs(query(collection(db, "motor"), orderBy("merek_tipe"), limit(20)))
  async getMotors(): Promise<Motor[]> {
    const q = query(
      collection(db, COLLECTION_NAME),
      orderBy('merek_tipe'),
      limit(20)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        merek_tipe: data.merek_tipe,
        plat_nomor: data.plat_nomor,
        harga_per_hari: data.harga_per_hari,
        tersedia: data.tersedia,
        dibuat_pada: data.dibuat_pada?.toDate?.() ? data.dibuat_pada.toDate().toISOString() : new Date().toISOString(),
      };
    });
  },

  // Create: addDoc(collection(db, "motor"), {...})
  async addMotor(data: Omit<Motor, 'id' | 'dibuat_pada'>): Promise<{ id: string }> {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      merek_tipe: data.merek_tipe.trim(),
      plat_nomor: data.plat_nomor.trim().toUpperCase(),
      harga_per_hari: Number(data.harga_per_hari),
      tersedia: Boolean(data.tersedia),
      dibuat_pada: serverTimestamp(),
    });
    return { id: docRef.id };
  },

  // Update: updateDoc(doc(db, "motor", id), {...})
  async updateMotor(id: string, data: Partial<Omit<Motor, 'id' | 'dibuat_pada'>>): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    const updatePayload: Record<string, any> = {};
    if (data.merek_tipe !== undefined) updatePayload.merek_tipe = data.merek_tipe.trim();
    if (data.plat_nomor !== undefined) updatePayload.plat_nomor = data.plat_nomor.trim().toUpperCase();
    if (data.harga_per_hari !== undefined) updatePayload.harga_per_hari = Number(data.harga_per_hari);
    if (data.tersedia !== undefined) updatePayload.tersedia = Boolean(data.tersedia);

    await updateDoc(docRef, updatePayload);
  },

  // Delete: deleteDoc(doc(db, "motor", id))
  async deleteMotor(id: string): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  },
};
