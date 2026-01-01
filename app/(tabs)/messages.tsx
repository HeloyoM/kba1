
import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, Modal } from 'react-native';
import { colors } from '@/utils/colors';
import { Feather } from '@expo/vector-icons';
import MessageCard from '@/components/Messages/MessageCard';
import MessageDetail from '@/components/Messages/MessageDetail';
import AdminMessageForm from '@/components/AdminMessageForm';

export interface IMessage {
    id: string
    isRead: boolean
    title: string;
    content: string;
    image?: string;
    author: string;
    createdAt: number;
    hasAttachment: boolean;
    preview: string;
}

const initialMessages: IMessage[] = [
    {
        id: "msg_001",
        isRead: false,
        title: "Welcome to Our Community!",
        content: "We’re excited to have you here. Stay tuned for updates and new features!",
        image: "https://picsum.photos/seed/1/600/400",
        author: "System Admin",
        createdAt: 1733202000000,
        hasAttachment: true,
        preview: "We’re excited to have you here..."
    },
    {
        id: "msg_002",
        isRead: false,
        title: "Upcoming Meeting Reminder",
        content: "Don't forget about tomorrow’s community gathering at 19:00. See you there!",
        image: "https://picsum.photos/seed/2/600/400",
        author: "Community Manager",
        createdAt: 1733205600000,
        hasAttachment: false,
        preview: "Don't forget about tomorrow’s community gathering..."
    },
    {
        id: "msg_003",
        isRead: false,
        title: "New Lesson Available",
        content: "A new lesson has been uploaded. Check it out in the Lessons tab.",
        image: "https://picsum.photos/seed/3/600/400",
        author: "Education Team",
        createdAt: 1733210000000,
        hasAttachment: true,
        preview: "A new lesson has been uploaded..."
    },
    {
        id: "msg_004",
        isRead: true,
        title: "Maintenance Completed",
        content: "The server maintenance was completed successfully. Everything is running smoothly.",
        image: "https://picsum.photos/seed/4/600/400",
        author: "Tech Support",
        createdAt: 1733213600000,
        hasAttachment: false,
        preview: "The server maintenance was completed successfully..."
    },
    {
        id: "msg_005",
        isRead: false,
        title: "Campaign Update",
        content: "Our donation campaign reached 45% of its goal. Thank you to everyone contributing!",
        image: "https://picsum.photos/seed/5/600/400",
        author: "Campaigns Team",
        createdAt: 1733220000000,
        hasAttachment: true,
        preview: "Our donation campaign reached 45% of its goal..."
    },
    {
        id: "msg_006",
        isRead: true,
        title: "Holiday Celebration",
        content: "Join us for a special holiday event next week. Details will be shared soon.",
        image: "https://picsum.photos/seed/6/600/400",
        author: "Events Coordinator",
        createdAt: 1733223600000,
        hasAttachment: false,
        preview: "Join us for a special holiday event next week..."
    },
    {
        id: "msg_007",
        isRead: false,
        title: "New Photos Added",
        content: "We’ve added new photos to the gallery. Check out the latest community moments!",
        image: "https://picsum.photos/seed/7/600/400",
        author: "Media Team",
        createdAt: 1733227200000,
        hasAttachment: true,
        preview: "We’ve added new photos to the gallery..."
    },
    {
        id: "msg_008",
        isRead: true,
        title: "Important Notice",
        content: "Please update your profile information to ensure you receive all notifications.",
        image: "https://picsum.photos/seed/8/600/400",
        author: "System Admin",
        createdAt: 1733230800000,
        hasAttachment: false,
        preview: "Please update your profile information..."
    },
    {
        id: "msg_009",
        isRead: false,
        title: "Special Announcement",
        content: "A big surprise is coming soon. Stay connected!",
        image: "https://picsum.photos/seed/9/600/400",
        author: "Community Manager",
        createdAt: 1733234400000,
        hasAttachment: false,
        preview: "A big surprise is coming soon..."
    },
    {
        id: "msg_010",
        isRead: true,
        title: "Thank You!",
        content: "Thank you for being an active part of our community!",
        image: "https://picsum.photos/seed/10/600/400",
        author: "System Admin",
        createdAt: 1733238000000,
        hasAttachment: false,
        preview: "Thank you for being an active part of our community..."
    }
];





export default function Messages() {
    const [messages, setMessages] = useState(initialMessages);
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

    console.log({ selectedMessage })
    return (
        <SafeAreaView style={[styles.container]}>
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
})

