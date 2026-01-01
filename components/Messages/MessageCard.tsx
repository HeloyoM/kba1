import { IMessage } from '@/app/(tabs)/messages'
import React from 'react'
import { StyleSheet, TouchableOpacity, View, Image, Text } from 'react-native'
import { IconSymbol } from '@/components/ui/icon-symbol'
type Props = {
    message: IMessage
    onPress: () => void
    // onLongPress: () => void
}
const MessageCard = ({ message, onPress }: Props) => {
    const { date, time } = convertTimestamp(message.createdAt)
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            style={[
                styles.card,
                !message.isRead && styles.unreadShadow,
            ]}
        >
            {/* Header */}
            <View style={styles.headerRow}>
                <Image
                    source={{ uri: /*message.admin.avatar*/ '' }}
                    style={styles.avatar}
                />

                <View style={styles.headerTextContainer}>
                    <View style={styles.nameRow}>
                        <Text style={[styles.name]}>
                            {message.author}
                        </Text>

                        {!message.isRead && (
                            <IconSymbol
                                size={10}
                                name="circle"
                                color="#3B82F6"
                                style={{ marginTop: 2 }}
                            />
                        )}
                    </View>

                    <View style={styles.timeRow}>
                        <IconSymbol size={14} color="#6B7280" name="clock" />
                        <Text style={[styles.time]}>
                            {date} • {time}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Content */}
            <View style={{ opacity: message.isRead ? 0.7 : 1 }}>
                {message.title && (
                    <Text style={[styles.title]}>
                        {message.title}
                    </Text>
                )}

                <Text
                    numberOfLines={2}
                    style={[styles.preview]}
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
                        <View style={styles.attachmentRow}>
                            <IconSymbol
                                size={18}
                                name="message"
                                color="#9CA3AF"
                            />
                            <Text style={[styles.attachmentText]}>
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

    // Get date in YYYY-MM-DD format
    const date = dateObj.toISOString().split('T')[0];

    // Get time in HH:MM:SS format
    const time = dateObj.toTimeString().split(' ')[0];

    return { date, time };
}

function formatDate(timestamp: number) {
    try {
        const date = new Date(timestamp);
        return date.toLocaleString();
    } catch (e) {
        return "";
    }
}
export default MessageCard;

const styles = StyleSheet.create({
    card: {
        borderRadius: 20,
        padding: 16,
        marginVertical: 6,
        borderWidth: 1,
        transform: [{ scale: 1 }],
    },
    unreadShadow: {
        elevation: 3,
        shadowColor: "#3B82F6",
        shadowOpacity: 0.2,
        shadowRadius: 6,
    },
    headerRow: {
        flexDirection: "row",
        gap: 12,
        marginBottom: 12,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 999,
        backgroundColor: "#ccc",
    },
    headerTextContainer: {
        flex: 1,
    },
    nameRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginBottom: 2,
    },

    name: {
        fontSize: 16,
        fontWeight: "600",
        color: "#111",
    },

    timeRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },

    time: {
        fontSize: 13,
        color: "#6B7280",
    },

    timeDark: {
        color: "#9CA3AF",
    },
    title: {
        fontSize: 16,
        color: "#111",
        marginBottom: 6,
        fontWeight: "600",
    },

    titleDark: {
        color: "#F3F4F6",
    },

    preview: {
        fontSize: 14,
        color: "#4B5563",
        marginBottom: 10,
        lineHeight: 20,
    },

    previewDark: {
        color: "#D1D5DB",
    },

    imageContainer: {
        borderRadius: 14,
        overflow: "hidden",
        marginBottom: 10,
    },

    previewImage: {
        width: "100%",
        height: 160,
        resizeMode: "cover",
    },

    footerRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 4,
    },

    attachmentRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },

    attachmentText: {
        fontSize: 13,
        color: "#9CA3AF",
    },

    attachmentTextDark: {
        color: "#6B7280",
    },

})