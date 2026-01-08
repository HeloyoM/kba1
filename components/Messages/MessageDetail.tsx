import { IMessage } from "@/interface/message.interface";
import { useRef } from "react";
import { Animated, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { formatFileSize, formatTimestamp } from "../Events/eventsHelpers";
import { IconSymbol } from "../ui/icon-symbol";
import { styles } from "./MessageDetail.styles";

interface MessageDetailProps {
    message: IMessage | null
    onClose: () => void
    onToggleRead: () => void
}

const MessageDetail = ({ message, onClose, onToggleRead }: MessageDetailProps) => {
    const { formattedDate, formattedTime } = formatTimestamp(message?.createdAt!);
    const slideAnimation = useRef(new Animated.Value(200)).current;

    const hasImage: boolean = !!message?.image;

    return (
        <View style={styles.overlay}>
            <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />

            <Animated.View
                style={[
                    styles.modalContainer,
                    { transform: [{ translateY: slideAnimation }] },
                ]}
            >
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <Image
                            source={{ uri: message?.image || '' }}
                            style={styles.avatar}
                        />

                        <View>
                            <Text style={styles.adminName}>
                                {message?.author || ''}
                            </Text>

                            <View style={styles.timeRow}>
                                <IconSymbol size={14} color="#6B7280" name="clock" />
                                <Text style={styles.dateTime}>
                                    {formattedDate} • {formattedTime}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <TouchableOpacity
                        onPress={onClose}
                        style={styles.closeButton}
                    >
                        <IconSymbol size={20} color="#6B7280" name="x.circle" />
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
                    {message?.title && (
                        <Text style={styles.title}>
                            {message.title}
                        </Text>
                    )}

                    {hasImage && (
                        <View style={styles.imageWrapper}>
                            <Image
                                source={{ uri: message?.image }}
                                style={styles.image}
                            />
                        </View>
                    )}

                    <Text style={styles.content}>
                        {message?.content}
                    </Text>

                    {message?.hasAttachment && message?.attachment && (
                        <View style={styles.attachmentBox}>
                            <View style={styles.attachmentLeft}>
                                <View style={styles.iconBox}>
                                    <IconSymbol
                                        size={20}
                                        color="#2563EB"
                                        name="arrow.down"
                                    />
                                </View>

                                <View>
                                    <Text style={styles.attachmentName}>
                                        {message.attachment.name}
                                    </Text>
                                    <Text style={styles.attachmentSize}>
                                        {formatFileSize(message.attachment.sizeBytes)}
                                    </Text>
                                </View>
                            </View>

                            <TouchableOpacity style={styles.downloadBtn}>
                                <Text style={styles.downloadBtnText}>Download</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </ScrollView>

                <View style={styles.footer}>
                    <TouchableOpacity
                        onPress={onToggleRead}
                        style={styles.readBtn}
                    >
                        <IconSymbol
                            size={20}
                            color="#111"
                            name={message?.isRead ? "x.circle" : "checkmark.circle"}
                        />
                        <Text style={styles.readBtnText}>
                            {message?.isRead ? "Mark as Unread" : "Mark as Read"}
                        </Text>
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
    );
};

export default MessageDetail;