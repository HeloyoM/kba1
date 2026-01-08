import { CampaignDetails } from '@/components/Campaigns/CampaignDetails';
import { CampaignFeed } from '@/components/Campaigns/CampaignFeed';
import { CampaignForm } from '@/components/Campaigns/CampaignForm';
import { ICampaign } from '@/interface/campaign.interface';
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';

type ViewType = 'feed' | 'details' | 'create' | 'edit';

export default function Community() {
    const [currentView, setCurrentView] = useState<ViewType>('feed');
    const [selectedCampaign, setSelectedCampaign] = useState<ICampaign | null>(null);

    const handleViewCampaign = (campaign: ICampaign) => {
        setSelectedCampaign(campaign);
        setCurrentView('details');
    };

    const handleCreateCampaign = () => {
        setSelectedCampaign(null);
        setCurrentView('create');
    };

    const handleEditCampaign = (campaign: ICampaign) => {
        setSelectedCampaign(campaign);
        setCurrentView('edit');
    };

    const handleBackToFeed = () => {
        setCurrentView('feed');
        setSelectedCampaign(null);
    };

    const handleSaveCampaign = (campaign: ICampaign) => {
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

            {(currentView === 'create' || currentView === 'edit') && (
                <CampaignForm
                    campaign={selectedCampaign}
                    onSave={() => handleSaveCampaign(null as any)}
                    onCancel={handleBackToFeed}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});
