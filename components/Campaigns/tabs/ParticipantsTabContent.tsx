import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { ImageWithFallback } from '../../ImageWithFallback';

interface Participant {
    id: string;
    name: string;
    avatar: string;
    contribution?: string;
}

interface ParticipantsTabContentProps {
    participants: Participant[];
}

const PARTICIPANTS_TAB_TEXT = {
    CONTRIBUTED_LABEL: 'Contributed:',
};

export function ParticipantsTabContent({ participants, header }: ParticipantsTabContentProps & { header: React.ReactNode }) {
    return (
        <FlatList
            ListHeaderComponent={<>{header}</>}
            data={participants}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
                <View style={styles.participantRow}>
                    <ImageWithFallback
                        source={{ uri: item.avatar }}
                        style={styles.participantAvatar}
                    />
                    <View>
                        <Text style={styles.participantName}>{item.name}</Text>
                        {item.contribution && (
                            <Text style={styles.participantContribution}>
                                {PARTICIPANTS_TAB_TEXT.CONTRIBUTED_LABEL} {item.contribution}
                            </Text>
                        )}
                    </View>
                </View>
            )}
        />
    );
}

const styles = StyleSheet.create({
    participantRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderColor: '#e5e7eb',
    },
    participantAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 12,
    },
    participantName: {
        fontWeight: 'bold',
        color: '#333',
    },
    participantContribution: {
        color: '#555',
    },
});
