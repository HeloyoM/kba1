import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/config/firebase';

export const isUserExist = async (email: string): Promise<boolean> => {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email.trim().toLocaleLowerCase()));
    const querySnapshot = await getDocs(q);

    return querySnapshot.empty;
}