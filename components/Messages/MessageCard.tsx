import { IMessage } from '@/app/(tabs)/messages'
import { IconSymbol } from '@/components/ui/icon-symbol'
import { Colors } from '@/constants/theme'
import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native'

type Props = {
    message: IMessage
    onPress: () => void
}

const MessageCard = ({ message, onPress }: Props) => {
    const colorScheme = useColorScheme() ?? 'light'
    const colors = Colors[colorScheme]
    const { date, time } = convertTimestamp(message.createdAt)

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.8}
            style={[
                styles.card,
                {
                    backgroundColor: colors.background,
                    borderColor: message.isRead ? '#E5E7EB' : '#3B82F6',
                    borderWidth: message.isRead ? 1 : 1.5,
                },
                !message.isRead && styles.unreadShadow,
            ]}
        >
            {/* Header */}
            <View style={styles.headerRow}>
                <View style={styles.avatarContainer}>
                    <Image
                        source={{ uri: message.admin?.avatar || 'https://via.placeholder.com/50' }}
                        style={styles.avatar}
                    />
                    {!message.isRead && <View style={styles.unreadIndicator} />}
                </View>

                <View style={styles.headerTextContainer}>
                    <View style={styles.nameRow}>
                        <Text style={[styles.name, { color: colors.text }]}>
                            {message.author}
                        </Text>
                        {message.isRead && (
                            <IconSymbol size={14} name="checkmark.circle.fill" color="#10B981" />
                        )}
                    </View>

                    <View style={styles.timeRow}>
                        <IconSymbol size={12} color="#9CA3AF" name="clock.fill" />
                        <Text style={styles.time}>
                            {date} • {time}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Content */}
            <View style={[styles.contentBody, { opacity: message.isRead ? 0.8 : 1 }]}>
                {message.title && (
                    <Text style={[styles.title, { color: colors.text }]}>
                        {message.title}
                    </Text>
                )}

                <Text
                    numberOfLines={2}
                    style={[styles.preview, { color: message.isRead ? '#6B7280' : '#4B5563' }]}
                >
                    {message.preview}
                </Text>

                {/* Image Preview */}
                {message.image && (
                    <View style={styles.imageContainer}>
                        <Image
                            source={{ uri: message.image }}
                            style={styles.previewImage}
                        />
                    </View>
                )}

                {/* Footer indicators */}
                <View style={styles.footerRow}>
                    {message.hasAttachment && (
                        <View style={styles.attachmentBadge}>
                            <IconSymbol
                                size={12}
                                name="paperclip"
                                color="#6B7280"
                            />
                            <Text style={styles.attachmentText}>
                                Attachment
                            </Text>
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    )
}

function convertTimestamp(timestamp: number) {
    const dateObj = new Date(timestamp);
    const date = dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    const time = dateObj.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
    return { date, time };
}

export default MessageCard;

const styles = StyleSheet.create({
    card: {
        borderRadius: 24,
        padding: 16,
        marginVertical: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    unreadShadow: {
        shadowColor: "#3B82F6",
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 4,
    },
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginBottom: 12,
    },
    avatarContainer: {
        position: 'relative',
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "#F3F4F6",
        borderWidth: 2,
        borderColor: '#fff',
    },
    unreadIndicator: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#3B82F6',
        borderWidth: 2,
        borderColor: '#fff',
    },
    headerTextContainer: {
        flex: 1,
    },
    nameRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    name: {
        fontSize: 16,
        fontWeight: "700",
    },
    timeRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        marginTop: 2,
    },
    time: {
        fontSize: 12,
        color: "#9CA3AF",
        fontWeight: '500',
    },
    contentBody: {
        paddingLeft: 0,
    },
    title: {
        fontSize: 15,
        fontWeight: "700",
        marginBottom: 4,
        letterSpacing: -0.2,
    },
    preview: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 8,
    },
    imageContainer: {
        borderRadius: 16,
        overflow: "hidden",
        marginTop: 4,
        marginBottom: 12,
        backgroundColor: '#F3F4F6',
    },
    previewImage: {
        width: "100%",
        height: 180,
        resizeMode: "cover",
    },
    footerRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    attachmentBadge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 99,
        gap: 4,
    },
    attachmentText: {
        fontSize: 11,
        fontWeight: '600',
        color: "#6B7280",
    },
})
