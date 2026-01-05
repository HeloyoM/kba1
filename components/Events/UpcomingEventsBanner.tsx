import Feather from "@expo/vector-icons/Feather";
import React from 'react';
import { Text, View } from 'react-native';
import { styles } from "./EventFeed.styles";

interface UpcomingEventsBannerProps {
    count: number;
}

export const UpcomingEventsBanner: React.FC<UpcomingEventsBannerProps> = ({ count }) => {
    if (count === 0) return null;

    const suffix = count === 1 ? "" : "s";

    return (
        <View style={styles.bannerContainer}>
            <View style={styles.bannerContent}>
                <View style={styles.bannerIconContainer}>
                    <Feather name="bell" size={20} color="#a855f7" />
                </View>
                <View style={styles.bannerTextContainer}>
                    <Text style={styles.bannerTitle}>Upcoming Events</Text>
                    <Text style={styles.bannerSubtitle}>
                        You have {count} upcoming event{suffix}.
                    </Text>
                </View>
            </View>
        </View>
    );
};
