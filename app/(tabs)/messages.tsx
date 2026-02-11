import { addMessage, getMessagesList, updateMessage, updateMessagesStatus } from '@/api/messages/message';
import AdminMessageForm from '@/components/AdminMessageForm';
import MessageCard from '@/components/Messages/MessageCard';
import MessageDetail from '@/components/Messages/MessageDetail';
import { useDemo } from '@/context/demo.context';
import { IMessage } from '@/interface/message.interface';
import { Feather } from '@expo/vector-icons';
import React, { useCallback, useEffect, useState } from 'react';
import { Dimensions, FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function Messages() {
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [openForm, setOpenForm] = useState(false);
    const [filterUnread, setFilterUnread] = useState(false);
    const [displayCount, setDisplayCount] = useState(5);
    const [selectedMessage, setSelectedMessage] = useState<IMessage | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const isSelectionMode = selectedIds.size > 0;
    const { registerLayout } = useDemo();

    const fetchMessages = useCallback(async () => {
        setIsRefreshing(true);
        try {
            const data = await getMessagesList();
            setMessages(data);
        } finally {
            setIsRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchMessages();
    }, [fetchMessages]);

    const handleRefresh = () => {
        fetchMessages();
    };

    const handleToggleRead = async (id: string, currentStatus?: boolean) => {
        const newStatus = currentStatus !== undefined ? !currentStatus : !messages.find(m => m.id === id)?.isRead;

        setMessages((prev) =>
            prev.map((m) => (m.id === id ? { ...m, isRead: newStatus } : m))
        );
        if (selectedMessage?.id === id) {
            setSelectedMessage({ ...selectedMessage, isRead: newStatus });
        }

        try {
            await updateMessage(id, { isRead: newStatus });
        } catch (error) {
            console.error("Failed to update message status:", error);
            // Optionally rollback local state if needed
        }
    };

    const handleToggleSelection = (id: string) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    const handleBulkToggleRead = async (isRead: boolean) => {
        const ids = Array.from(selectedIds);
        setMessages((prev) =>
            prev.map((m) => (ids.includes(m.id) ? { ...m, isRead } : m))
        );
        setSelectedIds(new Set());

        try {
            await updateMessagesStatus(ids, isRead);
        } catch (error) {
            console.error("Failed to bulk update messages:", error);
        }
    };

    const handleNewMessage = async (newMsg: Partial<IMessage>) => {
        try {
            const result = await addMessage(newMsg as Omit<IMessage, 'id'>);
            setMessages((prev) => [result, ...prev]);
            console.log("New message added successfully:", result.id);
        } catch (error) {
            console.error("Failed to add message:", error);
        }
    };

    const filtered = filterUnread
        ? messages.filter((m) => !m.isRead)
        : messages

    const unreadCount = messages.filter((m) => !m.isRead).length;
    const displayed = filtered.slice(0, displayCount);


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
                        onLayout={(e) => {
                            const layout = e.nativeEvent.layout;
                            registerLayout('messages_plus', {
                                x: layout.x + SCREEN_WIDTH - 58, // Adjust for parent container
                                y: layout.y + 16, // Adjust for safe area / header
                                width: layout.width,
                                height: layout.height
                            });
                        }}
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

            <View
                style={{ flex: 1 }}
                onLayout={(e) => {
                    const layout = e.nativeEvent.layout;
                    registerLayout('messages_feed', {
                        x: layout.x,
                        y: layout.y + 180, // Offset for header + action bar
                        width: layout.width,
                        height: 300 // Highlight a portion of the feed
                    });
                }}
            >
                <FlatList
                    data={displayed}
                    keyExtractor={(item) => item.id}
                    refreshing={isRefreshing}
                    onRefresh={handleRefresh}
                    contentContainerStyle={{ padding: 16 }}
                    renderItem={({ item }) => (
                        <MessageCard
                            message={item}
                            isSelected={selectedIds.has(item.id)}
                            onPress={() => {
                                if (isSelectionMode) {
                                    handleToggleSelection(item.id);
                                } else {
                                    setSelectedMessage(item);
                                }
                            }}
                            onLongPress={() => handleToggleSelection(item.id)}
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
                            onLayout={(e) => {
                                const layout = e.nativeEvent.layout;
                                registerLayout('messages_load_more', {
                                    x: layout.x + 16,
                                    y: 600, // Approximate position at footer
                                    width: layout.width,
                                    height: layout.height
                                });
                            }}
                        >
                            <Text style={styles.loadMoreText}>Load More Messages</Text>
                        </TouchableOpacity>
                    }
                />

                {isSelectionMode && (
                    <View style={styles.bulkActionBar}>
                        <TouchableOpacity
                            style={styles.bulkActionBtn}
                            onPress={() => setSelectedIds(new Set())}
                        >
                            <Feather name="x" size={20} color="#666" />
                            <Text style={styles.bulkActionText}>Cancel</Text>
                        </TouchableOpacity>

                        <View style={{ flexDirection: 'row', gap: 12 }}>
                            <TouchableOpacity
                                style={[styles.bulkActionBtn, { backgroundColor: '#2563eb' }]}
                                onPress={() => handleBulkToggleRead(true)}
                            >
                                <Feather name="check-circle" size={18} color="#fff" />
                                <Text style={[styles.bulkActionText, { color: '#fff' }]}>Mark Read</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.bulkActionBtn, { backgroundColor: '#4b5563' }]}
                                onPress={() => handleBulkToggleRead(false)}
                            >
                                <Feather name="circle" size={18} color="#fff" />
                                <Text style={[styles.bulkActionText, { color: '#fff' }]}>Unread</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
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
            </View>
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
    bulkActionBar: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 8,
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    bulkActionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        backgroundColor: '#f3f4f6',
    },
    bulkActionText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4b5563',
    },
});
