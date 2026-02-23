import { getUsersList } from '@/api/auth/users';
import { MemberCard } from '@/components/Community/MemberCard';
import { useAppUser } from '@/context/auth.context';
import IUser from '@/interface/user.interface';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Dimensions, FlatList, Modal, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function Community() {
    const [users, setUsers] = useState<IUser[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [modalOpened, setModalOpened] = useState<boolean>(false);

    const slideAnimation = useRef(new Animated.Value(200)).current;

    const { user } = useAppUser();
    const router = useRouter();
    useEffect(() => {
        if (user?.isGuest) {
            setModalOpened(true);
        }
    }, [user]);

    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        try {
            const usersList = await getUsersList();
            if (usersList) {
                setUsers(usersList.filter((u: IUser) => !u.isGuest));
            }
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchUsers();
    };

    const filteredUsers = users.filter((user) => {
        const query = searchQuery.toLowerCase();
        return (
            (user.givenName?.toLowerCase().includes(query) ?? false) ||
            (user.name?.toLowerCase().includes(query) ?? false) ||
            (user.email.toLowerCase().includes(query) ?? false) ||
            (user.role.toLowerCase().includes(query) ?? false)
        );
    });

    const onClose = () => {
        router.back();
    };

    if (user?.isGuest) {

        return (
            <Modal
                statusBarTranslucent
                visible
                transparent
                animationType="fade"
                onRequestClose={onClose}
            >
                <View style={styles.modalOverlay}>
                    <TouchableOpacity
                        style={styles.backdrop}
                        activeOpacity={1}
                        onPress={onClose}
                    />
                    <Animated.View
                        style={[
                            styles.modalContent,
                            // {
                            //     opacity: slideAnimation.interpolate({
                            //         inputRange: [0, 200],
                            //         outputRange: [1, 0],
                            //     }),
                            //     transform: [{ translateY: slideAnimation }],
                            // },
                        ]}
                    >
                        <View style={styles.iconContainer}>
                            <Feather name="lock" size={40} color="#2563EB" />
                        </View>

                        <Text style={styles.modalTitle}>Access Restricted</Text>
                        <Text style={styles.modalDescription}>
                            Guests are not allowed to view community members. Please sign in to connect with others.
                        </Text>

                        <TouchableOpacity
                            onPress={onClose}
                            style={styles.modalPrimaryBtn}
                        >
                            <Text style={styles.modalPrimaryBtnText}>Close</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            </Modal>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Community Members</Text>
                <View style={styles.searchContainer}>
                    <Feather name="search" size={20} color="#9ca3af" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search members..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholderTextColor="#9ca3af"
                    />
                </View>
            </View>

            {isLoading ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color="#a855f7" />
                </View>
            ) : (
                <FlatList
                    data={filteredUsers}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <MemberCard member={item} />}
                    contentContainerStyle={styles.listContent}
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No members found</Text>
                        </View>
                    }
                />
            )}
        </SafeAreaView>
    );
}

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
    header: {
        padding: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f1f1f1',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#111',
        marginBottom: 16,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f3f4f6',
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 48,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#111',
    },
    listContent: {
        padding: 16,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 40,
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    modalContent: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 32,
        alignItems: 'center',
        // shadowColor: "#000",
        // shadowOffset: {
        //     width: 0,
        //     height: 10,
        // },
        // shadowOpacity: 0.1,
        // shadowRadius: 20,
        // elevation: 15,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 12,
        textAlign: 'center',
    },
    modalDescription: {
        fontSize: 16,
        color: '#4B5563',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 32,
    },
    modalPrimaryBtn: {
        backgroundColor: "#2563EB",
        borderRadius: 14,
        paddingVertical: 14,
        paddingHorizontal: 32,
        width: '100%',
        alignItems: 'center',
    },
    modalPrimaryBtnText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
});
