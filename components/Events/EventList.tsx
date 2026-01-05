import { IEvent } from '@/interface/events.interface';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { EventListItem } from './EventListItem';

interface EventListProps {
    events: IEvent[];
    onEventClick: (event: IEvent) => void;
}

export const EventList: React.FC<EventListProps> = ({ events, onEventClick }) => {
    return (
        <View style={styles.container}>
            {events.map((event) => (
                <EventListItem
                    key={event.id}
                    event={event}
                    onPress={onEventClick}
                />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        gap: 16,
    },
});
