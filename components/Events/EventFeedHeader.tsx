import Feather from "@expo/vector-icons/Feather";
import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { styles } from "./EventFeed.styles";
import { ViewMode } from "./useEvents";

interface EventFeedHeaderProps {
    searchQuery: string;
    onSearchChange: (text: string) => void;
    viewMode: ViewMode;
    onViewModeChange: (mode: ViewMode) => void;
}

export const EventFeedHeader: React.FC<EventFeedHeaderProps> = ({
    searchQuery,
    onSearchChange,
    viewMode,
    onViewModeChange
}) => {
    return (
        <View>
            <View style={styles.searchContainer}>
                <Feather name="search" size={20} color={"#999"} style={styles.searchIcon} />
                <TextInput
                    placeholder="Search events..."
                    placeholderTextColor={"#999"}
                    value={searchQuery}
                    onChangeText={onSearchChange}
                    style={styles.searchInput}
                />
            </View>

            <View style={styles.viewModeContainer}>
                <TouchableOpacity
                    onPress={() => onViewModeChange("list")}
                    style={[styles.viewModeButton, viewMode === "list" && styles.viewModeButtonActive]}
                >
                    <Feather name="grid" size={18} color={viewMode === "list" ? "#a855f7" : "#555"} />
                    <Text style={[styles.viewModeText, viewMode === "list" && styles.viewModeTextActive]}>List</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => onViewModeChange("calendar")}
                    style={[styles.viewModeButton, viewMode === "calendar" && styles.viewModeButtonActive]}
                >
                    <Feather name="calendar" size={18} color={viewMode === "calendar" ? "#a855f7" : "#555"} />
                    <Text style={[styles.viewModeText, viewMode === "calendar" && styles.viewModeTextActive]}>Calendar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};
