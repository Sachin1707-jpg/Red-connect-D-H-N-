import { collection, getDocs, addDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

export const campService = {
  getCamps: async () => {
    try {
      const snap = await getDocs(collection(db, 'camps'));
      if (snap.empty) return [];
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    } catch (err) {
      console.error('[campService] Error fetching camps:', err);
      return [];
    }
  },

  createCamp: async (campData) => {
    try {
      const newCamp = {
        ...campData,
        registered: campData.registered || 0,
        createdAt: serverTimestamp(),
      };
      const docRef = await addDoc(collection(db, 'camps'), newCamp);
      return { id: docRef.id, ...newCamp };
    } catch (err) {
      console.error('[campService] Error creating camp:', err);
      return { id: `c_${Date.now()}`, ...campData };
    }
  },

  getVolunteers: async () => {
    try {
      const snap = await getDocs(collection(db, 'volunteers'));
      if (snap.empty) return [];
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    } catch (err) {
      console.error('[campService] Error fetching volunteers:', err);
      return [];
    }
  },

  assignVolunteer: async (id, role) => {
    try {
      const ref = doc(db, 'volunteers', id);
      await updateDoc(ref, { role, status: 'Assigned' });
      return { id, role, status: 'Assigned' };
    } catch (err) {
      console.error('[campService] Error assigning volunteer:', err);
      return { id, role, status: 'Assigned' };
    }
  },
};
