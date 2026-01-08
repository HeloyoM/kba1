import { EventRSVPStatus, IEvent } from "@/interface/events.interface";
import {
    Feather as Icon,
} from "@expo/vector-icons";
import React, { useState } from "react";
import {
    Alert,
    Dimensions,
    FlatList,
    Image,
    Linking,
    ScrollView,
    Share,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import Toast from "react-native-toast-message";


interface EventDetailsProps {
    event: IEvent;
    onBack: () => void;
}

function ImageWithFallback({
    src,
    style,
    resizeMode = "cover",
    alt,
}: {
    src?: string;
    style?: any;
    resizeMode?: "cover" | "contain" | "stretch";
    alt?: string;
}) {
    const [error, setError] = useState(false);
    const uri = !error && src ? { uri: src } : require("../../assets/images/image-placeholder.jpg"); // add a local placeholder at this path

    return (
        <Image
            source={uri}
            style={style}
            resizeMode={resizeMode}
            onError={() => setError(true)}
            accessibilityLabel={alt}
        />
    );
}

export function EventDetails({ event, onBack }: EventDetailsProps) {
    const [rsvpStatus, setRsvpStatus] = useState<EventRSVPStatus>(
        (event.userRSVP as EventRSVPStatus) ?? null
    );
    const [showAllPhotos, setShowAllPhotos] = useState(false);
    const [newComment, setNewComment] = useState("");

    const handleRSVP = (status: Exclude<EventRSVPStatus, null>) => {
        if (rsvpStatus === status) {
            setRsvpStatus(null);
            Toast.show({
                type: "info",
                text1: `Removed ${status === "joined" ? "attendance" : "interest"}`,
            });
        } else {
            setRsvpStatus(status);
            Toast.show({
                type: "success",
                text1:
                    status === "joined"
                        ? "You're attending this event!"
                        : "You're interested in this event!",
                text2: `We'll send reminders about ${event.title}`,
            });
        }
    };

    const addToCalendar = async () => {
        // Minimal behavior: show toast. In production you may integrate expo-calendar or deep link to calendar apps.
        Toast.show({
            type: "success",
            text1: "Added to calendar",
            text2: "This event has been added to your calendar (simulated).",
        });
    };

    const shareEvent = async () => {
        try {
            const result = await Share.share({
                message: `${event.title} — ${event.description}\n\n${event.isOnline ? "Online" : event.location}`,
            });
            // result handling not necessary here
        } catch (err) {
            Toast.show({ type: "error", text1: "Unable to share event" });
        }
    };

    const submitComment = () => {
        if (newComment.trim()) {
            // In a real app you'd send to backend and update state
            Toast.show({ type: "success", text1: "Comment posted!" });
            setNewComment("");
        } else {
            Toast.show({ type: "info", text1: "Please enter a comment first" });
        }
    };

    const openMap = async () => {
        if (!event.isOnline && event.location) {
            const url = `https://maps.google.com/?q=${encodeURIComponent(event.location)}`;
            const supported = await Linking.canOpenURL(url);
            if (supported) {
                await Linking.openURL(url);
            } else {
                Alert.alert("Cannot open maps", "Unable to open map link on this device.");
            }
        }
    };

    const formatFullDate = (d: Date | string) => {
        const date = new Date(d);
        return date.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    // photo grid: show up to 6 by default (or all if toggled)
    const photosToShow = showAllPhotos ? event.pastPhotos : event.pastPhotos.slice(0, 6);

    return (
        <ScrollView
            style={[styles.container, styles.containerLight]}
            contentContainerStyle={styles.contentContainer}
        >
            {/* Header with back button */}
            <View style={styles.headerRow}>
                <TouchableOpacity onPress={onBack} style={styles.iconButton}>
                    <Icon name="chevron-left" size={20} color={"#111"} />
                </TouchableOpacity>
                <View style={styles.headerSpacer} />
            </View>

            {/* Hero image */}
            <View style={styles.heroWrapper}>
                <ImageWithFallback src={event.coverImage} alt={event.title} style={styles.heroImage} />
                <View style={styles.heroOverlay} />
                <View style={styles.heroTextWrap}>
                    <View style={styles.categoryRow}>
                        <View style={styles.categoryBadge}>
                            <Text style={styles.categoryBadgeText}>{event.category}</Text>
                        </View>
                        {event.trending && (
                            <View style={styles.trendingBadge}>
                                <Text style={styles.trendingBadgeText}>🔥 Trending</Text>
                            </View>
                        )}
                    </View>

                    <View><Text style={[styles.heroTitle, styles.textDark]}>
                        {event.title}
                    </Text></View>
                </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionsGrid}>
                <TouchableOpacity
                    onPress={() => handleRSVP("joined")}
                    style={[
                        styles.actionButton,
                        rsvpStatus === "joined" ? styles.actionPrimaryGreen : styles.actionNeutral,
                    ]}
                >
                    <Icon name="check-circle" size={18} color={rsvpStatus === "joined" ? "#fff" : "#333"} />
                    <Text style={[styles.actionText, rsvpStatus === "joined" ? styles.actionTextPrimary : null]}>
                        {rsvpStatus === "joined" ? "Joined" : "Join"}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => handleRSVP("interested")}
                    style={[
                        styles.actionButton,
                        rsvpStatus === "interested" ? styles.actionPrimaryBlue : styles.actionNeutral,
                    ]}
                >
                    <Icon name="heart" size={18} color={rsvpStatus === "interested" ? "#fff" : "#333"} />
                    <Text style={[styles.actionText, rsvpStatus === "interested" ? styles.actionTextPrimary : null]}>
                        {rsvpStatus === "interested" ? "Interested" : "Interest"}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={shareEvent} style={[styles.actionButton, styles.actionNeutral]}>
                    <Icon name="share-2" size={18} color="#333" />
                    <Text style={styles.actionText}>Share</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={addToCalendar} style={[styles.actionButton, styles.actionNeutral]}>
                    <Icon name="download" size={18} color="#333" />
                    <Text style={styles.actionText}>Calendar</Text>
                </TouchableOpacity>
            </View>

            {/* Main / Sidebar layout is converted into vertical stacking for mobile */}
            <View style={styles.section}>
                {/* Event Info */}
                <View style={[styles.card, styles.cardLight]}>
                    <Text style={[styles.sectionTitle, styles.textDark]}>Event Details</Text>

                    <View style={styles.infoRow}>
                        <View style={styles.infoIconWrap}>
                            <Icon name="clock" size={18} color="#7c3aed" />
                        </View>
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>Date & Time</Text>
                            <Text style={[styles.infoPrimary, styles.textDark]}>
                                {formatFullDate(event.date)}
                            </Text>
                            <Text style={styles.infoSecondary}>{event.time}</Text>
                        </View>
                    </View>

                    <View style={styles.infoRow}>
                        <View style={styles.infoIconWrap}>
                            <Icon name="map-pin" size={18} color="#7c3aed" />
                        </View>
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>Location</Text>
                            <Text style={[styles.infoPrimary, styles.textDark]}>
                                {event.isOnline ? "Online Event" : event.location}
                            </Text>

                            {!event.isOnline && (
                                <TouchableOpacity onPress={openMap}>
                                    <View style={styles.mapLinkRow}>
                                        <Text style={styles.mapLinkText}>View on map</Text>
                                        <Icon name="external-link" size={14} color="#7c3aed" />
                                    </View>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>

                    <View style={styles.infoRow}>
                        <View style={styles.infoIconWrap}>
                            <Icon name="users" size={18} color="#7c3aed" />
                        </View>
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>Attendance</Text>
                            <Text style={[styles.infoPrimary, styles.textDark]}>
                                {event.attendees} {event.capacity ? `/ ${event.capacity}` : ""} people going
                            </Text>
                            <Text style={styles.infoSecondary}>{event.interested} interested</Text>
                        </View>
                    </View>
                </View>

                {/* About */}
                <View style={[styles.card, styles.cardLight]}>
                    <Text style={[styles.sectionTitle, styles.textDark]}>About This Event</Text>
                    <Text style={[styles.paragraph, styles.textMutedLight]}>
                        {event.fullDescription}
                    </Text>
                </View>

                {/* Schedule */}
                <View style={[styles.card, styles.cardLight]}>
                    <Text style={[styles.sectionTitle, styles.textDark]}>Event Schedule</Text>
                    <View style={styles.scheduleWrap}>
                        {event.schedule.map((item, idx) => (
                            <View key={idx} style={styles.scheduleRow}>
                                <View style={styles.scheduleMarkerColumn}>
                                    <View style={styles.scheduleDot} />
                                    {idx < event.schedule.length - 1 && <View style={styles.scheduleLine} />}
                                </View>
                                <View style={styles.scheduleContent}>
                                    <Text style={styles.scheduleTime}>{item.time}</Text>
                                    <Text style={[styles.scheduleActivity, styles.textDark]}>
                                        {item.activity}
                                    </Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Photos Gallery */}
                {event.pastPhotos.length > 0 && (
                    <View style={[styles.card, styles.cardLight]}>
                        <View style={styles.photosHeaderRow}>
                            <Text style={[styles.sectionTitle, styles.textDark]}>Photos from Past Events</Text>
                            <TouchableOpacity onPress={() => setShowAllPhotos(!showAllPhotos)}>
                                <Text style={styles.viewAllText}>{showAllPhotos ? "Show less" : "View all"}</Text>
                            </TouchableOpacity>
                        </View>

                        <FlatList
                            data={photosToShow}
                            keyExtractor={(_, i) => `${event.id}-photo-${i}`}
                            numColumns={3}
                            scrollEnabled={false}
                            renderItem={({ item }) => (
                                <View style={styles.photoTile}>
                                    <ImageWithFallback src={item} alt="event photo" style={styles.photoImage} />
                                </View>
                            )}
                        />
                    </View>
                )}

                {/* Comments Section */}
                <View style={[styles.card, styles.cardLight]}>
                    <Text style={[styles.sectionTitle, styles.textDark]}>Discussion</Text>

                    <TextInput
                        placeholder="Share your thoughts or questions..."
                        placeholderTextColor={"#888"}
                        value={newComment}
                        onChangeText={setNewComment}
                        multiline
                        style={[styles.textArea, styles.inputLight]}
                    />
                    <TouchableOpacity onPress={submitComment} style={styles.postButton}>
                        <Text style={styles.postButtonText}>Post Comment</Text>
                    </TouchableOpacity>

                    <View style={styles.commentsList}>
                        {event.comments.length === 0 ? (
                            <Text style={styles.noCommentsText}>No comments yet. Be the first to share your thoughts!</Text>
                        ) : (
                            event.comments.map((comment, idx) => (
                                <View key={idx} style={styles.commentRow}>
                                    <ImageWithFallback src={comment.avatar} alt={comment.user} style={styles.commentAvatar} />
                                    <View style={styles.commentContent}>
                                        <View style={styles.commentHeader}>
                                            <Text style={[styles.commentUser, styles.textDark]}>{comment.user}</Text>
                                            <Text style={styles.commentTime}>{comment.time}</Text>
                                        </View>
                                        <Text style={[styles.commentText, styles.textMutedLight]}>
                                            {comment.comment}
                                        </Text>
                                    </View>
                                </View>
                            ))
                        )}
                    </View>
                </View>

                {/* Sidebar content (stacked for mobile) */}
                <View style={styles.sidebarStack}>
                    {/* Organizer Card */}
                    <View style={[styles.card, styles.cardLight]}>
                        <Text style={[styles.sectionTitle, styles.textDark]}>Hosted By</Text>
                        <View style={styles.organizerRow}>
                            <ImageWithFallback src={event.organizer.avatar} alt={event.organizer.name} style={styles.organizerAvatar} />
                            <View style={styles.organizerInfo}>
                                <Text style={[styles.organizerName, styles.textDark]}>{event.organizer.name}</Text>
                                <Text style={styles.organizerSubtitle}>Event Organizer</Text>
                            </View>
                        </View>

                        <TouchableOpacity
                            onPress={() => Linking.openURL(`mailto:${event.organizer.contact}`)}
                            style={[styles.contactButton, styles.contactButtonLight]}
                        >
                            <Icon name="mail" size={16} color={"#111"} />
                            <Text style={[styles.contactButtonText, styles.textDark]}> Contact Organizer</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Attendees */}
                    <View style={[styles.card, styles.cardLight]}>
                        <Text style={[styles.sectionTitle, styles.textDark]}>Attendees ({event.attendees})</Text>
                        <View style={styles.attendeesRow}>
                            {[1, 2, 3, 4, 5].map((i) => (
                                <View key={i} style={styles.attendeeAvatarPlaceholder} />
                            ))}
                            {event.attendees > 5 && (
                                <View style={styles.attendeeMore}>
                                    <Text style={styles.attendeeMoreText}>+{event.attendees - 5}</Text>
                                </View>
                            )}
                        </View>
                        <TouchableOpacity>
                            <Text style={styles.viewAllAttendees}>View all attendees</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Capacity Warning */}
                    {event.capacity && event.attendees / event.capacity > 0.8 && (
                        <View style={styles.capacityWarning}>
                            <Text style={styles.capacityWarningTitle}>⚠️ Limited Spots</Text>
                            <Text style={styles.capacityWarningText}>
                                Only {event.capacity - event.attendees} spots remaining! Register soon to secure your place.
                            </Text>
                        </View>
                    )}
                </View>
            </View>

            <Toast />
        </ScrollView>
    );
}

/* ----------------------------- Styles ------------------------------ */

const { width } = Dimensions.get("window");
const photoTileSize = Math.floor((width - 48) / 3); // 16 padding each side + gaps

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    containerLight: {
        backgroundColor: "#ffffff",
    },
    containerDark: {
        backgroundColor: "#0b0b0b",
    },
    contentContainer: {
        paddingBottom: 40,
    },

    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingTop: 12,
        marginBottom: 8,
    },
    iconButton: {
        padding: 8,
        borderRadius: 8,
    },
    headerSpacer: {
        flex: 1,
    },

    heroWrapper: {
        height: 220,
        marginHorizontal: 16,
        borderRadius: 16,
        overflow: "hidden",
        marginBottom: 16,
    },
    heroImage: {
        width: "100%",
        height: "100%",
    },
    heroOverlay: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        top: 0,
        backgroundColor: "rgba(0,0,0,0.35)",
    },
    heroTextWrap: {
        position: "absolute",
        left: 14,
        right: 14,
        bottom: 14,
    },
    categoryRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
        gap: 8 as any,
    },
    categoryBadge: {
        backgroundColor: "rgba(255,255,255,0.12)",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.18)",
    },
    categoryBadgeText: {
        color: "#fff",
        fontSize: 12,
    },
    trendingBadge: {
        backgroundColor: "transparent",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
    },
    trendingBadgeText: {
        color: "#fff",
        fontSize: 12,
    },
    heroTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#fff",
    },

    actionsGrid: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: 16,
        gap: 8 as any,
        marginBottom: 16,
    },
    actionButton: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 12,
        marginHorizontal: 4,
        borderRadius: 12,
        gap: 8 as any,
    },
    actionNeutral: {
        backgroundColor: "#f3f4f6",
    },
    actionPrimaryGreen: {
        backgroundColor: "#16a34a",
    },
    actionPrimaryBlue: {
        backgroundColor: "#2563eb",
    },
    actionText: {
        marginLeft: 6,
        fontWeight: "600",
        color: "#111",
    },
    actionTextPrimary: {
        color: "#fff",
    },

    section: {
        paddingHorizontal: 16,
    },
    card: {
        borderRadius: 14,
        padding: 16,
        marginBottom: 16,
    },
    cardLight: {
        backgroundColor: "#ffffff",
        borderWidth: 1,
        borderColor: "#e6e6e6",
    },
    cardDark: {
        backgroundColor: "#0f1724",
        borderWidth: 1,
        borderColor: "#1f2937",
    },

    sectionTitle: {
        fontSize: 16,
        fontWeight: "700",
        marginBottom: 12,
    },

    infoRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 12 as any,
        marginBottom: 12,
    },
    infoIconWrap: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: "rgba(124,58,237,0.1)",
        alignItems: "center",
        justifyContent: "center",
    },
    infoContent: {
        flex: 1,
    },
    infoLabel: {
        fontSize: 12,
        color: "#6b7280",
    },
    infoPrimary: {
        fontSize: 15,
        fontWeight: "600",
        marginTop: 2,
    },
    infoSecondary: {
        color: "#9ca3af",
        marginTop: 2,
    },

    mapLinkRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 6,
    },
    mapLinkText: {
        color: "#7c3aed",
        marginRight: 6,
        fontSize: 13,
    },

    paragraph: {
        lineHeight: 20,
    },

    textDark: {
        color: "#0b0b0b",
    },
    textLight: {
        color: "#ffffff",
    },
    textMutedLight: {
        color: "#6b7280",
    },
    textMutedDark: {
        color: "#9ca3af",
    },

    scheduleWrap: {
        marginTop: 4,
    },
    scheduleRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 12,
    },
    scheduleMarkerColumn: {
        width: 24,
        alignItems: "center",
    },
    scheduleDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#7c3aed",
    },
    scheduleLine: {
        width: 2,
        flex: 1,
        backgroundColor: "#e5e7eb",
        marginTop: 8,
    },
    scheduleContent: {
        flex: 1,
        paddingLeft: 12,
        paddingBottom: 8,
    },
    scheduleTime: {
        color: "#7c3aed",
        fontWeight: "700",
        marginBottom: 4,
    },
    scheduleActivity: {
        fontSize: 15,
    },

    photosHeaderRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    viewAllText: {
        color: "#7c3aed",
        fontSize: 13,
    },
    photoTile: {
        width: photoTileSize,
        height: photoTileSize,
        marginBottom: 8,
        marginRight: 8,
        borderRadius: 10,
        overflow: "hidden",
    },
    photoImage: {
        width: "100%",
        height: "100%",
    },

    textArea: {
        minHeight: 80,
        borderRadius: 12,
        padding: 12,
        marginBottom: 8,
        textAlignVertical: "top",
    },
    inputLight: {
        backgroundColor: "#f8fafc",
        color: "#111827",
        borderWidth: 1,
        borderColor: "#e6e6e6",
    },
    inputDark: {
        backgroundColor: "#020617",
        color: "#fff",
        borderWidth: 1,
        borderColor: "#1f2937",
    },
    postButton: {
        alignSelf: "flex-start",
        backgroundColor: "#7c3aed",
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 10,
        marginBottom: 12,
    },
    postButtonText: {
        color: "#fff",
        fontWeight: "700",
    },

    commentsList: {},
    noCommentsText: {
        textAlign: "center",
        color: "#9ca3af",
        paddingVertical: 16,
    },
    commentRow: {
        flexDirection: "row",
        gap: 12 as any,
        marginBottom: 12,
    },
    commentAvatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "#e6e6e6",
    },
    commentContent: {
        flex: 1,
    },
    commentHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 6,
    },
    commentUser: {
        fontWeight: "700",
    },
    commentTime: {
        color: "#9ca3af",
        fontSize: 12,
    },
    commentText: {
        color: "#6b7280",
    },

    sidebarStack: {
        // stacked cards for mobile
    },

    organizerRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12 as any,
        marginBottom: 12,
    },
    organizerAvatar: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: "#e6e6e6",
    },
    organizerInfo: {
        flex: 1,
    },
    organizerName: {
        fontWeight: "700",
    },
    organizerSubtitle: {
        color: "#6b7280",
        fontSize: 13,
    },
    contactButton: {
        marginTop: 6,
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
        gap: 8 as any,
    },
    contactButtonLight: {
        backgroundColor: "#f3f4f6",
    },
    contactButtonDark: {
        backgroundColor: "#071025",
    },
    contactButtonText: {
        fontWeight: "700",
    },

    attendeesRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    attendeeAvatarPlaceholder: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: -10,
        borderWidth: 2,
        borderColor: "#fff",
        backgroundColor: "linear-gradient(90deg,#a78bfa,#f472b6)" as any, // RN doesn't support linear-gradient natively; left as placeholder
    },
    attendeeMore: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#e6e6e6",
        alignItems: "center",
        justifyContent: "center",
    },
    attendeeMoreText: {
        fontSize: 12,
        color: "#6b7280",
    },
    viewAllAttendees: {
        color: "#7c3aed",
        fontSize: 13,
    },

    capacityWarning: {
        backgroundColor: "#fff7ed",
        borderRadius: 14,
        padding: 16,
        borderWidth: 1,
        borderColor: "#ffedd5",
        marginBottom: 16,
    },
    capacityWarningTitle: {
        color: "#9a3412",
        fontWeight: "800",
        marginBottom: 6,
    },
    capacityWarningText: {
        color: "#92400e",
    },
});
