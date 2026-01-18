import { AccountSettingsSection } from "@/components/AccountSettingsSection";
import ActivityOverview from "@/components/ActivityOverview";
import { PersonalInfoSection } from "@/components/PersonalArea/PersonalInfoSection";
import ProfileHeader from "@/components/PersonalArea/ProfileHeader";
import SecuritySection from "@/components/SecuritySection";
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useAppUser } from "@/context/auth.context";
import { Redirect } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from "react-native";

const Profile = () => {
    const colorScheme = useColorScheme();
    const { logout, user } = useAppUser();

    if (user === null) {
        return <Redirect href="/auth" />;
    }

    const theme = colorScheme === 'dark' ? darkStyles : lightStyles;
    return (
        <View style={[styles.container, theme.container]}>

            <View style={[styles.header, theme.header]}>
                <Text style={[styles.headerText, theme.headerText]}>My Profile</Text>
            </View>


            <ScrollView contentContainerStyle={styles.content}>
                <ProfileHeader />
                {/* <PersonalInfoSection />
                <AccountSettingsSection />
                <ActivityOverview />
                <SecuritySection /> */}
                <TouchableOpacity style={styles.logoutButton} onPress={logout} activeOpacity={0.8}>
                    <IconSymbol color="#fff" size={20} name='door.french.open' />
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

export default Profile;


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    headerText: {
        fontSize: 20,
        fontWeight: '600',
    },
    toggleButton: {
        padding: 8,
        borderRadius: 10,
    },
    content: {
        paddingVertical: 20,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ff5c5c',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        marginHorizontal: 20,
        marginTop: 20,
        marginBottom: 20,
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },
    logoutText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
        marginLeft: 8,
    },
});

/* Light Theme */
const lightStyles = StyleSheet.create({
    container: {
        backgroundColor: '#f9fafb',
    },
    header: {
        backgroundColor: '#ffffff',
        borderBottomColor: '#e5e7eb',
    },
    headerText: {
        color: '#111827',
    },
    toggleButton: {
        backgroundColor: '#f3f4f6',
    },
    icon: {
        color: '#374151',
    },
});

/* Dark Theme */
const darkStyles = StyleSheet.create({
    container: {
        backgroundColor: '#111827',
    },
    header: {
        backgroundColor: '#1f2937',
        borderBottomColor: '#374151',
    },
    headerText: {
        color: '#ffffff',
    },
    toggleButton: {
        backgroundColor: '#374151',
    },
    icon: {
        color: '#d1d5db',
    },
});