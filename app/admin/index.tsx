import { updateSubscriptionExpiry } from '@/api/auth/users';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { db } from '@/config/firebase';
import { DBcollections } from '@/constants/DBcollections';
import { Colors } from '@/constants/theme';
import { useAppUser } from '@/context/auth.context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import IUser from '@/interface/user.interface';
import dayjs from 'dayjs';
import { router } from 'expo-router';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';

export default function AdminScreen() {
    const { user, isAdminAuthenticated } = useAppUser();
    const colorScheme = useColorScheme() ?? 'light';
    const [users, setUsers] = useState<IUser[]>([]);
    const [loading, setLoading] = useState(true);

    const handleExtend = async (uid: string) => {
        try {
            await updateSubscriptionExpiry(uid, 30);
            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Subscription extended for 1 month.'
            });
        } catch (error) {
            Alert.alert('Error', 'Failed to extend subscription.');
        }
    };

    const isOnline = (lastActive: any) => {
        if (!lastActive) return false;
        const lastActiveTime = lastActive?.seconds ? lastActive.seconds * 1000 : lastActive;
        return Date.now() - lastActiveTime < 5 * 60 * 1000; // 5 minutes
    };

    React.useEffect(() => {
        if (!isAdminAuthenticated) router.replace('/admin/login');    ;

        const q = query(collection(db, DBcollections.USERS), orderBy('givenName', 'asc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const usersData: IUser[] = [];
            snapshot.forEach((doc) => {
                usersData.push({ id: doc.id, ...doc.data() } as IUser);
            });
            setUsers(usersData);
            setLoading(false);
        }, (error) => {
            console.error('Error fetching users:', error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [isAdminAuthenticated]);

    // Role check
    if (user?.role !== 'admin') {
        return (
            <View style={styles.container}>
                <Text style={[styles.title, { color: Colors[colorScheme].text }]}>Access Denied</Text>
                <Text style={{ color: Colors[colorScheme].text }}>You do not have permission to view this page.</Text>
            </View>
        );
    }

    // 2FA check (secondary, useEffect handles redirection)
    if (!isAdminAuthenticated) {
        return (
            <View style={[styles.container, { backgroundColor: Colors[colorScheme].background, justifyContent: 'center' }]}>
                <ActivityIndicator size="large" color={Colors[colorScheme].tint} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <IconSymbol name="chevron.left" size={24} color={Colors[colorScheme].text} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: Colors[colorScheme].text }]}>Admin Panel</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={[styles.subtitle, { color: Colors[colorScheme].text }]}>User Management ({users.length})</Text>

                {loading ? (
                    <ActivityIndicator size="small" color={Colors[colorScheme].tint} />
                ) : (
                    users.map((u) => (
                        <View key={u.id} style={styles.userCard}>
                            <View style={styles.userInfo}>
                                <View style={styles.nameRow}>
                                    <Text style={[styles.userName, { color: Colors[colorScheme].text }]}>
                                        {u.givenName || 'Unknown User'}
                                    </Text>
                                    {isOnline(u.lastActive) && (
                                        <View style={styles.onlineBadge} />
                                    )}
                                </View>
                                <Text style={[styles.userEmail, { color: Colors[colorScheme].text }]}>{u.email}</Text>
                                <Text style={[styles.userSub, { color: u.subscriptionExpires > Date.now() ? '#4CAF50' : '#F44336' }]}>
                                    Expires: {u.subscriptionExpires > 0 ? dayjs(u.subscriptionExpires).format('DD/MM/YYYY') : 'Never'}
                                </Text>
                            </View>
                            <TouchableOpacity
                                style={[styles.actionButton, { backgroundColor: Colors[colorScheme].tint }]}
                                onPress={() => handleExtend(u.id)}
                            >
                                <Text style={styles.actionButtonText}>+1 Month</Text>
                            </TouchableOpacity>
                        </View>
                    ))
                )}

                <Text style={[styles.subtitle, { color: Colors[colorScheme].text }]}>Online Admins</Text>
                <View style={styles.onlineAdminsList}>
                    {users.filter(u => u.role === 'admin' && isOnline(u.lastActive)).map(admin => (
                        <View key={admin.id} style={styles.onlineAdminItem}>
                            <View style={styles.onlineBadge} />
                            <Text style={{ color: Colors[colorScheme].text, marginLeft: 8 }}>{admin.givenName}</Text>
                        </View>
                    ))}
                    {users.filter(u => u.role === 'admin' && isOnline(u.lastActive)).length === 0 && (
                        <Text style={{ color: Colors[colorScheme].text, opacity: 0.5 }}>No other admins online</Text>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 60,
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    backButton: {
        marginRight: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 20,
        marginBottom: 10,
    },
    content: {
        paddingBottom: 40,
    },
    placeholder: {
        padding: 20,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        alignItems: 'center',
    },
    userCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    onlineBadge: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#4CAF50',
        marginLeft: 8,
    },
    userEmail: {
        fontSize: 12,
        opacity: 0.6,
        marginTop: 2,
    },
    userSub: {
        fontSize: 12,
        marginTop: 4,
        fontWeight: '500',
    },
    actionButton: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        marginLeft: 10,
    },
    actionButtonText: {
        color: '#000',
        fontSize: 12,
        fontWeight: 'bold',
    },
    onlineAdminsList: {
        padding: 16,
        borderRadius: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    onlineAdminItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    }

});
