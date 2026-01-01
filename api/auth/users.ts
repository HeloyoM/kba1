import { DBcollections } from '@/constants/DBcollections';
import { collection, doc, getDocs, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import IUser from '@/interface/user.interface';
import { User } from '@react-native-google-signin/google-signin';

const getUsersList = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, DBcollections.USERS));
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.data());
        });

        return querySnapshot
    } catch (error) {
        console.log({ error })
    }
}

const insertUser = async (user: IUser): Promise<void> => {
    await setDoc(doc(db, DBcollections.USERS, user.id), user)
}

const formatUser = (user: User['user']): IUser => {
    const timeStamp = serverTimestamp();

    const formattedUser: IUser = {
        id: user.id,
        createdAt: timeStamp,
        email: user.email,
        name: user.name,
        familyName: user.familyName,
        givenName: `${user.name} ${user.familyName}`,
        isPaying: false,
        last_login: timeStamp,
        phone: '',
        photoUrl: user.photo,
        role: 'user',
        subscriptionExpires: new Date().getTime() + 1000000,
    };

    return formattedUser
}


export {
    getUsersList,
    insertUser,
    formatUser
}