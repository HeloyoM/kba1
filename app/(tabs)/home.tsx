
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { logout } from '@/api/auth/auth';
import Menu from '@/components/Menu/Menu';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useAppUser } from '@/context/auth.context';
import { colors } from '@/utils/colors';
import { CircularProgress } from '@expo/ui/jetpack-compose';
import { Redirect } from 'expo-router';

export default function Home() {
    const { user, loading } = useAppUser();

    if (user === null) {
        return <Redirect href="/auth" />;
    }

    if (loading) return (
        <CircularProgress
            progress={0.5}
            style={{ width: 300 }}
            color="blue"
            elementColors={{ trackColor: '#cccccc' }}
        />
    )

    return (
        <SafeAreaView style={styles.safe}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text style={styles.greeting}>Hello, {user.givenName} 👋</Text>
                    <Text style={styles.subtitle}>Here's what's happening today</Text>

                    <TouchableOpacity style={styles.logoutButton} onPress={logout} activeOpacity={0.8}>
                        <IconSymbol color="#fff" size={20} name='door.french.open' />
                        <Text style={styles.logoutText}>Logout</Text>
                    </TouchableOpacity>
                </View>


                <View style={styles.cardsContainer}>
                    <Menu />
                    <Text>Hello Meir</Text>
                </View>


                <View style={styles.quickActions}>
                    <Text style={styles.sectionTitle}>Quick Actions</Text>
                    <View style={styles.actionsRow}>
                        <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.blue }]}>
                            <Text style={styles.actionText}>Create Event</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.pink }]}>
                            <Text style={styles.actionText}>Join Group</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    header: {
        paddingVertical: 32,
        paddingHorizontal: 24,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        marginBottom: 24,
    },
    greeting: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#f0f0f0',
    },
    cardsContainer: {
        paddingHorizontal: 16,
    },
    cardWrapper: {
        marginBottom: 16,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 4 },
        elevation: 6,
    },
    quickActions: {
        marginTop: 24,
        paddingHorizontal: 16,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 12,
    },
    actionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    actionButton: {
        flex: 1,
        paddingVertical: 16,
        borderRadius: 16,
        marginHorizontal: 4,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
        elevation: 5,
    },
    actionText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ff5c5c',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 3 },
        elevation: 5,
    },
    logoutText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});