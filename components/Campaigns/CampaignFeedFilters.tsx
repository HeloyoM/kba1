import { CampaignType } from '@/interface/campaign.interface';
import { Feather } from "@expo/vector-icons";
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CAMPAIGN_TYPES, SORT_OPTIONS } from './CampaignFeed.constants';
import { SortOption } from './CampaignFeed.types';

interface CampaignFeedFiltersProps {
    showFilters: boolean;
    onToggleFilters: () => void;
    selectedType: CampaignType | 'all';
    onSelectType: (type: CampaignType | 'all') => void;
    sortBy: SortOption;
    onSortChange: (sort: SortOption) => void;
}

export function CampaignFeedFilters({
    showFilters,
    onToggleFilters,
    selectedType,
    onSelectType,
    sortBy,
    onSortChange
}: CampaignFeedFiltersProps) {
    return (
        <>
            <TouchableOpacity style={styles.filterToggle} onPress={onToggleFilters}>
                <Feather name="filter" size={16} color="#333" />
                <Text style={styles.filterToggleText}>Filters</Text>
            </TouchableOpacity>

            {showFilters && (
                <View style={styles.filtersContainer}>
                    <Text style={styles.filterLabel}>Type</Text>
                    <View style={styles.filterOptions}>
                        {CAMPAIGN_TYPES.map(type => (
                            <TouchableOpacity
                                key={type.value}
                                style={[
                                    styles.filterButton,
                                    selectedType === type.value && styles.filterButtonSelected,
                                ]}
                                onPress={() => onSelectType(type.value)}
                            >
                                <Text
                                    style={[
                                        styles.filterButtonText,
                                        selectedType === type.value && styles.filterButtonTextSelected,
                                    ]}
                                >
                                    {type.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Text style={styles.filterLabel}>Sort by</Text>
                    <View style={styles.filterOptions}>
                        {SORT_OPTIONS.map(option => (
                            <TouchableOpacity
                                key={option}
                                style={[styles.filterButton, sortBy === option && styles.filterButtonSelected]}
                                onPress={() => onSortChange(option)}
                            >
                                <Text
                                    style={[
                                        styles.filterButtonText,
                                        sortBy === option && styles.filterButtonTextSelected,
                                    ]}
                                >
                                    {option.charAt(0).toUpperCase() + option.slice(1)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    filterToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 12,
        backgroundColor: '#e5e7eb',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 10,
        marginBottom: 8,
        alignSelf: 'flex-start'
    },
    filterToggleText: {
        marginLeft: 4,
        fontSize: 13,
        fontWeight: '500',
        color: '#333'
    },
    filtersContainer: {
        marginHorizontal: 12,
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ccc'
    },
    filterLabel: {
        fontSize: 13,
        fontWeight: '600',
        marginBottom: 6
    },
    filterOptions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 8
    },
    filterButton: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 16,
        backgroundColor: '#f3f4f6',
        marginRight: 6,
        marginBottom: 6,
    },
    filterButtonSelected: {
        backgroundColor: '#2563EB'
    },
    filterButtonText: {
        fontSize: 12,
        color: '#333'
    },
    filterButtonTextSelected: {
        color: '#fff'
    },
});
