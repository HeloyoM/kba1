import { db } from '@/config/firebase';
import { DBcollections } from '@/constants/DBcollections';
import IUser from '@/interface/user.interface';
import { collection, doc, DocumentData, getDoc, getDocs, query, QuerySnapshot, serverTimestamp, setDoc, where } from 'firebase/firestore';
import { handleError } from '../error-handler';

const usersRef = collection(db, DBcollections.USERS);

const getUsersList = async (): Promise<IUser[] | undefined> => {
    try {
        const querySnapshot = await getDocs(usersRef);

        const users: IUser[] = [];

        querySnapshot.forEach((doc) => {
            users.push({ id: doc.id, ...doc.data() } as IUser);
        })

        return users
    } catch (error) {
        handleError(error, 'Get Users Error');
    }
}

const getUserByEmailAdd = async (email: string): Promise<QuerySnapshot<DocumentData, DocumentData>> => {
    const emailAdd = email.trim().toLocaleLowerCase();

    const q = query(usersRef, where("email", "==", emailAdd));

    return await getDocs(q);
}

const insertUser = async (user: IUser): Promise<void> => {
    const docId = user.uid || user.id;
    await setDoc(doc(db, DBcollections.USERS, docId), user)
}

const updateUser = async (user: Partial<IUser>): Promise<void> => {
    if (!user.uid) throw new Error("User UID is required to update user");

    await setDoc(doc(db, DBcollections.USERS, user.uid), user, { merge: true });
}


const formatAssignedUser = async (user: { email: string; name?: string | null; familyName?: string | null }): Promise<IUser | undefined> => {
    const timeStamp = serverTimestamp();

    const querySnapshot = await getUserByEmailAdd(user.email);

    if (!querySnapshot.empty) {
        const userInfo = querySnapshot.docs[0].data();
        const firstName = user.name || userInfo.name || '';
        const lastName = user.familyName || userInfo.familyName || '';

        const formattedUser: IUser = {
            id: userInfo.id,
            createdAt: userInfo.createdAt,
            email: userInfo.email,
            name: userInfo.name,
            familyName: userInfo.familyName,
            givenName: `${firstName} ${lastName}`.trim(),
            uid: userInfo.uid,
            isPaying: userInfo.isPaying,
            last_login: timeStamp,
            phone: userInfo.phone,
            role: userInfo.role,
            photoUrl: userInfo.photoUrl,
            subscriptionExpires: userInfo.subscriptionExpires,
            birthday: userInfo.birthday || '',
            location: userInfo.location || '',
            lastActive: userInfo.lastActive || null,
            totpSecret: userInfo.totpSecret || '',
        };
        return formattedUser
    } else {
        return undefined
    }
}

const formatUser = (user: { id: string; email: string; name?: string | null; familyName?: string | null; photo?: string | null }, uid?: string): IUser => {
    const timeStamp = serverTimestamp();

    const formattedUser: IUser = {
        id: uid || user.id,
        createdAt: timeStamp,
        email: user.email,
        name: user.name || '',
        familyName: user.familyName || '',
        givenName: `${user.name || ''} ${user.familyName || ''}`.trim(),
        uid: uid,
        isPaying: false,
        last_login: timeStamp,
        phone: '',
        role: 'user',
        photoUrl: user.photo || null,
        subscriptionExpires: 0,
        birthday: '',
        location: '',
    };

    return formattedUser
}


const getUserById = async (id: string): Promise<IUser | undefined> => {
    try {
        const docSnap = await getDoc(doc(db, DBcollections.USERS, id));
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as IUser;
        }
    } catch (error) {
        handleError(error, 'Get User By ID Error');
    }
    return undefined;
}

const updateSubscriptionExpiry = async (uid: string, days: number): Promise<void> => {
    try {
        const user = await getUserById(uid);
        if (!user) throw new Error("User not found");

        const currentExpiry = user.subscriptionExpires > Date.now() ? user.subscriptionExpires : Date.now();
        const newExpiry = currentExpiry + (days * 24 * 60 * 60 * 1000);

        await updateUser({ uid, subscriptionExpires: newExpiry, isPaying: true });
    } catch (error) {
        handleError(error, 'Update Subscription Error');
    }
}

const updateLastActive = async (uid: string): Promise<void> => {
    try {
        await updateUser({ uid, lastActive: serverTimestamp() });
    } catch (error) {
        // Silent error for background activity
    }
}


export {
    formatAssignedUser,
    formatUser, getUserByEmailAdd, getUserById, getUsersList,
    insertUser, updateLastActive, updateSubscriptionExpiry, updateUser
};

