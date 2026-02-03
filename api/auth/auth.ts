import { auth } from '@/config/firebase';
import IUser from '@/interface/user.interface';
import {
    GoogleSignin,
    isSuccessResponse,
    SignInResponse
} from '@react-native-google-signin/google-signin';
import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInAnonymously,
    signInWithCredential,
    signInWithEmailAndPassword,
    User
} from "firebase/auth";
import { handleError } from '../error-handler';
import { formatAssignedUser, formatUser, insertUser } from './users';
import { userDoesntExist } from './utiles';

const login = async (): Promise<IUser | undefined> => {
    try {
        const response: SignInResponse = await GoogleSignin.signIn();

        if (isSuccessResponse(response)) {

            const idToken = response.data.idToken;
            const googleCredential = GoogleAuthProvider.credential(idToken);

            await signInWithCredential(auth, googleCredential);

            const user = formatUser(response.data.user)
            if (await userDoesntExist(user.email)) {
                await insertUser(user);
            }

            return await formatAssignedUser(response.data.user);
        }

    } catch (error) {
        handleError(error, 'Login Error');
    }
}

const logout = async () => {
    try {
        await GoogleSignin.signOut();
    } catch (error) {
        console.log({ error })
    }
}

const siginWithEmailPasswrodMethod = async (credentials: { email: string, password: string }): Promise<IUser | undefined> => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, credentials.email, credentials.password)
        const result: User = userCredential.user;

        if (result) {
            return await formatAssignedUser({ email: credentials.email });
        }
    } catch (error: any) {
        console.log({ error })
        throw error;
    }
}

const createWithEmailPasswrodMethod = async (credentials: { email: string, password: string }) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, credentials.email, credentials.password);

        const result: User = userCredential.user;

        const user = formatUser({ id: result.uid, email: credentials.email }, result.uid)

        if (await userDoesntExist(credentials.email)) {
            await insertUser(user);
        }

        return user;
    } catch (error: any) {
        console.log({ error })
        throw error;
    }
}

const resetPassword = () => {
    try {

    } catch (error) {
        console.log({ error })
    }
}

const verifyEmail = () => {
    try {

    } catch (error) {
        console.log({ error })
    }
}

const signInAnonymouslyMethod = async (): Promise<IUser | undefined> => {
    try {
        const userCredential = await signInAnonymously(auth);
        const result: User = userCredential.user;

        const user = formatUser({
            id: result.uid,
            email: 'guest@community.com',
            name: 'Guest',
            familyName: 'User'
        }, result.uid);

        if (await userDoesntExist(user.email)) {
            await insertUser(user);
        }

        return user;
    } catch (error) {
        handleError(error, 'Guest Login Error');
    }
}

export {
    createWithEmailPasswrodMethod,
    login,
    logout,
    siginWithEmailPasswrodMethod,
    signInAnonymouslyMethod
};

