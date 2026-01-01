import { IMessage } from "@/app/(tabs)/messages";
import { useRef } from "react";
import { Animated, Pressable, StyleSheet, View, Image, Text, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import { IconSymbol } from "../ui/icon-symbol";

type Props = {
    message: IMessage | null
    onClose: () => void
    onToggleRead: () => void
}
const MessageDetail = ({ message, onClose, onToggleRead }: Props) => {
    const { date, time } = convertTimestamp(message?.createdAt!)
    const slideAnim = useRef(new Animated.Value(200)).current;
    return (
        <View style={styles.overlay}>

            {/* Close when tapping background */}
            <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />

            <Animated.View
                style={[
                    styles.modalContainer,
                    { transform: [{ translateY: slideAnim }] },
                ]}
            >
                {/* Header */}
                <View
                    style={[
                        styles.header,
                        { borderColor: "#E5E7EB" },
                    ]}
                >
                    <View style={styles.headerLeft}>
                        <Image
                            source={{ uri: /*message.admin.avatar*/ '' }}
                            style={styles.avatar}
                        />

                        <View>
                            <Text style={[styles.adminName]}>
                                {message?.author}
                            </Text>

                            <View style={styles.timeRow}>
                                <IconSymbol size={14} color="#6B7280" name="clock" />
                                <Text style={[styles.dateTime]}>
                                    {date} • {time}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <TouchableOpacity
                        onPress={onClose}
                        style={[styles.closeButton]}
                    >
                        <IconSymbol size={20} color="#6B7280" name="x.circle" />
                    </TouchableOpacity>
                </View>

                {/* Scrollable Content */}
                <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
                    {message?.title && (
                        <Text style={[styles.title]}>
                            {message.title}
                        </Text>
                    )}

                    {message?.image && (
                        <View style={styles.imageWrapper}>
                            <Image
                                source={{ uri: message.image }}
                                style={styles.image}
                            />
                        </View>
                    )}

                    <Text
                        style={[styles.content]}
                    >
                        {message?.content}
                    </Text>

                    {/* Attachment */}
                    {message?.hasAttachment && (
                        <View style={[styles.attachmentBox]}>
                            <View style={styles.attachmentLeft}>
                                <View style={[styles.iconBox]}>
                                    <IconSymbol
                                        size={20}
                                        color="#2563EB"
                                        name="arrow.down"
                                    />
                                </View>

                                <View>
                                    <Text
                                        style={[
                                            styles.attachmentName,
                                        ]}
                                    >
                                        Community_Guidelines.pdf
                                    </Text>
                                    <Text
                                        style={[
                                            styles.attachmentSize,
                                        ]}
                                    >
                                        2.4 MB
                                    </Text>
                                </View>
                            </View>

                            <TouchableOpacity style={styles.downloadBtn}>
                                <Text style={styles.downloadBtnText}>Download</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </ScrollView>

                {/* Footer */}
                <View
                    style={[
                        styles.footer,
                        { borderColor: "#E5E7EB" },
                    ]}
                >
                    <TouchableOpacity
                        onPress={onToggleRead}
                        style={[
                            styles.readBtn,
                        ]}
                    >
                        {message?.isRead ? (
                            <>
                                <IconSymbol size={20} color="#111" name="x.circle" />
                                <Text style={[styles.readBtnText]}>
                                    Mark as Unread
                                </Text>
                            </>
                        ) : (
                            <>
                                <IconSymbol size={20} color="#111" name="x.circle" />
                                <Text style={[styles.readBtnText]}>
                                    Mark as Read
                                </Text>
                            </>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={onClose}
                        style={styles.primaryBtn}
                    >
                        <Text style={styles.primaryBtnText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </View>
    )
}

export default MessageDetail;

function convertTimestamp(timestamp: number) {
    const dateObj = new Date(timestamp);

    // Get date in YYYY-MM-DD format
    const date = dateObj.toISOString().split('T')[0];

    // Get time in HH:MM:SS format
    const time = dateObj.toTimeString().split(' ')[0];

    return { date, time };
}
const { height } = Dimensions.get("window");

const styles = StyleSheet.create({
    overlay: {
        position: "absolute",
        inset: 0,
        // justifyContent: "flex-end",
        // zIndex: 999,
    },

    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.5)",
    },

    modalContainer: {
        // width: "100%",
        // maxHeight: "90%",
        // borderTopLeftRadius: 28,
        // borderTopRightRadius: 28,
        // overflow: "hidden",
        // position: "absolute",
        // bottom: 0,
        width: "100%",

        maxHeight: height * 0.7, // modal covers up to 80% of screen
        backgroundColor: "#fff",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        overflow: "hidden",
    },

    lightCard: {
        backgroundColor: "#fff",
    },
    darkCard: {
        backgroundColor: "#1F2937",
    },

    header: {
        padding: 16,
        borderBottomWidth: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    headerLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },

    avatar: {
        width: 44,
        height: 44,
        borderRadius: 999,
    },

    adminName: {
        color: "#111",
        fontSize: 16,
        fontWeight: "500",
    },
    adminNameDark: {
        color: "#F3F4F6",
    },

    timeRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        marginTop: 2,
    },
    dateTime: {
        color: "#6B7280",
        fontSize: 13,
    },
    dateTimeDark: {
        color: "#9CA3AF",
    },

    closeButton: {
        width: 36,
        height: 36,
        borderRadius: 999,
        alignItems: "center",
        justifyContent: "center",
    },
    closeButtonLight: {
        backgroundColor: "#F3F4F6",
    },
    closeButtonDark: {
        backgroundColor: "#374151",
    },

    body: {
        padding: 20,
        flexGrow: 1,
    },

    title: {
        fontSize: 20,
        color: "#111",
        marginBottom: 16,
        fontWeight: "600",
    },
    titleDark: {
        color: "#F3F4F6",
    },

    imageWrapper: {
        borderRadius: 16,
        overflow: "hidden",
        marginBottom: 18,
    },

    image: {
        width: "100%",
        height: 200,
        resizeMode: "cover",
    },

    content: {
        color: "#374151",
        fontSize: 15,
        lineHeight: 22,
        // : "pre-line",
    },
    contentDark: {
        color: "#D1D5DB",
    },

    attachmentBox: {
        marginTop: 20,
        padding: 16,
        borderRadius: 14,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    attachmentLight: {
        backgroundColor: "#F3F4F6",
    },
    attachmentDark: {
        backgroundColor: "rgba(55,65,81,0.4)",
    },

    attachmentLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },

    iconBox: {
        width: 44,
        height: 44,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    iconBoxLight: {
        backgroundColor: "#DBEAFE",
    },
    iconBoxDark: {
        backgroundColor: "rgba(30,58,138,0.4)",
    },

    attachmentName: {
        color: "#111",
        fontSize: 14,
    },
    attachmentNameDark: {
        color: "#F3F4F6",
    },

    attachmentSize: {
        fontSize: 12,
        color: "#6B7280",
    },
    attachmentSizeDark: {
        color: "#9CA3AF",
    },

    downloadBtn: {
        backgroundColor: "#2563EB",
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 8,
    },
    downloadBtnText: {
        color: "#fff",
        fontSize: 13,
        fontWeight: "500",
    },

    footer: {
        padding: 14,
        borderTopWidth: 1,
        flexDirection: "row",
        gap: 10,
    },

    readBtn: {
        flex: 1,
        borderRadius: 12,
        paddingVertical: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
    },
    readBtnLight: {
        backgroundColor: "#E5E7EB",
    },
    readBtnDark: {
        backgroundColor: "#374151",
    },

    readBtnText: {
        color: "#111",
        fontSize: 14,
    },
    readBtnTextDark: {
        color: "#F3F4F6",
    },

    primaryBtn: {
        backgroundColor: "#2563EB",
        borderRadius: 12,
        paddingHorizontal: 18,
        paddingVertical: 12,
    },
    primaryBtnText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "600",
    },
});