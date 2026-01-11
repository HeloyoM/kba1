import { db } from '@/config/firebase';
import { DBcollections } from '@/constants/DBcollections';
import { collection, getDocs, query, where } from 'firebase/firestore';

const usersRef = collection(db, DBcollections.USERS);

const getUserByEmail = (email: string): Promise<any> => {
    const emailAdd = email.trim().toLocaleLowerCase();
    
    const q = query(usersRef, where("email", "==", emailAdd));

    return getDocs(q);
}

const userNotAssignedYet = async (email: string): Promise<boolean> => {
    const user = await getUserByEmail(email);

    return user.empty;
}


export {
    userNotAssignedYet,
    getUserByEmail
}
