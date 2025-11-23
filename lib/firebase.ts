import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  query,
  orderBy,
  getDoc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

// Database operations

interface Guest {
  id: string;
  name: string;
  qrData: string;
  qrUrl: string;
  checkedInAt: boolean;
  createdAt: string;
  ticketId: string;
}

export const addGuest = async (guestData: Guest) => {
  try {
    const docRef = await addDoc(collection(db, "guests"), guestData);
    return {
      id: docRef.id,
      name: guestData.name,
      qrData: guestData.qrData,
      qrUrl: guestData.qrUrl,
      checkedInAt: guestData.checkedInAt,
      createdAt: guestData.createdAt,
      ticketId: guestData.ticketId,
    };
  } catch (error) {
    console.error("Error adding guest:", error);
    throw error;
  }
};

export const getAllGuests = async () => {
  try {
    const q = query(collection(db, "guests"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name || "",
      qrData: doc.data().qrData || "",
      qrUrl: doc.data().qrUrl || "",
      checkedIn: doc.data().checkedInAt || false,
      createdAt: doc.data().createdAt || new Date().toISOString(),
      ticketId: doc.data().ticketId || doc.id,
    }));
  } catch (error) {
    console.error("Error getting guests:", error);
    throw error;
  }
};

export const checkInGuest = async (guestId: string) => {
  try {
    const guestRef = doc(db, "guests", guestId);
    const guestSnap = await getDoc(guestRef);

    if (!guestSnap.exists()) {
      throw new Error("Guest not found");
    }

    const guestData = guestSnap.data();

    if (guestData.checkedIn) {
      return {
        error: "Already checked in",
        name: guestData.name,
        ticketId: guestData.ticketId,
        qrData: guestData.qrData,
        qrUrl: guestData.qrUrl,
        checkedInAt: guestData.checkedInAt,
        createdAt: guestData.createdAt,
      };
    }

    await updateDoc(guestRef, {
      checkedIn: true,
      checkedInAt: new Date().toISOString(),
    });

    return {
      id: guestId,
      ...guestData,
      checkedIn: true,
      checkedInAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error checking in guest:", error);
    throw error;
  }
};

export const getGuestByTicketId = async (ticketId: string) => {
  try {
    const querySnapshot = await getDocs(collection(db, "guests"));
    const guest = querySnapshot.docs.find(
      (doc) => doc.data().ticketId === ticketId
    );

    if (!guest) {
      throw new Error("Guest not found");
    }

    return { id: guest.id, ...guest.data() };
  } catch (error) {
    console.error("Error getting guest:", error);
    throw error;
  }
};

export { db };
