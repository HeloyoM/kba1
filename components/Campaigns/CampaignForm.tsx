import { addCampaign, updateCampaign } from '@/api/campaigns/campaigns';
import { useAppUser } from '@/context/auth.context';
import { CampaignStatus, CampaignType, ICampaign } from '@/interface/campaign.interface';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Button, Image, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

interface CampaignFormProps {
    campaign: ICampaign | null;
    onSave: () => void;
    onCancel: () => void;
}

export function CampaignForm({ campaign, onSave, onCancel }: CampaignFormProps) {
    const { user } = useAppUser();
    const router = useRouter();
    const isPaying = user?.isPaying || (user?.subscriptionExpires && user.subscriptionExpires > Date.now());

    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: campaign?.title || '',
        description: campaign?.description || '',
        fullDescription: campaign?.fullDescription || '',
        type: campaign?.type || ('donate' as CampaignType),
        status: campaign?.status || ('active' as CampaignStatus),
        goal: campaign?.goal?.toString() || '',
        unit: campaign?.unit || '',
        startDate: campaign?.startDate || new Date().toISOString(),
        endDate: campaign?.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        tags: campaign?.tags.join(', ') || '',
        featured: campaign?.featured || false,
        urgent: campaign?.urgent || false,
        trending: campaign?.trending || false,
    });

    const [imagePreview, setImagePreview] = useState(campaign?.image || '');
    const [isFocusType, setIsFocusType] = useState(false);
    const [isFocusStatus, setIsFocusStatus] = useState(false);

    const handleInputChange = (field: string, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const calculateDeadline = (endDate: string) => {
        if (!endDate) return '';
        const end = new Date(endDate);
        const now = new Date();
        const diff = end.getTime() - now.getTime();
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        if (days < 0) return 'Ended';
        if (days === 0) return 'Ends today';
        if (days === 1) return '1 day left';
        return `${days} days left`;
    };

    const handleSubmit = async () => {
        console.log({ formData })
        if (!formData.title || !formData.description || !formData.type) {
            Alert.alert("Error", "Please fill in required fields");
            return;
        }

        setIsLoading(true);
        try {
            const campaignData: any = {
                title: formData.title,
                description: formData.description,
                fullDescription: formData.fullDescription,
                type: formData.type,
                status: formData.status,
                image: imagePreview || 'https://images.unsplash.com/photo-1593113630400-ea4288922497?crop=entropy&cs=tinysrgb&fit=max&fm=jpg',
                organizer: campaign?.organizer || {
                    name: 'Admin',
                    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
                    role: 'Administrator'
                },
                goal: formData.goal ? parseFloat(formData.goal) : undefined,
                current: campaign?.current || 0,
                unit: formData.unit || undefined,
                startDate: formData.startDate,
                endDate: formData.endDate,
                deadline: calculateDeadline(formData.endDate),
                participants: campaign?.participants || [],
                tags: formData.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean),
                featured: formData.featured,
                urgent: formData.urgent,
                trending: formData.trending,
                mediaGallery: campaign?.mediaGallery || [],
                comments: campaign?.comments || []
            };
            console.log({ campaignData })
            if (campaign?.id) {
                await updateCampaign(campaign.id, campaignData);
            } else {
                await addCampaign(campaignData);
            }
            onSave();
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Failed to save campaign");
        } finally {
            setIsLoading(false);
        }
    };

    const isEditing = !!campaign;

    const campaignTypes = [
        { label: 'Donate', value: 'donate' },
        { label: 'Volunteer', value: 'volunteer' },
        { label: 'Awareness', value: 'awareness' },
        { label: 'Petition', value: 'petition' },
        { label: 'Event', value: 'event' },
    ];

    const campaignStatuses = [
        { label: 'Active', value: 'active' },
        { label: 'Upcoming', value: 'upcoming' },
        { label: 'Completed', value: 'completed' },
    ];

    return (
        <ScrollView contentContainerStyle={{ padding: 16 }}>
            <View style={{ marginBottom: 24 }}>
                <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>
                    {isEditing ? 'Edit Campaign' : 'Create New Campaign'}
                </Text>

                {/* Title */}
                <Text style={styles.label}>Campaign Title *</Text>
                <TextInput
                    value={formData.title}
                    onChangeText={text => handleInputChange('title', text)}
                    placeholder="Enter campaign title"
                    style={styles.input}
                />

                {/* Short Description */}
                <Text style={styles.label}>Short Description *</Text>
                <TextInput
                    value={formData.description}
                    onChangeText={text => handleInputChange('description', text)}
                    placeholder="Brief description"
                    multiline
                    style={[styles.input, { minHeight: 60 }]}
                />

                {/* Full Description */}
                <Text style={styles.label}>Full Description *</Text>
                <TextInput
                    value={formData.fullDescription}
                    onChangeText={text => handleInputChange('fullDescription', text)}
                    placeholder="Detailed description"
                    multiline
                    style={[styles.input, { minHeight: 120 }]}
                />

                {/* Campaign Type & Status */}
                <View style={{ flexDirection: 'row', gap: 16, marginBottom: 16 }}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.label}>Type *</Text>
                        <Dropdown
                            style={[styles.dropdown, isFocusType && { borderColor: 'blue' }]}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={styles.inputSearchStyle}
                            iconStyle={styles.iconStyle}
                            data={campaignTypes}
                            search
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            placeholder={!isFocusType ? 'Select item' : '...'}
                            searchPlaceholder="Search..."
                            value={formData.type}
                            onFocus={() => setIsFocusType(true)}
                            onBlur={() => setIsFocusType(false)}
                            onChange={item => {
                                handleInputChange('type', item.value);
                                setIsFocusType(false);
                            }}
                        />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.label}>Status *</Text>
                        <Dropdown
                            style={[styles.dropdown, isFocusStatus && { borderColor: 'blue' }]}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={styles.inputSearchStyle}
                            iconStyle={styles.iconStyle}
                            data={campaignStatuses}
                            search
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            placeholder={!isFocusStatus ? 'Select item' : '...'}
                            searchPlaceholder="Search..."
                            value={formData.status}
                            onFocus={() => setIsFocusStatus(true)}
                            onBlur={() => setIsFocusStatus(false)}
                            onChange={item => {
                                handleInputChange('status', item.value);
                                setIsFocusStatus(false);
                            }}
                        />
                    </View>
                </View>

                {/* Goal & Unit */}
                <View style={{ flexDirection: 'row', gap: 16, marginBottom: 16 }}>
                    <TextInput
                        value={formData.goal}
                        onChangeText={text => handleInputChange('goal', text)}
                        placeholder="Goal"
                        keyboardType="numeric"
                        style={[styles.input, { flex: 1 }]}
                    />
                    <TextInput
                        value={formData.unit}
                        onChangeText={text => handleInputChange('unit', text)}
                        placeholder="Unit"
                        style={[styles.input, { flex: 1 }]}
                    />
                </View>

                {/* Image */}
                <Text style={styles.label}>Campaign Image URL</Text>
                <TextInput
                    value={imagePreview}
                    onChangeText={setImagePreview}
                    placeholder="Image URL"
                    style={[styles.input, { marginBottom: 8 }]}
                />
                {imagePreview ? (
                    <View style={{ marginBottom: 16 }}>
                        <Image
                            source={{ uri: imagePreview }}
                            style={{ width: '100%', height: 200, borderRadius: 12, marginBottom: 8 }}
                        />
                    </View>
                ) : null}

                {/* Tags */}
                <Text style={styles.label}>Tags (comma-separated)</Text>
                <TextInput
                    value={formData.tags}
                    onChangeText={text => handleInputChange('tags', text)}
                    placeholder="e.g., health, community"
                    style={styles.input}
                />

                {/* Featured / Urgent / Trending */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text>Featured</Text>
                        <Switch
                            value={formData.featured}
                            onValueChange={value => handleInputChange('featured', value)}
                        />
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text>Urgent</Text>
                        <Switch
                            value={formData.urgent}
                            onValueChange={value => handleInputChange('urgent', value)}
                        />
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text>Trending</Text>
                        <Switch
                            value={formData.trending}
                            onValueChange={value => handleInputChange('trending', value)}
                        />
                    </View>
                </View>

                {/* Action Buttons */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 32 }}>
                    <Button title="Cancel" onPress={onCancel} color="#888" />
                    {isLoading ? (
                        <ActivityIndicator size="small" color="#0000ff" />
                    ) : (
                        <Button
                            title={isEditing ? 'Update Campaign' : 'Create Campaign'}
                            onPress={isPaying ? handleSubmit : () => {
                                Alert.alert("Upgrade Required", "You need to pay for the system to create campaigns.", [
                                    { text: "Cancel", style: "cancel" },
                                    { text: "Upgrade", onPress: () => router.push('/billing') }
                                ]);
                            }}
                            disabled={!isPaying}
                        />
                    )}
                </View>
                {!isPaying && (
                    <Text style={{ color: 'red', textAlign: 'center', marginBottom: 20 }}>
                        * Upgrade to premium to create or edit campaigns
                    </Text>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    label: { marginBottom: 4, fontWeight: '500' },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 12,
        padding: 12,
        marginBottom: 16,
    },
    dropdown: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
});

