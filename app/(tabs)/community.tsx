import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { CampaignFeed } from '@/components/CampaignFeed';
import { CampaignDetails } from '@/components/CampaignDetails';
// import { CampaignForm } from '@/components/CampaignForm';

export type CampaignType = 'donate' | 'volunteer' | 'awareness' | 'petition' | 'event';

export type CampaignStatus = 'active' | 'completed' | 'upcoming';

export interface Campaign {
    id: string;
    title: string;
    description: string;
    fullDescription: string;
    type: CampaignType;
    status: CampaignStatus;
    image: string;
    organizer: {
        name: string;
        avatar: string;
        role: string;
    };
    goal?: number;
    current?: number;
    unit?: string;
    startDate: string;
    endDate: string;
    deadline: string;
    participants: Array<{
        id: string;
        name: string;
        avatar: string;
        contribution?: string;
    }>;
    tags: string[];
    featured: boolean;
    urgent: boolean;
    trending: boolean;
    mediaGallery?: string[];
    comments: Array<{
        id: string;
        author: string;
        avatar: string;
        content: string;
        timestamp: string;
    }>;
}


type ViewType = 'feed' | 'details' | 'create' | 'edit';

export default function Community() {
    const [currentView, setCurrentView] = useState<ViewType>('feed');
    const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

    const handleViewCampaign = (campaign: Campaign) => {
        setSelectedCampaign(campaign);
        setCurrentView('details');
    };

    const handleCreateCampaign = () => {
        setSelectedCampaign(null);
        setCurrentView('create');
    };

    const handleEditCampaign = (campaign: Campaign) => {
        setSelectedCampaign(campaign);
        setCurrentView('edit');
    };

    const handleBackToFeed = () => {
        setCurrentView('feed');
        setSelectedCampaign(null);
    };

    const handleSaveCampaign = (campaign: Campaign) => {
        // In a real app, this would save to backend
        console.log('Saving campaign:', campaign);
        handleBackToFeed();
    };

    return (
        <SafeAreaView style={styles.container}>
            {currentView === 'feed' && (
                <CampaignFeed
                    onViewCampaign={handleViewCampaign}
                    onCreateCampaign={handleCreateCampaign}
                />
            )}

            {currentView === 'details' && selectedCampaign && (
                <CampaignDetails
                    campaign={selectedCampaign}
                    onBack={handleBackToFeed}
                    onEdit={handleEditCampaign}
                />
            )}

            {/* {(currentView === 'create' || currentView === 'edit') && (
                <CampaignForm
                    campaign={selectedCampaign}
                    onSave={handleSaveCampaign}
                    onCancel={handleBackToFeed}
                />
            )} */}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});
