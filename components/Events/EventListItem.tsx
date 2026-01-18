import { IEvent } from '@/interface/events.interface';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface EventListItemProps {
    event: IEvent;
    onPress: (event: IEvent) => void;
}

export const EventListItem: React.FC<EventListItemProps> = ({ event, onPress }) => {
    return (
        <TouchableOpacity
            onPress={() => onPress(event)}
            style={styles.container}
        >
            <Text style={styles.title}>
                {event.title}
            </Text>
            <Text style={styles.details}>
                {event.date && typeof event.date.toDate === 'function' ? event.date.toDate().toLocaleDateString() : 'Invalid Date'} — {event.location}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: "#fafafa",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#eee",
    },
    title: {
        color: "#111",
        fontSize: 16,
        marginBottom: 4,
    },
    details: {
        color: "#666",
    },
});
