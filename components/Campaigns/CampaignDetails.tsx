import { deleteCampaign } from '@/api/campaigns/campaigns';
import { ICampaign } from '@/interface/campaign.interface';
import { Feather } from "@expo/vector-icons";
import React, { useState } from 'react';
import {
    Alert,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { ImageWithFallback } from '../ImageWithFallback';
import { CampaignActionButton } from './CampaignActionButton';
import { CampaignHeader } from './CampaignHeader';
import { CampaignProgress } from './CampaignProgress';
import { calculateProgress, getCampaignActionConfig } from './campaignHelpers';
import { TABS, TabId } from './tabConfig';

interface CampaignDetailsProps {
    campaign: ICampaign;
    onBack: () => void;
    onEdit: (campaign: ICampaign) => void;
}

export function CampaignDetails({ campaign, onBack, onEdit }: CampaignDetailsProps) {
    const [activeTabId, setActiveTabId] = useState<TabId>('about');
    const [commentInputText, setCommentInputText] = useState('');
    const [isLiked, setIsLiked] = useState(false);

    const progress = calculateProgress(campaign.current, campaign.goal);
    const typeIcon = getTypeIcon(campaign.type);
    const statusStyle = getStatusStyle(campaign.status);
    const primaryAction = getCampaignActionConfig(campaign.type, {
        onDonate: handleDonate,
        onParticipate: handleParticipate,
    });

    function handleParticipate() {
        Alert.alert(`You've participated in: ${campaign.title}`);
    }

    function handleDonate() {
        Alert.alert(`Opening donation form for: ${campaign.title}`);
    }

    function handleShare() {
        Alert.alert('Share', 'Share functionality not implemented.');
    }

    function handleLikeToggle() {
        setIsLiked(!isLiked);
    }

    function handleDelete() {
        Alert.alert('Delete', 'Are you sure you want to delete this campaign?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await deleteCampaign(campaign.id);
                        onBack();
                    } catch (error) {
                        console.error(error);
                        Alert.alert("Error", "Failed to delete campaign");
                    }
                }
            },
        ]);
    }

    function handlePostComment() {
        Alert.alert('Post Comment', `Posting comment: ${commentInputText}`);
        setCommentInputText('');
    }

    function getTypeIcon(type: string): React.ComponentProps<typeof Feather>['name'] {
        const icons: Record<string, React.ComponentProps<typeof Feather>['name']> = {
            donate: 'dollar-sign',
            volunteer: 'heart',
            awareness: 'bell',
            petition: 'message-circle',
            event: 'calendar',
        };
        return icons[type] || 'bell';
    }

    function getStatusStyle(status?: string) {
        switch (status) {
            case 'active':
                return styles.statusActive;
            case 'upcoming':
                return styles.statusUpcoming;
            default:
                return styles.statusDefault;
        }
    }

    const activeTab = TABS.find(tab => tab.id === activeTabId);

    const renderHeader = () => (
        <View>
            <CampaignHeader
                onBack={onBack}
                onEdit={() => onEdit(campaign)}
                onDelete={handleDelete}
            />

            <View style={styles.heroImageContainer}>
                <ImageWithFallback
                    src={campaign.image}
                    alt={campaign.title}
                    style={styles.heroImage}
                />
                {campaign.status && (
                    <View style={[styles.statusBadge, statusStyle]}>
                        <Text style={styles.statusText}>{campaign.status}</Text>
                    </View>
                )}
            </View>

            <View style={styles.infoContainer}>
                <View style={styles.typeTitle}>
                    <Feather
                        name={typeIcon}
                        size={20}
                        color="#3b82f6"
                        style={styles.typeIcon}
                    />
                    <View>
                        <Text style={styles.campaignType}>
                            {campaign.type} Campaign
                        </Text>
                        <Text style={styles.campaignTitle}>{campaign.title}</Text>
                    </View>
                </View>

                <View style={styles.tagsContainer}>
                    {campaign.tags.map(tag => (
                        <View key={tag} style={styles.tag}>
                            <Text style={styles.tagText}>#{tag}</Text>
                        </View>
                    ))}
                </View>

                <View style={styles.infoRow}>
                    <View style={styles.infoItem}>
                        <Feather name="calendar" size={16} color="#555" />
                        <Text style={styles.infoText}>{campaign.deadline}</Text>
                    </View>
                    <View style={[styles.infoItem, styles.infoSeparator]}>
                        <Feather name="users" size={16} color="#555" />
                        <Text style={styles.infoText}>{campaign.participants.length} participants</Text>
                    </View>
                </View>

                {campaign.goal && campaign.current !== undefined && (
                    <View style={styles.progressContainer}>
                        <View style={styles.progressTextRow}>
                            <View>
                                <Text style={styles.progressText}>
                                    {campaign.current.toLocaleString()} {campaign.unit}
                                </Text>
                                <Text style={styles.progressSubText}>
                                    raised of {campaign.goal.toLocaleString()} {campaign.unit} goal
                                </Text>
                            </View>
                            <View><Text style={styles.progressPercent}>{progress.toFixed(0)}%</Text></View>
                        </View>
                        <CampaignProgress percent={progress} height={8} />
                    </View>
                )}

                <View style={styles.actionsRow}>
                    {primaryAction && (
                        <CampaignActionButton
                            icon={primaryAction.icon}
                            label={primaryAction.text}
                            onPress={primaryAction.onPress}
                        />
                    )}

                    <TouchableOpacity style={styles.secondaryButton} onPress={handleShare}>
                        <Feather name="share-2" size={16} color="#333" />
                        <Text style={styles.secondaryButtonText}>Share</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.secondaryButton, isLiked && styles.secondaryButtonLiked]}
                        onPress={handleLikeToggle}
                    >
                        <Feather name="heart" size={16} color={isLiked ? 'red' : '#333'} />
                        <Text style={[styles.secondaryButtonText, isLiked && styles.secondaryButtonLikedText]}>
                            {isLiked ? 'Liked' : 'Like'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.tabsContainer}>
                <View style={styles.tabNavigation}>
                    {TABS.map((tab) => {
                        const isActive = activeTabId === tab.id;
                        const label = tab.getBadgeCount
                            ? `${tab.label} (${tab.getBadgeCount(campaign)})`
                            : tab.label;

                        return (
                            <TouchableOpacity
                                key={tab.id}
                                style={[styles.tabButton, isActive && styles.tabButtonActive]}
                                onPress={() => setActiveTabId(tab.id)}
                            >
                                <Text style={[styles.tabButtonText, isActive && styles.tabButtonTextActive]}>
                                    {label}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f8f8' }}>
            {activeTab?.renderContent(
                campaign,
                commentInputText,
                setCommentInputText,
                handlePostComment,
                renderHeader()
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        backgroundColor: '#f8f8f8',
    },

    heroImageContainer: {
        height: 240,
        marginHorizontal: 16,
        borderRadius: 20,
        overflow: 'hidden',
        marginBottom: 16,
    },
    heroImage: {
        width: '100%',
        height: '100%',
    },
    statusBadge: {
        position: 'absolute',
        top: 10,
        right: 10,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 20,
    },
    statusActive: {
        backgroundColor: '#22c55e',
    },
    statusUpcoming: {
        backgroundColor: '#3b82f6',
    },
    statusDefault: {
        backgroundColor: '#6b7280',
    },
    statusText: {
        color: '#fff',
        fontWeight: 'bold',
    },

    // Info Container
    infoContainer: {
        marginHorizontal: 16,
        marginBottom: 24,
    },
    typeTitle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    typeIcon: {
        marginRight: 8,
    },
    campaignType: {
        color: '#555',
        textTransform: 'capitalize',
    },
    campaignTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },

    // Tags
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 12,
    },
    tag: {
        backgroundColor: '#e5e7eb',
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 4,
        marginRight: 6,
        marginBottom: 6,
    },
    tagText: {
        color: '#555',
    },

    // Info Row
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoSeparator: {
        marginLeft: 16,
    },
    infoText: {
        marginLeft: 4,
        color: '#555',
    },

    // Progress
    progressContainer: {
        marginBottom: 16,
    },
    progressTextRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    progressText: {
        fontWeight: 'bold',
    },
    progressSubText: {
        color: '#555',
    },
    progressPercent: {
        color: '#3b82f6',
        fontWeight: 'bold',
    },

    // Action Buttons
    actionsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    secondaryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 16,
        marginRight: 8,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    secondaryButtonLiked: {
        backgroundColor: '#fee2e2',
    },
    secondaryButtonText: {
        color: '#333',
        marginLeft: 6,
    },
    secondaryButtonLikedText: {
        color: 'red',
    },

    // Tabs
    tabsContainer: {
        marginHorizontal: 16,
        marginBottom: 16,
    },
    tabNavigation: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
    tabButton: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
    },
    tabButtonActive: {
        borderBottomWidth: 2,
        borderColor: '#3b82f6',
    },
    tabButtonText: {
        color: '#555',
    },
    tabButtonTextActive: {
        color: '#3b82f6',
        fontWeight: 'bold',
    },
    tabContent: {
        paddingVertical: 12,
    },
});
