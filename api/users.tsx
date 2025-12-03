import { db, auth } from '@/config/firebase';
import { GoogleAuthProvider, signInWithCredential, signInWithRedirect } from "firebase/auth";
import { collection, getDoc, doc, getDocs } from 'firebase/firestore';
import {
    GoogleSignin,
    statusCodes,
    isSuccessResponse,
    isErrorWithCode,
    SignInResponse,
    User
} from '@react-native-google-signin/google-signin';

const provider = new GoogleAuthProvider();

const getUsersList = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "users"));
        // querySnapshot.forEach((doc) => {
        //     // doc.data() is never undefined for query doc snapshots
        //     console.log(doc.data());
        // });
    } catch (error) {
        console.log({ error })
    }
}


const login = async () => {
    try {
        await GoogleSignin.configure({
            webClientId: "673592063163-crlnbboi32r854h4s4jullj2pqomedop.apps.googleusercontent.com",
            offlineAccess: true,
        });
        const response: SignInResponse = await GoogleSignin.signIn();

        if (isSuccessResponse(response)) {
            const idToken = response.data.idToken;

            const googleCredential = GoogleAuthProvider.credential(idToken);

            await signInWithCredential(auth, googleCredential);

            return response.data.user as unknown as User['user'];
        }
    } catch (error) {
        console.log({ error })
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
        await GoogleSignin.configure({
            webClientId: "673592063163-crlnbboi32r854h4s4jullj2pqomedop.apps.googleusercontent.com",
            offlineAccess: true,
        });
        console.log('logging out...')
        await GoogleSignin.signOut();
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
    getUsersList,
    login,
    logout
} 