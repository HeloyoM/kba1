import { auth } from '@/config/firebase';
import IUser from '@/interface/user.interface';
import {
    GoogleSignin,
    isErrorWithCode,
    isSuccessResponse,
    SignInResponse,
    statusCodes,
} from '@react-native-google-signin/google-signin';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithCredential, signInWithEmailAndPassword } from "firebase/auth";
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

            return formatAssignedUser(response.data.user);
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


const siginWithEmailPasswrodMethod = (credentials: { email: string, password: string }) => {
    try {
        signInWithEmailAndPassword(auth, credentials.email, credentials.password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                return user;
            })
            .catch((error) => {
                console.log({ error })
                const errorCode = error.code;
                const errorMessage = error.message;
            });
    } catch (error) {
        console.log({ error })
    }
}

const sigupWithEmailPasswrodMethod = (credentials: { email: string, password: string }) => {
    try {
        createUserWithEmailAndPassword(auth, credentials.email, credentials.password)
            .then((userCredential) => {
                const user = userCredential.user;
                return user;
            })
            .catch((error) => {
                console.log({ error })
                const errorCode = error.code;
                const errorMessage = error.message;
            });
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
    login,
    logout, siginWithEmailPasswrodMethod, sigupWithEmailPasswrodMethod
};

