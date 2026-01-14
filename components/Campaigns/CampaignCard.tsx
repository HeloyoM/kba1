import React, { memo } from 'react';
import { ImageStyle, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';

import { ICampaign } from '@/interface/campaign.interface';
import { ImageWithFallback } from '../ImageWithFallback';
import { IconSymbol } from '../ui/icon-symbol';
import { calculateProgress } from './campaignHelpers';
import { CampaignProgress } from './CampaignProgress';

// --- Constants ---

const STATUS_COLORS: Record<string, string> = {
    active: '#22c55e',
    completed: '#6b7280',
    upcoming: '#3b82f6',
};

const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
    donate: { bg: '#d1fae5', text: '#15803d' },
    volunteer: { bg: '#dbeafe', text: '#1d4ed8' },
    awareness: { bg: '#ede9fe', text: '#6b21a8' },
    petition: { bg: '#ffedd5', text: '#c2410c' },
    event: { bg: '#fce7f3', text: '#be185d' },
};

const DEFAULT_STATUS_COLOR = '#6b7280';
const DEFAULT_TYPE_COLOR = { bg: '#f3f4f6', text: '#374151' };

// --- Helper Functions ---

const getStatusColor = (status: string) => STATUS_COLORS[status] || DEFAULT_STATUS_COLOR;
const getTypeColor = (type: string) => TYPE_COLORS[type] || DEFAULT_TYPE_COLOR;
const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

// --- Component ---

interface CampaignCardProps {
    campaign: ICampaign;
    onPress: () => void;
}

export const CampaignCard = memo(function CampaignCard({ campaign, onPress }: CampaignCardProps) {
    const progress = calculateProgress(campaign.current, campaign.goal);
    const typeColor = getTypeColor(campaign.type);
    const statusColor = getStatusColor(campaign.status);

    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>

            <View style={styles.imageContainer}>
                <ImageWithFallback
                    source={{ uri: campaign.image }}
                    style={styles.image}
                />

                <View style={[styles.statusDot, { backgroundColor: statusColor }]} />

                <View style={styles.badgesContainer}>
                    <View style={[styles.badge, { backgroundColor: typeColor.bg }]}>
                        <Text style={[styles.badgeText, { color: typeColor.text }]}>
                            {capitalize(campaign.type)}
                        </Text>
                    </View>

                    {campaign.trending && (
                        <View style={[styles.badge, styles.trendingBadge]}>
                            <IconSymbol name="arrow.up.forward.and.arrow.down.backward" size={12} color="#b45309" />
                            <Text style={[styles.badgeText, styles.trendingText]}>Trending</Text>
                        </View>
                    )}

                    {campaign.urgent && (
                        <View style={[styles.badge, styles.urgentBadge]}>
                            <IconSymbol name="alarm.fill" size={12} color="#b91c1c" />
                            <Text style={[styles.badgeText, styles.urgentText]}>Urgent</Text>
                        </View>
                    )}
                </View>
            </View>


            <View style={styles.content}>
                <Text style={styles.title} numberOfLines={2}>{campaign.title}</Text>
                <Text style={styles.description} numberOfLines={2}>{campaign.description}</Text>


                {campaign.goal && campaign.current !== undefined && (
                    <View style={styles.progressContainer}>
                        <View style={styles.progressHeader}>
                            <Text style={styles.progressText}>
                                {campaign.current.toLocaleString()} {campaign.unit}
                            </Text>
                            <Text style={styles.progressTextSecondary}>
                                {progress.toFixed(0)}%
                            </Text>
                        </View>
                        <CampaignProgress percent={progress} height={6} />
                        <Text style={styles.progressGoal}>
                            Goal: {campaign.goal.toLocaleString()} {campaign.unit}
                        </Text>
                    </View>
                )}


                <View style={styles.metaContainer}>
                    <View style={styles.metaItem}>
                        <IconSymbol name="calendar" size={14} color="#4b5563" />
                        <Text style={styles.metaText}>{campaign.deadline}</Text>
                    </View>
                    <View style={styles.metaItem}>
                        <IconSymbol name='rectangle.3.group.fill' size={14} color="#4b5563" />
                        <Text style={styles.metaText}>{campaign.participants.length}</Text>
                    </View>
                </View>

                {/* Tags */}
                <View style={styles.tagsContainer}>
                    {campaign.tags.slice(0, 3).map(tag => (
                        <View key={tag} style={styles.tag}>
                            <Text style={styles.tagText}>#{tag}</Text>
                        </View>
                    ))}
                </View>
            </View>
        </TouchableOpacity>
    );
});

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#e5e7eb',
        marginBottom: 16,
        width: 280,
        marginRight: 16,
    } as ViewStyle,
    imageContainer: {
        height: 192,
        width: '100%',
        overflow: 'hidden',
    } as ViewStyle,
    image: {
        width: '100%',
        height: '100%',
    } as ImageStyle,
    statusDot: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 12,
        height: 12,
        borderRadius: 6,
    } as ViewStyle,
    badgesContainer: {
        position: 'absolute',
        top: 8,
        left: 8,
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 4,
    } as ViewStyle,
    badge: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 12,
        marginRight: 4,
    } as ViewStyle,
    badgeText: {
        fontSize: 10,
        fontWeight: '500',
    },
    trendingBadge: {
        backgroundColor: '#fef3c7',
        flexDirection: 'row',
        alignItems: 'center',
    } as ViewStyle,
    trendingText: {
        color: '#b45309',
        marginLeft: 4,
    },
    urgentBadge: {
        backgroundColor: '#fee2e2',
        flexDirection: 'row',
        alignItems: 'center',
    } as ViewStyle,
    urgentText: {
        color: '#b91c1c',
        marginLeft: 4,
    },
    content: {
        padding: 12,
    } as ViewStyle,
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 4,
    },
    description: {
        fontSize: 14,
        color: '#6b7280',
        marginBottom: 8,
    },
    progressContainer: {
        marginBottom: 8,
    } as ViewStyle,
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 2,
    } as ViewStyle,
    progressText: {
        color: '#374151',
        fontSize: 12,
        fontWeight: '500',
    },
    progressTextSecondary: {
        color: '#6b7280',
        fontSize: 12,
    },
    progressBarBackground: {
        height: 6,
        backgroundColor: '#e5e7eb',
        borderRadius: 3,
        overflow: 'hidden',
    } as ViewStyle,
    progressBarFill: {
        height: 6,
        backgroundColor: '#3b82f6',
    } as ViewStyle,
    progressGoal: {
        fontSize: 12,
        color: '#6b7280',
        marginTop: 2,
    },
    metaContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 8,
    } as ViewStyle,
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    } as ViewStyle,
    metaText: {
        fontSize: 12,
        color: '#4b5563',
        marginLeft: 4,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 8,
        gap: 4,
    } as ViewStyle,
    tag: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        backgroundColor: '#f3f4f6',
        borderRadius: 8,
        marginRight: 4,
        marginBottom: 4,
    } as ViewStyle,
    tagText: {
        fontSize: 10,
        color: '#4b5563',
    },
});
