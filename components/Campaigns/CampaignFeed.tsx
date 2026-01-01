import { getCampaignsList } from '@/api/campaigns/campaigns';
import { CampaignType, ICampaign } from '@/interface/campaign.interface';
import { Feather } from "@expo/vector-icons";
import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, RefreshControl, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { FeaturedCarousel } from '../FeaturedCarousel';
import { CampaignCard } from './CampaignCard';

// --- Types & Interfaces ---

interface CampaignFeedProps {
    onViewCampaign: (campaign: ICampaign) => void;
    onCreateCampaign: () => void;
}

type SortOption = 'deadline' | 'popularity' | 'recent';

interface FilterOption {
    value: CampaignType | 'all';
    label: string;
}

// --- Constants ---

const CAMPAIGN_TYPES: FilterOption[] = [
    { value: 'all', label: 'All' },
    { value: 'donate', label: 'Donate' },
    { value: 'volunteer', label: 'Volunteer' },
    { value: 'awareness', label: 'Awareness' },
    { value: 'petition', label: 'Petition' },
    { value: 'event', label: 'Event' },
];

const SORT_OPTIONS: SortOption[] = ['deadline', 'popularity', 'recent'];

// --- Sub-Components ---

const Header = ({ onCreate }: { onCreate: () => void }) => (
    <View style={styles.header}>
        <Text style={styles.title}>Campaigns</Text>
        <TouchableOpacity style={styles.createButton} onPress={onCreate}>
            <Feather name="plus" size={18} color="#fff" />
            <Text style={styles.createButtonText}>New Campaign</Text>
        </TouchableOpacity>
    </View>
);

const SearchBar = ({
    value,
    onChange
}: {
    value: string;
    onChange: (text: string) => void;
}) => (
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

const FilterSection = ({
    showFilters,
    onToggleFilters,
    selectedType,
    onSelectType,
    sortBy,
    onSortChange
}: {
    showFilters: boolean;
    onToggleFilters: () => void;
    selectedType: CampaignType | 'all';
    onSelectType: (type: CampaignType | 'all') => void;
    sortBy: SortOption;
    onSortChange: (sort: SortOption) => void;
}) => (
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

// --- Main Component ---

export function CampaignFeed({ onViewCampaign, onCreateCampaign }: CampaignFeedProps) {
    // 1. State
    const [campaigns, setCampaigns] = useState<ICampaign[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [selectedType, setSelectedType] = useState<CampaignType | 'all'>('all');
    const [sortBy, setSortBy] = useState<SortOption>('deadline');
    const [isLoading, setIsLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    // 2. Effects
    useEffect(() => {
        fetchCampaigns();
    }, []);

    const fetchCampaigns = async () => {
        setIsLoading(true);
        try {
            const campaignsList = await getCampaignsList();
            if (campaignsList) {
                setCampaigns(campaignsList);
            }
        } catch (error) {
            console.error("Failed to fetch campaigns", error);
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchCampaigns();
    };

    // 3. Memoized Data
    const filteredCampaigns = useMemo(() => {
        return campaigns.filter((campaign: ICampaign) => {
            const lowerQuery = searchQuery.toLowerCase();
            const matchesSearch =
                campaign.title.toLowerCase().includes(lowerQuery) ||
                campaign.description.toLowerCase().includes(lowerQuery) ||
                campaign.tags.some(tag => tag.toLowerCase().includes(lowerQuery));

            const matchesType = selectedType === 'all' || campaign.type === selectedType;

            return matchesSearch && matchesType;
        });
    }, [campaigns, searchQuery, selectedType]);

    const sortedCampaigns = useMemo(() => {
        return [...filteredCampaigns].sort((a, b) => {
            if (sortBy === 'deadline') {
                return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
            } else if (sortBy === 'popularity') {
                return b.participants.length - a.participants.length;
            }
            // default to 'recent'
            return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
        });
    }, [filteredCampaigns, sortBy]);

    const featuredCampaigns = useMemo(() =>
        campaigns.filter((c: ICampaign) => c.featured),
        [campaigns]);

    const urgentCampaigns = useMemo(() =>
        campaigns.filter((c: ICampaign) => c.urgent),
        [campaigns]);

    // 4. Render
    return (
        <ScrollView
            style={styles.container}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            <Header onCreate={onCreateCampaign} />

            <SearchBar value={searchQuery} onChange={setSearchQuery} />

            <FilterSection
                showFilters={showFilters}
                onToggleFilters={() => setShowFilters(prev => !prev)}
                selectedType={selectedType}
                onSelectType={setSelectedType}
                sortBy={sortBy}
                onSortChange={setSortBy}
            />

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
                            <CampaignCard campaign={item} onPress={() => onViewCampaign(item)} />
                        )}
                    />
                </View>
            )}

            {!isLoading && campaigns.length === 0 && (
                <View style={styles.emptyContainer}>
                    <Feather name="inbox" size={48} color="#ccc" style={{ marginBottom: 12 }} />
                    <Text style={styles.emptyText}>No campaigns found</Text>
                    <Text style={styles.emptySubText}>Pull down to refresh the list</Text>
                </View>
            )}
        </ScrollView>
    );
}

// --- Styles ---

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#111'
    },
    createButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2563EB',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
    },
    createButtonText: {
        color: '#fff',
        marginLeft: 6,
        fontWeight: '600'
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
        marginBottom: 12
    },
    searchIcon: {
        position: 'absolute',
        left: 10,
        zIndex: 1
    },
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
        alignSelf: 'flex-start'
    },
    filterToggleText: {
        marginLeft: 6,
        fontWeight: '500',
        color: '#333'
    },
    filtersContainer: {
        marginHorizontal: 16,
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#ccc'
    },
    filterLabel: {
        fontWeight: '600',
        marginBottom: 8
    },
    filterOptions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 12
    },
    filterButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        backgroundColor: '#f3f4f6',
        marginRight: 8,
        marginBottom: 8,
    },
    filterButtonSelected: {
        backgroundColor: '#2563EB'
    },
    filterButtonText: {
        color: '#333'
    },
    filterButtonTextSelected: {
        color: '#fff'
    },
    section: {
        marginBottom: 24,
        paddingHorizontal: 16
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
        marginTop: 20,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#555',
        marginBottom: 4,
    },
    emptySubText: {
        fontSize: 14,
        color: '#999',
    },
});
