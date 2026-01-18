import { Feather } from "@expo/vector-icons";
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, RefreshControl, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getCampaignsList } from '../../api/campaigns/campaigns';
import { CampaignType, ICampaign } from '../../interface/campaign.interface';
import { FeaturedCarousel } from '../FeaturedCarousel';
import { CampaignCard } from './CampaignCard';
import { styles } from './CampaignFeed.styles';
import { CampaignFeedProps, SortOption } from './CampaignFeed.types';
import { CampaignFeedFilters } from './CampaignFeedFilters';
import { CampaignFeedHeader } from './CampaignFeedHeader';
import { CampaignFeedSearchBar } from './CampaignFeedSearchBar';

export function CampaignFeed({ onViewCampaign, onCreateCampaign, initialType }: CampaignFeedProps) {
    const [campaigns, setCampaigns] = useState<ICampaign[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [selectedType, setSelectedType] = useState<CampaignType | 'all'>(initialType as CampaignType || 'all');

    useEffect(() => {
        if (initialType) {
            setSelectedType(initialType as CampaignType);
        }
    }, [initialType]);

    useFocusEffect(
        useCallback(() => {
            return () => {
                setSelectedType('all');
            };
        }, [])
    );
    const [sortBy, setSortBy] = useState<SortOption>('deadline');
    const [isLoading, setIsLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

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


    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <CampaignFeedHeader onCreate={onCreateCampaign} />

                <CampaignFeedSearchBar value={searchQuery} onChange={setSearchQuery} />


                <CampaignFeedFilters
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
        </SafeAreaView>
    );
}
