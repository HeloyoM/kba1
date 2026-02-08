import { logout as apiLogout } from '@/api/auth/auth';
import { updateLastActive } from '@/api/auth/users';
import IUser from '@/interface/user.interface';
import { createContext, useContext, useEffect, useState } from 'react';

interface AppUserContextProps {
    user: IUser | null;
    setUser: (user: IUser) => void;
    loading: boolean;
    setLoading: (val: boolean) => void;
    isAdminAuthenticated: boolean;
    setAdminAuthenticated: (val: boolean) => void;
    logout: () => void;
}


const AuthContext = createContext<AppUserContextProps | undefined>(undefined);

const AppUserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<IUser | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);

    useEffect(() => {
        if (!user?.uid) return;

        // Update once on load
        updateLastActive(user.uid);

        // Then update every 2 minutes
        const interval = setInterval(() => {
            updateLastActive(user.uid!);
        }, 2 * 60 * 1000);

        return () => clearInterval(interval);
    }, [user?.uid]);

    const updateCurrentUser = (userData: IUser) => {
        setUser(userData);
    }

    const logout = async () => {
        await apiLogout();
        setUser(null);
        setIsAdminAuthenticated(false);
    }

    const defaultValue = {
        user,
        setUser: updateCurrentUser,
        loading,
        setLoading,
        isAdminAuthenticated,
        setAdminAuthenticated: setIsAdminAuthenticated,
        logout
    }


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

