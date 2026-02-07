import { serverTimestamp } from 'firebase/firestore';
import { getUserByEmailAdd, updateUser } from './users';

const userDoesntExist = async (email: string): Promise<boolean> => {
    const user = await getUserByEmailAdd(email);

    return user.empty; /** True if there are no documents in the `QuerySnapshot`. */
}

const updateLastLogin = async (uid: string) => {
    try {
        const lastLogin = serverTimestamp();

        await updateUser({ uid: uid, last_login: lastLogin });
    } catch (error) {
        
    }
}

export {
    userDoesntExist,
    updateLastLogin
}
