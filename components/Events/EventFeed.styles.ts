import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: "#ffffff",
    },
    bannerContainer: {
        padding: 12,
        marginBottom: 16,
        backgroundColor: "#faf1ff",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#d8b4fe",
    },
    bannerContent: {
        flexDirection: "row",
        gap: 12,
    },
    bannerIconContainer: {
        padding: 10,
        backgroundColor: "#f3e8ff",
        borderRadius: 10,
    },
    bannerTextContainer: {
        flex: 1,
    },
    bannerTitle: {
        color: "#111",
        fontSize: 16,
    },
    bannerSubtitle: {
        marginTop: 4,
        color: "#555",
        fontSize: 13,
    },
    searchContainer: {
        position: "relative",
        marginBottom: 16,
    },
    searchIcon: {
        position: "absolute",
        left: 12,
        top: 14,
    },
    searchInput: {
        backgroundColor: "#f3f3f3",
        borderWidth: 1,
        borderColor: "#ddd",
        paddingVertical: 12,
        paddingLeft: 42,
        paddingRight: 12,
        borderRadius: 10,
        color: "#111",
    },
    viewModeContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginBottom: 16,
    },
    viewModeButton: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: "transparent",
    },
    viewModeButtonActive: {
        backgroundColor: "#fff",
        borderColor: "#a855f7",
    },
    viewModeText: {
        marginLeft: 6,
        color: "#333",
    },
    viewModeTextActive: {
        color: "#a855f7",
    },
    resultsCountText: {
        marginBottom: 12,
        color: "#555",
    },
    emptyStateContainer: {
        alignItems: "center",
        padding: 40,
    },
    emptyStateTitle: {
        color: "#111",
        marginTop: 12,
    },
    emptyStateSubtitle: {
        color: "#666",
        marginTop: 4,
    },
});
