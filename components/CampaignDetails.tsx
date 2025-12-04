import { Campaign } from '@/app/(tabs)/community';
import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Image,
    StyleSheet,
    FlatList,
    Alert,
} from 'react-native';
import { Feather } from "@expo/vector-icons";
import { ImageWithFallback } from './ImageWithFallback';
// import { ImageWithFallback } from './ImageWithFallback';
// import { Campaign } from '@/app/(tabs)/community';

interface CampaignDetailsProps {
    campaign: Campaign;
    onBack: () => void;
    onEdit: (campaign: Campaign) => void;
}

export function CampaignDetails({ campaign, onBack, onEdit }: CampaignDetailsProps) {
    const [activeTab, setActiveTab] = useState<'about' | 'participants' | 'comments'>('about');
    const [newComment, setNewComment] = useState('');
    const [liked, setLiked] = useState(false);

    const progress =
        campaign.goal && campaign.current ? (campaign.current / campaign.goal) * 100 : 0;

    //     const getTypeIcon = () => {
    //         const icons: Record<string, string> = {
    //             donate: 'dollar-sign',
    //             volunteer: 'heart',
    //             awareness: 'bell',
    //             petition: 'message-circle',
    //             event: 'calendar',
    //         };
    //         return icons[campaign.type] || 'bell';
    //     };

    const handleParticipate = () => Alert.alert(`You've participated in: ${campaign.title}`);
    const handleDonate = () => Alert.alert(`Opening donation form for: ${campaign.title}`);
    const handleShare = () => Alert.alert('Share', 'Share functionality not implemented.');
    const handleDelete = () =>
        Alert.alert('Delete', 'Are you sure?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: onBack },
        ]);

    return (
        <>
            <ScrollView style={styles.container}>


                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={onBack}>
                        <Feather name="arrow-left" size={20} color="#333" />
                        <Text style={styles.backText}>Back</Text>
                    </TouchableOpacity>
                    <View style={styles.headerActions}>
                        <TouchableOpacity onPress={() => onEdit(campaign)} style={styles.iconButton}>
                            <Feather name="edit" size={20} color="#333" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleDelete} style={styles.iconButton}>
                            <Feather name="trash-2" size={20} color="red" />
                        </TouchableOpacity>
                    </View>
                </View>


                <View style={styles.heroImageContainer}>
                    <ImageWithFallback
                        src={campaign.image}
                        alt={campaign.title}
                        style={styles.heroImage}
                    />
                    {campaign.status && (
                        <View
                            style={[
                                styles.statusBadge,
                                campaign.status === 'active'
                                    ? { backgroundColor: '#22c55e' }
                                    : campaign.status === 'upcoming'
                                        ? { backgroundColor: '#3b82f6' }
                                        : { backgroundColor: '#6b7280' },
                            ]}
                        >
                            <Text style={styles.statusText}>{campaign.status.toUpperCase()}</Text>
                        </View>
                    )}
                </View>


                <View style={styles.infoContainer}>

                    <View style={styles.typeTitle}>
                        <Feather size={20} color="#3b82f6" style={styles.typeIcon} />
                        <View>
                            <Text style={styles.campaignType}>
                                {campaign.type.charAt(0).toUpperCase() + campaign.type.slice(1)} Campaign
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
                        <Feather name="calendar" size={16} color="#555" />
                        <Text style={styles.infoText}>{campaign.deadline}</Text>
                        <Feather name="users" size={16} color="#555" style={{ marginLeft: 16 }} />
                        <Text style={styles.infoText}>{campaign.participants.length} participants</Text>
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
                            <View style={styles.progressBar}>
                                <View style={[styles.progressFill, { width: `${Math.min(progress, 100)}%` }]} />
                            </View>
                        </View>
                    )}




                    <View style={styles.actionsRow}>
                        {campaign.type === 'donate' && (
                            <TouchableOpacity style={styles.primaryButton} onPress={handleDonate}>
                                <Feather name="dollar-sign" size={16} color="#fff" />
                                <Text style={styles.primaryButtonText}>Donate Now</Text>
                            </TouchableOpacity>
                        )}
                        {(campaign.type === 'volunteer' || campaign.type === 'event') && (
                            <TouchableOpacity style={styles.primaryButton} onPress={handleParticipate}>
                                <Feather name="heart" size={16} color="#fff" />
                                <Text style={styles.primaryButtonText}>Join Campaign</Text>
                            </TouchableOpacity>
                        )}
                        {campaign.type === 'awareness' && (
                            <TouchableOpacity style={styles.primaryButton} onPress={handleParticipate}>
                                <Feather name="bell" size={16} color="#fff" />
                                <Text style={styles.primaryButtonText}>Spread Awareness</Text>
                            </TouchableOpacity>
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
                    <View style={styles.tabButtonsRow}>
                        <TouchableOpacity
                            style={[styles.tabButton, activeTab === 'about' && styles.tabButtonActive]}
                            onPress={() => setActiveTab('about')}
                        >
                            <Text style={[styles.tabButtonText, activeTab === 'about' && styles.tabButtonTextActive]}>
                                About
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.tabButton, activeTab === 'participants' && styles.tabButtonActive]}
                            onPress={() => setActiveTab('participants')}
                        >
                            <Text
                                style={[
                                    styles.tabButtonText,
                                    activeTab === 'participants' && styles.tabButtonTextActive,
                                ]}
                            >
                                Participants ({campaign.participants.length})
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.tabButton, activeTab === 'comments' && styles.tabButtonActive]}
                            onPress={() => setActiveTab('comments')}
                        >
                            <Text style={[styles.tabButtonText, activeTab === 'comments' && styles.tabButtonTextActive]}>
                                Comments ({campaign.comments.length})
                            </Text>
                        </TouchableOpacity>
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
        </>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f8f8' },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        alignItems: 'center',
    },
    backButton: { flexDirection: 'row', alignItems: 'center' },
    backText: { marginLeft: 6, fontSize: 16, color: '#333' },
    headerActions: { flexDirection: 'row', alignItems: 'center' },
    iconButton: { marginLeft: 12 },

    heroImageContainer: { height: 240, marginHorizontal: 16, borderRadius: 20, overflow: 'hidden', marginBottom: 16 },
    heroImage: { width: '100%', height: '100%' },
    statusBadge: { position: 'absolute', top: 10, right: 10, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20 },
    statusText: { color: '#fff', fontWeight: 'bold' },

    infoContainer: { marginHorizontal: 16, marginBottom: 24 },
    typeTitle: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    typeIcon: { marginRight: 8 },
    campaignType: { color: '#555' },
    campaignTitle: { fontSize: 20, fontWeight: 'bold' },

    tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 },
    tag: { backgroundColor: '#e5e7eb', borderRadius: 12, paddingHorizontal: 8, paddingVertical: 4, marginRight: 6, marginBottom: 6 },
    tagText: { color: '#555' },

    infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
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
    tabButtonsRow: { flexDirection: 'row', borderBottomWidth: 1, borderColor: '#ccc' },
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
