import { Dimensions, StyleSheet } from "react-native";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export const styles = StyleSheet.create({
    overlay: {
        position: "absolute",
        inset: 0,
    },

    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.5)",
    },

    modalContainer: {
        width: "100%",
        maxHeight: SCREEN_HEIGHT * 0.7,
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
        borderColor: "#E5E7EB",
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
        borderColor: "#E5E7EB",
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
