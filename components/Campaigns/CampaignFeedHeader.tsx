import { useDemo } from '@/context/demo.context';
import { Feather } from "@expo/vector-icons";
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface CampaignFeedHeaderProps {
    onCreate: () => void;
}

export function CampaignFeedHeader({ onCreate }: CampaignFeedHeaderProps) {
    const { registerLayout } = useDemo();
    return (
        <View style={styles.header}>
            <Text
                style={styles.title}
                onLayout={(e) => {
                    const layout = e.nativeEvent.layout;
                    registerLayout('community_header', {
                        x: layout.x,
                        y: layout.y + 110, // Approximate header offset
                        width: layout.width,
                        height: layout.height
                    });
                }}
            >
                Campaigns
            </Text>
            <TouchableOpacity
                style={styles.createButton}
                onPress={onCreate}
                onLayout={(e) => {
                    const layout = e.nativeEvent.layout;
                    registerLayout('community_new_campaign', {
                        x: layout.x + 200, // Adjust for parent alignment
                        y: layout.y + 110,
                        width: layout.width,
                        height: layout.height
                    });
                }}
            >
                <Feather name="plus" size={18} color="#fff" />
                <Text style={styles.createButtonText}>New Campaign</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111'
    },
    createButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2563EB',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 16,
    },
    createButtonText: {
        color: '#fff',
        marginLeft: 4,
        fontSize: 13,
        fontWeight: '600'
    },
});
