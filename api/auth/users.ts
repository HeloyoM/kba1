import { db } from '@/config/firebase';
import { DBcollections } from '@/constants/DBcollections';
import IUser from '@/interface/user.interface';
import { collection, doc, getDocs, query, serverTimestamp, setDoc, where } from 'firebase/firestore';

const getUsersList = async (): Promise<IUser[] | undefined> => {
    try {
        const querySnapshot = await getDocs(collection(db, DBcollections.USERS));

        const users: IUser[] = [];

        querySnapshot.forEach((doc) => {
            users.push({ id: doc.id, ...doc.data() } as IUser);
        })

        return users
    } catch (error) {
        console.log({ error })
    }
}

const insertUser = async (user: IUser): Promise<void> => {
    await setDoc(doc(db, DBcollections.USERS, user.id), user)
}

const updateUser = async (user: Partial<IUser>): Promise<void> => {
    if (!user.uid) throw new Error("User UID is required to update user");

    await setDoc(doc(db, DBcollections.USERS, user.uid), user, { merge: true });
}


const formatAssignedUser = async (user: { email: string; name?: string | null; familyName?: string | null }): Promise<IUser | undefined> => {
    const timeStamp = serverTimestamp();

    const q = query(collection(db, DBcollections.USERS), where("email", "==", user.email));
    const querySnapshot = await getDocs(q);

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
        };
        return formattedUser
    } else {
        return undefined
    }
}

const formatUser = (user: { id: string; email: string; name?: string | null; familyName?: string | null; photo?: string | null }, uid?: string): IUser => {
    const timeStamp = serverTimestamp();

    const formattedUser: IUser = {
        id: user.id,
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
        subscriptionExpires: new Date().getTime() + 1000000,
        birthday: '',
        location: '',
    };
    console.log({ formattedUser })
    return formattedUser
}


export {
    formatAssignedUser, formatUser, getUsersList,
    insertUser,
    updateUser
};

