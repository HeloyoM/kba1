import { useColorScheme, Text, View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import ProfileHeader from "@/components/ProfileHeader";
import { PersonalInfoSection } from "@/components/PersonalInfoSection";
import { AccountSettingsSection } from "@/components/AccountSettingsSection";
import ActivityOverview from "@/components/ActivityOverview";
import SecuritySection from "@/components/SecuritySection";

const Profile = () => {
    const colorScheme = useColorScheme();

    const theme = colorScheme === 'dark' ? darkStyles : lightStyles;
    return (
        <View style={[styles.container, theme.container]}>
            {/* Header */}
            <View style={[styles.header, theme.header]}>
                <Text style={[styles.headerText, theme.headerText]}>My Profile</Text>
            </View>

            {/* Main content */}
            <ScrollView contentContainerStyle={styles.content}>
                <ProfileHeader />
                <PersonalInfoSection />
                <AccountSettingsSection />
                <ActivityOverview />
                <SecuritySection />
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