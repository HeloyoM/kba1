import { db } from '@/config/firebase';
import { DBcollections } from '@/constants/DBcollections';
import IUser from '@/interface/user.interface';
import { User } from '@react-native-google-signin/google-signin';
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
    if (!user.id) throw new Error("User ID is required to update user");

    await setDoc(doc(db, DBcollections.USERS, user.uid!), user, { merge: true });
}


const formatAssignedUser = async (user: User['user']): Promise<IUser | undefined> => {
    const timeStamp = serverTimestamp();

    const q = query(collection(db, DBcollections.USERS), where("email", "==", user.email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        const userInfo = querySnapshot.docs[0].data();
        console.log({ userInfo })
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
            birthday: userInfo.birthday || '',
            location: userInfo.location || '',
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
        last_login: timeStamp,
        phone: '',
        role: 'user',
        photoUrl: user.photo,
        subscriptionExpires: new Date().getTime() + 1000000,
        birthday: '',
        location: '',
    };

    return formattedUser
}


export {
    formatAssignedUser, formatUser, getUsersList,
    insertUser,
    updateUser
};

