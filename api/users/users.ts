import { db, auth } from '../../config/firebase';
import { GoogleAuthProvider, signInWithCredential, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { collection, getDoc, doc, getDocs, addDoc, serverTimestamp, query, where, setDoc, } from 'firebase/firestore';
import {
    GoogleSignin,
    statusCodes,
    isSuccessResponse,
    isErrorWithCode,
    SignInResponse,
    User
} from '@react-native-google-signin/google-signin';
import { isUserExist } from '../../api/auth/utiles';


const getUsersList = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "users"));
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.data());
        });

        return querySnapshot
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
            console.log(response.data.user.email)
            const idToken = response.data.idToken;

            const googleCredential = GoogleAuthProvider.credential(idToken);

            await signInWithCredential(auth, googleCredential);

            if (await isUserExist(response.data.user.email)) {
                await insertUser(response.data.user)
            }

            return response.data.user as unknown as User['user'];
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
        await GoogleSignin.configure({
            webClientId: "673592063163-crlnbboi32r854h4s4jullj2pqomedop.apps.googleusercontent.com",
            offlineAccess: true,
        });

        await GoogleSignin.signOut();
    } catch (error) {
        console.log({ error })
    }
}

const insertUser = async (user: User['user']): Promise<void> => {
    const timeStamp = serverTimestamp();

    const newUser = {
        id: user.id,
        createdAt: timeStamp,
        email: user.email,
        first_name: user.name,
        last_name: user.familyName,
        isPaying: false,
        last_login: timeStamp,
        phone: '',
        photoURL: user.photo,
        role: 'user',
        subscriptionExpires: new Date().getTime() + 1000000
    };
    await setDoc(doc(db, 'users', user.id), newUser)

    // await addDoc(collection(db, 'users'), newUser);
     
}

const siginWithEmailPasswrodMethod = (credentials: { email: string, password: string }) => {
    try {
        console.log('signing up...', credentials)
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
        console.log('signing up...', credentials)
        createUserWithEmailAndPassword(auth, credentials.email, credentials.password)
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
    logout,
    sigupWithEmailPasswrodMethod,
    siginWithEmailPasswrodMethod
} 