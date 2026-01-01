import { deleteCampaign } from '@/api/campaigns/campaigns';
import { ICampaign } from '@/interface/campaign.interface';
import { Feather } from "@expo/vector-icons";
import React, { useState } from 'react';
import {
    Alert,
    FlatList,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { ImageWithFallback } from '../ImageWithFallback';
import { CampaignActionButton } from './CampaignActionButton';
import { CampaignHeader } from './CampaignHeader';
import { calculateProgress, getCampaignActionConfig } from './campaignHelpers';
import { CampaignProgress } from './CampaignProgress';

interface CampaignDetailsProps {
    campaign: ICampaign;
    onBack: () => void;
    onEdit: (campaign: ICampaign) => void;
}

type TabId = 'about' | 'participants' | 'comments';

interface TabConfig {
    id: TabId;
    label: string;
    getBadgeCount?: (campaign: ICampaign) => number;
}

const TABS: TabConfig[] = [
    { id: 'about', label: 'About' },
    {
        id: 'participants',
        label: 'Participants',
        getBadgeCount: (campaign) => campaign.participants.length
    },
    {
        id: 'comments',
        label: 'Comments',
        getBadgeCount: (campaign) => campaign.comments.length
    },
];

export function CampaignDetails({ campaign, onBack, onEdit }: CampaignDetailsProps) {
    const [activeTab, setActiveTab] = useState<TabId>('about');
    const [newComment, setNewComment] = useState('');
    const [liked, setLiked] = useState(false);

    const progress = calculateProgress(campaign.current, campaign.goal);

    const getTypeIcon = (type: string): React.ComponentProps<typeof Feather>['name'] => {
        const icons: Record<string, React.ComponentProps<typeof Feather>['name']> = {
            donate: 'dollar-sign',
            volunteer: 'heart',
            awareness: 'bell',
            petition: 'message-circle',
            event: 'calendar',
        };
        return icons[type] || 'bell';
    };

    const handleParticipate = () => Alert.alert(`You've participated in: ${campaign.title}`);
    const handleDonate = () => Alert.alert(`Opening donation form for: ${campaign.title}`);
    const handleShare = () => Alert.alert('Share', 'Share functionality not implemented.');

    const handleDelete = () =>
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


    const getStatusStyle = () => {
        switch (campaign.status) {
            case 'active':
                return styles.statusActive;
            case 'upcoming':
                return styles.statusUpcoming;
            default:
                return styles.statusDefault;
        }
    };

    const primaryAction = getCampaignActionConfig(campaign.type, {
        onDonate: handleDonate,
        onParticipate: handleParticipate,
    });

    return (
        <SafeAreaView>
            <ScrollView style={styles.container}>

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
                        <View style={[styles.statusBadge, getStatusStyle()]}>
                            <Text style={styles.statusText}>{campaign.status}</Text>
                        </View>
                    )}
                </View>


                <View style={styles.infoContainer}>

                    <View style={styles.typeTitle}>
                        <Feather
                            name={getTypeIcon(campaign.type)}
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
                                <Text style={styles.progressPercent}>{progress.toFixed(0)}%</Text>
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
                            style={[styles.secondaryButton, liked && { backgroundColor: '#fee2e2' }]}
                            onPress={() => setLiked(!liked)}
                        >
                            <Feather name="heart" size={16} color={liked ? 'red' : '#333'} />
                            <Text style={[styles.secondaryButtonText, liked && { color: 'red' }]}>
                                {liked ? 'Liked' : 'Like'}
                            </Text>
                        </TouchableOpacity>

                    </View>

                </View >

                <View style={styles.tabsContainer}>
                    <View style={styles.tabNavigation}>
                        {TABS.map((tab) => {
                            const isActive = activeTab === tab.id;
                            const label = tab.getBadgeCount
                                ? `${tab.label} (${tab.getBadgeCount(campaign)})`
                                : tab.label;

                            return (
                                <TouchableOpacity
                                    key={tab.id}
                                    style={[styles.tabButton, isActive && styles.tabButtonActive]}
                                    onPress={() => setActiveTab(tab.id)}
                                >
                                    <Text style={[styles.tabButtonText, isActive && styles.tabButtonTextActive]}>
                                        {label}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>
            </ScrollView>

            <View style={styles.tabContent}>
                {activeTab === 'about' && (
                    <View>
                        <Text style={styles.sectionTitle}>Description</Text>
                        <Text style={styles.sectionText}>{campaign.fullDescription}</Text>

                        {campaign.mediaGallery && campaign.mediaGallery.length > 0 && (
                            <View>
                                <Text style={styles.sectionTitle}>Media Gallery</Text>
                                <FlatList
                                    data={campaign.mediaGallery}
                                    horizontal
                                    keyExtractor={(item, idx) => idx.toString()}
                                    renderItem={({ item }) => (
                                        <ImageWithFallback source={{ uri: item }} style={styles.mediaImage} />
                                    )}
                                />
                            </View>
                        )}
                    </View>
                )}



                {activeTab === 'participants' && (
                    <FlatList
                        data={campaign.participants}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => (
                            <View style={styles.participantRow}>
                                <ImageWithFallback source={{ uri: item.avatar }} style={styles.participantAvatar} />
                                <View>
                                    <Text style={styles.participantName}>{item.name}</Text>
                                    {item.contribution && <Text style={styles.participantContribution}>Contributed: {item.contribution}</Text>}
                                </View>
                            </View>
                        )}
                    />
                )}


                {activeTab === 'comments' && (
                    <View style={{ flex: 1 }}>
                        <View style={styles.commentInputRow}>
                            <Image
                                source={{ uri: 'https:api.dicebear.com/7.x/avataaars/svg?seed=You' }}
                                style={styles.commentAvatar}
                            />
                            <View style={{ flex: 1 }}>
                                <TextInput
                                    value={newComment}
                                    onChangeText={setNewComment}
                                    placeholder="Write a comment..."
                                    style={styles.commentInput}
                                    multiline
                                />
                                <TouchableOpacity style={styles.postCommentButton}>
                                    <Text style={styles.postCommentButtonText}>Post Comment</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <FlatList
                            data={campaign.comments}
                            keyExtractor={item => item.id}
                            renderItem={({ item }) => (
                                <View style={styles.commentRow}>
                                    <Image source={{ uri: item.avatar }} style={styles.commentAvatar} />
                                    <View style={{ flex: 1 }}>
                                        <View style={styles.commentBubble}>
                                            <Text style={styles.commentAuthor}>{item.author}</Text>
                                            <Text style={styles.commentText}>{item.content}</Text>
                                        </View>
                                        <Text style={styles.commentTimestamp}>{item.timestamp}</Text>
                                    </View>
                                </View>
                            )}
                        />
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f8f8' },



    heroImageContainer: { height: 240, marginHorizontal: 16, borderRadius: 20, overflow: 'hidden', marginBottom: 16 },
    heroImage: { width: '100%', height: '100%' },
    statusBadge: { position: 'absolute', top: 10, right: 10, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20 },
    statusActive: { backgroundColor: '#22c55e' },
    statusUpcoming: { backgroundColor: '#3b82f6' },
    statusDefault: { backgroundColor: '#6b7280' },
    statusText: { color: '#fff', fontWeight: 'bold' },

    infoContainer: { marginHorizontal: 16, marginBottom: 24 },
    typeTitle: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    typeIcon: { marginRight: 8 },
    campaignType: { color: '#555', textTransform: 'capitalize' },
    campaignTitle: { fontSize: 20, fontWeight: 'bold' },

    tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 },
    tag: { backgroundColor: '#e5e7eb', borderRadius: 12, paddingHorizontal: 8, paddingVertical: 4, marginRight: 6, marginBottom: 6 },
    tagText: { color: '#555' },

    infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    infoItem: { flexDirection: 'row', alignItems: 'center' },
    infoSeparator: { marginLeft: 16 },
    infoText: { marginLeft: 4, color: '#555' },

    progressContainer: { marginBottom: 16 },
    progressTextRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
    progressText: { fontWeight: 'bold' },
    progressSubText: { color: '#555' },
    progressPercent: { color: '#3b82f6', fontWeight: 'bold' },
    progressBar: { height: 8, backgroundColor: '#e5e7eb', borderRadius: 4 },
    progressFill: { height: 8, backgroundColor: '#3b82f6', borderRadius: 4 },

    actionsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    primaryButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#3b82f6', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 16, marginRight: 8, marginBottom: 8 },
    primaryButtonText: { color: '#fff', marginLeft: 6, fontWeight: '600' },
    secondaryButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 16, marginRight: 8, marginBottom: 8, borderWidth: 1, borderColor: '#ccc' },
    secondaryButtonText: { color: '#333', marginLeft: 6 },

    tabsContainer: { marginHorizontal: 16 },
    tabNavigation: { flexDirection: 'row', borderBottomWidth: 1, borderColor: '#ccc' },
    tabButton: { flex: 1, paddingVertical: 12, alignItems: 'center' },
    tabButtonActive: { borderBottomWidth: 2, borderColor: '#3b82f6' },
    tabButtonText: { color: '#555' },
    tabButtonTextActive: { color: '#3b82f6', fontWeight: 'bold' },
    tabContent: { paddingVertical: 12 },

    sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 6 },
    sectionText: { color: '#555', marginBottom: 12 },
    mediaImage: { width: 160, height: 90, borderRadius: 12, marginRight: 8 },

    participantRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderColor: '#e5e7eb' },
    participantAvatar: { width: 48, height: 48, borderRadius: 24, marginRight: 12 },
    participantName: { fontWeight: 'bold', color: '#333' },
    participantContribution: { color: '#555' },

    commentInputRow: { flexDirection: 'row', marginBottom: 12 },
    commentAvatar: { width: 40, height: 40, borderRadius: 20, marginRight: 8 },
    commentInput: { flex: 1, backgroundColor: '#fff', borderWidth: 1, borderColor: '#ccc', borderRadius: 12, padding: 8, minHeight: 60 },
    postCommentButton: { alignSelf: 'flex-end', marginTop: 4, backgroundColor: '#3b82f6', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
    postCommentButtonText: { color: '#fff', fontWeight: '600' },

    commentRow: { flexDirection: 'row', marginBottom: 12 },
    commentBubble: { backgroundColor: '#f3f4f6', padding: 8, borderRadius: 12, flex: 1 },
    commentAuthor: { fontWeight: 'bold', marginBottom: 2, color: '#333' },
    commentText: { color: '#555' },
    commentTimestamp: { fontSize: 12, color: '#888', marginTop: 2, marginLeft: 48 },
});
