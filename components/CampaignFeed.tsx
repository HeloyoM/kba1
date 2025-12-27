import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, FlatList, Pressable } from 'react-native';
import { Feather } from "@expo/vector-icons";
import { FeaturedCarousel } from './FeaturedCarousel';
import { CampaignCard } from './CampaignCard';
import { CampaignType, ICampaign } from '@/interface/campaign.interface';
import { getCampaignsList, migrationFunc } from '@/api/campaigns/campaigns';

interface CampaignFeedProps {
    onViewCampaign: (campaign: ICampaign) => void;
    onCreateCampaign: () => void;
}

type SortOption = 'deadline' | 'popularity' | 'recent';

export function CampaignFeed({ onViewCampaign, onCreateCampaign }: CampaignFeedProps) {
    const [campaigns, setCampaigns] = useState<ICampaign[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [selectedType, setSelectedType] = useState<CampaignType | 'all'>('all');
    const [sortBy, setSortBy] = useState<SortOption>('deadline');
    const featuredCampaigns = campaigns.filter((c: ICampaign) => c.featured);


    useEffect(() => {
        if (campaigns.length) return

        else {
            fetchCampaigns()
        }
    }, [campaigns])

    const fetchCampaigns = async () => {
        try {
            const campaignsList = await getCampaignsList();

            if (campaignsList) {
                setCampaigns(campaignsList)
            }
        } catch (error) {

        }
    }

    const filteredCampaigns = campaigns.filter((campaign: ICampaign) => {
        const matchesSearch =
            campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            campaign.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            campaign.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesType = selectedType === 'all' || campaign.type === selectedType;
        return matchesSearch && matchesType;
    });

    const sortedCampaigns = [...filteredCampaigns].sort((a, b) => {
        if (sortBy === 'deadline') {
            return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
        } else if (sortBy === 'popularity') {
            return b.participants.length - a.participants.length;
        }
        return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
    });

    //     const trendingCampaigns = mockCampaigns.filter((c: Campaign) => c.trending);
    const urgentCampaigns = campaigns.filter((c: ICampaign) => c.urgent);

    const campaignTypes: Array<{ value: CampaignType | 'all'; label: string }> = [
        { value: 'all', label: 'All' },
        { value: 'donate', label: 'Donate' },
        { value: 'volunteer', label: 'Volunteer' },
        { value: 'awareness', label: 'Awareness' },
        { value: 'petition', label: 'Petition' },
        { value: 'event', label: 'Event' },
    ];

    return (
        <ScrollView style={{ flex: 1, backgroundColor: '#f8f8f8' }}>

            <View style={styles.header}>
                <Text style={styles.title}>Campaigns</Text>
                <TouchableOpacity style={styles.createButton} onPress={onCreateCampaign}>
                    <Feather name="plus" size={18} color="#fff" />
                    <Text style={styles.createButtonText}>New Campaign</Text>
                </TouchableOpacity>
            </View>


            <View style={styles.searchContainer}>
                <Feather name="search" size={18} color="#999" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search campaigns..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            <TouchableOpacity style={styles.filterToggle} onPress={() => setShowFilters(!showFilters)}>
                <Feather name="filter" size={16} color="#333" />
                <Text style={styles.filterToggleText}>Filters</Text>
            </TouchableOpacity>


            {showFilters && (
                <View style={styles.filtersContainer}>
                    <Text style={styles.filterLabel}>Type</Text>

                    <View style={styles.filterOptions}>
                        {campaignTypes.map(type => (
                            <TouchableOpacity
                                key={type.value}
                                style={[
                                    styles.filterButton,
                                    selectedType === type.value && styles.filterButtonSelected,
                                ]}
                                onPress={() => setSelectedType(type.value)}
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
                        {(['deadline', 'popularity', 'recent'] as SortOption[]).map(option => (
                            <TouchableOpacity
                                key={option}
                                style={[styles.filterButton, sortBy === option && styles.filterButtonSelected]}
                                onPress={() => setSortBy(option)}
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
                </View >
            )}

            {featuredCampaigns.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Featured Campaigns</Text>
                    <FeaturedCarousel campaigns={featuredCampaigns} onViewCampaign={onViewCampaign} />
                </View>
            )}


            {urgentCampaigns.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Urgent Campaigns</Text>
                    <FlatList
                        data={urgentCampaigns}
                        keyExtractor={item => item.id}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item }) => (
                            <CampaignCard campaign={item} onClick={() => onViewCampaign(item)} />
                        )}
                    />
                </View>
            )}

        </ScrollView >
    );
}

const styles = StyleSheet.create({
    container: {},
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    title: { fontSize: 24, fontWeight: 'bold', color: '#111' },
    createButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2563EB',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
    },
    createButtonText: { color: '#fff', marginLeft: 6, fontWeight: '600' },

    searchContainer: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginBottom: 12 },
    searchIcon: { position: 'absolute', left: 10 },
    searchInput: {
        flex: 1,
        height: 40,
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingLeft: 36,
        paddingRight: 12,
        borderWidth: 1,
        borderColor: '#ccc',
    },

    filterToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
        backgroundColor: '#e5e7eb',
        padding: 8,
        borderRadius: 12,
        marginBottom: 8,
    },
    filterToggleText: { marginLeft: 6, fontWeight: '500', color: '#333' },

    filtersContainer: { marginHorizontal: 16, backgroundColor: '#fff', padding: 12, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#ccc' },
    filterLabel: { fontWeight: '600', marginBottom: 8 },
    filterOptions: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 },
    filterButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        backgroundColor: '#f3f4f6',
        marginRight: 8,
        marginBottom: 8,
    },
    filterButtonSelected: { backgroundColor: '#2563EB' },
    filterButtonText: { color: '#333' },
    filterButtonTextSelected: { color: '#fff' },

    section: { marginBottom: 24, paddingHorizontal: 16 },
    sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
    noCampaignsText: { textAlign: 'center', color: '#777', paddingVertical: 16 },
});
