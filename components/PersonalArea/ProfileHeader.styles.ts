import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        borderRadius: 16,
        margin: 12,
        paddingBottom: 20,
        overflow: "hidden",
        elevation: 2,
    },
    cover: {
        height: 90,
        backgroundColor: "#a855f7",
    },
    avatarWrapper: {
        alignSelf: "center",
        marginTop: -40,
    },
    avatar: {
        width: 90,
        height: 90,
        borderRadius: 50,
        borderWidth: 4,
        borderColor: "#fff",
    },
    cameraBtn: {
        position: "absolute",
        bottom: 0,
        right: 0,
        backgroundColor: "#7c3aed",
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
    },
    nameSection: {
        marginTop: 8,
    },
    bioSection: {
        marginTop: 10,
        padding: 8,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        padding: 8,
    },
    name: {
        fontSize: 20,
        fontWeight: "600",
        color: "#000",
    },
    username: {
        color: "#777",
        marginTop: 2,
        padding: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 8,
        flex: 1,
    },
    bioInput: {
        height: 80,
    },
    bioButtonsRow: {
        marginTop: 8,
    },
    bio: {
        flex: 1,
        color: "#444",
    },
    saveBtn: {
        backgroundColor: "#7c3aed",
        padding: 10,
        borderRadius: 8,
    },
    cancelBtn: {
        backgroundColor: "#eee",
        padding: 10,
        borderRadius: 8,
    },
    whiteText: {
        color: "#fff",
    },
    cancelText: {
        color: "#555",
    },
});
