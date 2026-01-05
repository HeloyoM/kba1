import Feather from "@expo/vector-icons/Feather";
import React from 'react';
import { Text, View } from 'react-native';
import { styles } from "./EventFeed.styles";

export const EventEmptyState: React.FC = () => {
    return (
        <View style={styles.emptyStateContainer}>
            <Feather name="calendar" size={40} color={"#bbb"} />
            <Text style={styles.emptyStateTitle}>No events found</Text>
            <Text style={styles.emptyStateSubtitle}>Try adjusting your filters or search query</Text>
        </View>
    );
};
