import { collection, getDoc, doc, getDocs, addDoc, serverTimestamp, query, where, } from 'firebase/firestore';
import { db } from '@/config/firebase';

export const isUserExist = async (email: string): Promise<boolean | undefined> => {
    try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("email", "==", email));
        const querySnapshot = await getDocs(q);

        return querySnapshot.empty;
    } catch (error) {
        console.log(error)
    }
}