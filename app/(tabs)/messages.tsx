import AdminMessageForm from '@/components/AdminMessageForm';
import MessageCard from '@/components/Messages/MessageCard';
import MessageDetail from '@/components/Messages/MessageDetail';
import { mockMessages } from '@/data/mock-messages';
import { IMessage } from '@/interface/message.interface';
import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Messages() {
    const [messages, setMessages] = useState(mockMessages);
    const [openForm, setOpenForm] = useState(false);
    const [filterUnread, setFilterUnread] = useState(false);
    const [displayCount, setDisplayCount] = useState(5);
    const [selectedMessage, setSelectedMessage] = useState<IMessage | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = () => { };

    const handleToggleRead = (id: string) => {
        setMessages((prev) =>
            prev.map((m) => (m.id === id ? { ...m, isRead: !m.isRead } : m))
        );
        if (selectedMessage?.id === id) {
            setSelectedMessage({ ...selectedMessage, isRead: !selectedMessage.isRead });
        }
    };

    const handleNewMessage = (newMsg: Partial<IMessage>) => {

    }

    const filtered = filterUnread
        ? messages.filter((m) => !m.isRead)
        : messages

    const unreadCount = messages.filter((m) => !m.isRead).length;
    const displayed = filtered.slice(0, displayCount);

    console.log({ openForm })
    return (
        <SafeAreaView style={[styles.container]} edges={['top']}>
            <View style={[styles.header]}>
                <View>
                    <Text style={[styles.headerTitle]}>Messages</Text>
                    <Text style={[styles.headerSubtitle]}>{unreadCount} unread message{unreadCount !== 1 ? 's' : ''}</Text>
                </View>


                <View style={styles.headerActions}>
                    <TouchableOpacity
                        onPress={() => setOpenForm(true)}
                        style={[styles.iconBtn, { backgroundColor: '#2563eb' }]}
                    >
                        <Feather name="plus" size={22} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>


            <View style={[styles.actionBar]}>
                <TouchableOpacity
                    onPress={handleRefresh}
                    style={styles.actionButton}
                >
                    <Feather
                        name="refresh-cw"
                        size={18}
                    />
                    <Text style={[styles.actionText]}>
                        Refresh
                    </Text>
                </TouchableOpacity>


                <TouchableOpacity
                    onPress={() => setFilterUnread(!filterUnread)}
                    style={[
                        styles.actionButton,
                        filterUnread && { backgroundColor: '#2563eb' },
                    ]}
                >
                    <Feather
                        name="filter"
                        size={18}
                    />

                    <Text style={[styles.actionText, filterUnread && { color: '#fff' },]}>
                        Unread
                    </Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={displayed}
                keyExtractor={(item) => item.id}
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                contentContainerStyle={{ padding: 16 }}
                renderItem={({ item }) => (
                    <MessageCard
                        message={item}
                        onPress={() => setSelectedMessage(item)}
                    />
                )}
                ListEmptyComponent={
                    <Text
                        style={[styles.emptyText]}
                    >
                        {filterUnread ? 'No unread messages' : 'No messages'}
                    </Text>
                }
                ListFooterComponent={
                    <TouchableOpacity
                        style={styles.loadMore}
                        onPress={() =>
                            setDisplayCount((prev) =>
                                Math.min(prev + 5, filtered.length)
                            )
                        }
                    >
                        <Text style={styles.loadMoreText}>Load More Messages</Text>
                    </TouchableOpacity>
                }
            />
            <Modal statusBarTranslucent visible={!!selectedMessage} animationType="slide">
                <MessageDetail
                    message={selectedMessage}
                    onClose={() => setSelectedMessage(null)}
                    onToggleRead={() => handleToggleRead(selectedMessage?.id!)}
                />
            </Modal>

            <Modal visible={openForm} animationType="slide">
                <AdminMessageForm
                    onClose={() => setOpenForm(false)}
                    onSubmit={handleNewMessage}
                    visible={openForm}
                />
            </Modal>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
    header: {
        padding: 16,
        backgroundColor: '#fff',
        borderBottomColor: '#ddd',
        borderBottomWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '600',
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#666',
    },
    headerActions: {
        flexDirection: 'row',
        gap: 10,
    },
    iconBtn: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: '#e5e7eb',
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionBar: {
        flexDirection: 'row',
        gap: 8,
        padding: 16,
    },
    actionButton: {
        flexDirection: 'row',
        gap: 6,
        paddingVertical: 8,
        paddingHorizontal: 14,
        backgroundColor: '#e5e7eb',
        borderRadius: 12,
        alignItems: 'center',
    },
    actionText: {
        fontSize: 14,
        color: '#444',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 40,
        color: '#666',
    },
    loadMore: {
        padding: 12,
        backgroundColor: '#fff',
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 12,
    },
    loadMoreText: {
        color: '#333',
    },
});
