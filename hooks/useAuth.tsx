import { useContext } from "react";
import { AppUserProvider } from "@/context/auth.context";
import { User } from "@react-native-google-signin/google-signin";
type Props = {
    user: User | null
    isLoading: boolean
}

export function useAuth() {
    return useContext(AppUserProvider);
}
