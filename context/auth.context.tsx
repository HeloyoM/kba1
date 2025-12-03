// // ctx.tsx
import { User } from '@react-native-google-signin/google-signin';
import { useState, createContext, useContext } from 'react';

interface AppUserContextProps {
    user: User['user'] | null;
    setUser: (user: User['user']) => void;
}

const AuthContext = createContext<AppUserContextProps | undefined>(undefined);

const AppUserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User['user'] | null>(null);

    const updateCurrentUser = (userData: User['user']) => {
        setUser(userData);
    };

    const defaultValue = {
        user,
        setUser: updateCurrentUser,
    };

    return (
        <AuthContext.Provider value={defaultValue}>
            {children}
        </AuthContext.Provider>
    )
}

const useAppUser = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAppUser must be used within an AppUserProvider');
    }
    return context;
};

export { AppUserProvider, useAppUser };
// type UserProps = User | null

// const AuthContext = createContext({ user: {} as UserProps, isLoading: false });

// export const AppUserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//     const [user, setUser] = useState<User | null>({} as UserProps);
//     const [authLoading, setAuthLoading] = useState<boolean>(false);

//     // const signOut = () => {
//     //     setUser(null)
//     // }

//     const contextValue = {
//         user,
//         isLoading: authLoading
//     }

//     return (
//         <AuthContext.Provider value={contextValue}>
//             {children}
//         </AuthContext.Provider>
//     );
// }

// // export function useSession() {
// //     const value = useContext(AuthContext);
// //     if (!value) {
// //         throw new Error('useSession must be wrapped in a <SessionProvider />');
// //     }
// //     return value;
// // }

// // export function SessionProvider({ children }: PropsWithChildren) {
// //     const [[isLoading, session], setSession, user] = useStorageState('session');

// //     return (
// //         <AuthContext.Provider
// //             value={{
// //                 signIn: () => setSession('xxx'),
// //                 signOut: () => setSession(null),
// //                 session,
// //                 isLoading,
// //                 user
// //             }}>
// //             {children}
// //         </AuthContext.Provider>
// //     );
// // }


