import { db } from '@/config/firebase';
import { DBcollections } from '@/constants/DBcollections';
import IUser from '@/interface/user.interface';
import { User } from '@react-native-google-signin/google-signin';
import { collection, doc, getDocs, query, where, serverTimestamp, setDoc } from 'firebase/firestore';

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

const formatAssignedUser = async (user: User['user']): Promise<IUser | undefined> => {
    const timeStamp = serverTimestamp();

    const q = query(collection(db, DBcollections.USERS), where("email", "==", user.email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        const userInfo = querySnapshot.docs[0].data();
        const formattedUser: IUser = {
            id: userInfo.id,
            createdAt: userInfo.createdAt,
            email: userInfo.email,
            name: userInfo.name,
            familyName: userInfo.familyName,
            givenName: `${user.name} ${user.familyName}`,
            uid: userInfo.uid,
            isPaying: userInfo.isPaying,
            last_login: timeStamp,
            phone: userInfo.phone,
            role: userInfo.role,
            photoUrl: userInfo.photoUrl,
            subscriptionExpires: userInfo.subscriptionExpires,
        };
        return formattedUser
    } else {
        return undefined
    }
}

const formatUser = (user: User['user'], uid?: string): IUser => {
    const timeStamp = serverTimestamp();

    const formattedUser: IUser = {
        id: user.id,
        createdAt: timeStamp,
        email: user.email,
        name: user.name,
        familyName: user.familyName,
        givenName: `${user.name} ${user.familyName}`,
        uid: uid,
        isPaying: false,
        last_login: timeStamp, // TODO: change this to current time
        phone: '', // TODO: change this to current phone
        role: 'user', // TODO: change this to current role
        photoUrl: user.photo, // TODO: change this to current photo
        subscriptionExpires: new Date().getTime() + 1000000, // TODO: change this to current subscription expires
    };

    return formattedUser
}


export {
    formatUser,
    formatAssignedUser,
    getUsersList,
    insertUser
};

