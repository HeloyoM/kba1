import { Feather } from "@expo/vector-icons";
import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

interface CampaignFeedSearchBarProps {
    value: string;
    onChange: (text: string) => void;
}

export function CampaignFeedSearchBar({ value, onChange }: CampaignFeedSearchBarProps) {
    return (
        <View style={styles.searchContainer}>
            <Feather name="search" size={18} color="#999" style={styles.searchIcon} />
            <TextInput
                style={styles.searchInput}
                placeholder="Search campaigns..."
                value={value}
                onChangeText={onChange}
                placeholderTextColor="#999"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 12,
        marginBottom: 10
    },
    searchIcon: {
        position: 'absolute',
        left: 8,
        zIndex: 1
    },
    searchInput: {
        flex: 1,
        height: 36,
        fontSize: 14,
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingLeft: 32,
        paddingRight: 10,
        borderWidth: 1,
        borderColor: '#ccc',
    },
});
