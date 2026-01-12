import { auth } from '@/config/firebase';
import IUser from '@/interface/user.interface';
import {
    GoogleSignin,
    isErrorWithCode,
    isSuccessResponse,
    SignInResponse,
    statusCodes
} from '@react-native-google-signin/google-signin';
import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithCredential,
    signInWithEmailAndPassword,
    User
} from "firebase/auth";
import { formatAssignedUser, formatUser, insertUser } from './users';
import { userNotAssignedYet } from './utiles';

const login = async (): Promise<IUser | undefined> => {
    try {
        const response: SignInResponse = await GoogleSignin.signIn();

        if (isSuccessResponse(response)) {

            const idToken = response.data.idToken;
            const googleCredential = GoogleAuthProvider.credential(idToken);

            await signInWithCredential(auth, googleCredential);

            const user = formatUser(response.data.user)
            if (await userNotAssignedYet(user.email)) {
                await insertUser(user);
            }

            return await formatAssignedUser(response.data.user);
        }

    } catch (error) {
        if (isErrorWithCode(error)) {
            switch (error.code) {
                case statusCodes.IN_PROGRESS:
                    // operation (eg. sign in) already in progress
                    break;
                case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
                    // Android only, play services not available or outdated
                    break;
                default:
                // some other error happened
            }
        }
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


    } catch (error) {
        console.log({ error })
    }
}

const createWithEmailPasswrodMethod = async (credentials: { email: string, password: string }): Promise<IUser | undefined> => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, credentials.email, credentials.password);

        const result: User = userCredential.user;

        const user = formatUser({ id: result.uid, email: credentials.email }, result.uid)

        if (await userNotAssignedYet(credentials.email)) {
            await insertUser(user);
        }
        console.log({ user })
        return user;
    } catch (error) {
        console.log({ error })
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

export {
    createWithEmailPasswrodMethod,
    login,
    logout,
    siginWithEmailPasswrodMethod
};

